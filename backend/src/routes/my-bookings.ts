import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../../shared/types";
import Booking from "../models/booking";


const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

router.get('/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const booking = await Booking.findOne({ ticketNumber });

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/owner/bookings', verifyToken, async (req, res) => {

  try {
    // Find all hotels owned by the specified owner
    const hotels = await Hotel.find({ userId: req.userId });

    // Extract hotel IDs from the found hotels
    const hotelIds = hotels.map((hotel) => hotel._id); // Assuming _id is your hotel ID field

    // Find all bookings associated with any of the hotels
    const bookings = await Booking.find({ hotelId: { $in: hotelIds } });

    // Send the total count of bookings
    res.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// GET /api/bookings/checkin/:date
router.get('/checkin/:date', verifyToken, async (req, res) => {
  const { date } = req.params;

  try {
    // Find all hotels owned by the specified owner
    const hotels = await Hotel.find({ userId: req.userId });

    // Extract hotel IDs from the found hotels
    const hotelIds = hotels.map((hotel) => hotel._id); 

    // Find bookings with check-in date matching the provided date
    const bookings = await Booking.find({
      hotelId: { $in: hotelIds },
      checkIn: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
    });
    

    // Send the list of bookings.populate('hotelId')
    res.json({ bookings }); 
  } catch (error) {
    console.error('Error fetching bookings by check-in date:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/bookings/checkout/:date
router.get('/checkout/:date', verifyToken, async (req, res) => {
  const { date } = req.params;

  try {
    // Find all hotels owned by the specified owner
    const hotels = await Hotel.find({ userId: req.userId });

    // Extract hotel IDs from the found hotels
    const hotelIds = hotels.map((hotel) => hotel._id); 

    // Find bookings with check-out date matching the provided date
    const bookings = await Booking.find({
      hotelId: { $in: hotelIds },
      checkOut: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
    });
   

    // Send the list of bookings
    res.json({ bookings }); 
  } catch (error) {
    console.error('Error fetching bookings by check-out date:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/owner/owner', verifyToken, async (req, res) => {

  try {
    // Find all hotels owned by the specified owner
    const hotels = await Hotel.find({ userId: req.userId });

    // Extract hotel IDs from the found hotels
    const hotelIds = hotels.map((hotel) => hotel._id); // Assuming _id is your hotel ID field

    // Find all bookings associated with any of the hotels
    const bookings = await Booking.find({ hotelId: { $in: hotelIds } });

    // Send the total count of bookings
    res.json({ bookingCount: bookings.length });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;