import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from 'cloudinary';
import Hotel from "../models/hotel";
import { HotelType, RoomType } from "../../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import Room from "../models/room";
import Notification from "../models/notification";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  '/',
  verifyToken,
  upload.array('imageFiles', 10),
  [
    // Hotel validation
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').notEmpty().withMessage('Hotel type is required'),
    body('facilities').isArray().withMessage('Facilities are required'),
    // Room validation
    body('roomType').notEmpty().withMessage('Room type is required'),
    body('capacity')
      .notEmpty()
      .isNumeric()
      .withMessage('Capacity is required and must be a number'),
    body('pricePerNight')
      .notEmpty()
      .isNumeric()
      .withMessage('Price per night is required and must be a number'),
  ],
  async (req: Request, res: Response) => {
    try {
      // 1. Handle hotel creation
      const newHotel: HotelType = req.body; 
      const imageFiles = req.files as Express.Multer.File[];

      const imageUrls = await uploadImages(imageFiles);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;
      newHotel.status = 'Pending'; 

      const savedHotel = new Hotel(newHotel)
      await savedHotel.save();

      // 2. Handle room creation for the saved hotel
      const newRoom: RoomType = req.body; // Assuming the room data is also in the request body
      newRoom.hotelId = savedHotel._id; // Assign the hotel ID to the room

      const savedRoom = new Room(newRoom);
      await savedRoom.save();

      // Add room reference to the hotel
      await Hotel.findByIdAndUpdate(savedHotel._id, {
        $push: { rooms: savedRoom._id },
      });

      const notification = new Notification({
        hotelId: savedHotel._id,
        status: 'Pending' 
      });
      await notification.save();
     

      // 3. Return the saved hotel along with its rooms
      res.status(201).json({ message: 'Hotel and rooms created successfully', hotel: savedHotel });
    } catch (e) {
      console.error('Error creating hotel and rooms:', e);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);


async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
export default router;

