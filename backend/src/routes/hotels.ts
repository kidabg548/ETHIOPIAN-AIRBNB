import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
import mongoose from 'mongoose';
import Booking from "../models/booking";
import { Transaction } from "../models/transaction";
import { generateTicketNumber } from "../utils/ticketGenerator";


const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();


router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 }; 
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)

      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels.map(hotel => ({
        ...hotel.toObject(),
        averageRating: hotel.averageRating 
      })),
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
      const hotel = await Hotel.findById(id)
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const hotelId = req.params.hotelId;
    const { totalCost } = req.body; // Get totalPrice from request body

    if (!totalCost) {
      return res.status(400).json({ message: "Total price is required" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100, // Convert to smallest currency unit (e.g., cents)
      currency: "ETB",
      metadata: {
        hotelId,
        userId: req.userId,
        totalCost: totalCost // Include totalCost in metadata
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
    };

    res.send(response);
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const totalCost = req.body.totalCost; // Assuming you get totalCost from request body

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
        totalCost: totalCost,
        hotelId: req.params.hotelId,
        rooms: Object.entries(req.body.rooms) 
            .map(([roomId, quantity]) => ({ roomId, quantity })),
        ticketNumber: generateTicketNumber(), // Generate and include ticket number here
        status: "confirmed"
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      const booking = new Booking(newBooking);
      await booking.save();

      for (const room of newBooking.rooms) {
        await Booking.updateRoomAvailability(
          room.roomId,
          room.quantity,
          newBooking.checkIn, 
          newBooking.checkOut 
        );
      }
      await hotel.save();

      // Calculate commission and hotel owner amounts
      const commissionAmount = totalCost * 0.08; // 8% for your company
      const hotelOwnerAmount = totalCost * 0.92; // 92% for hotel owner

      // Create and save the transaction
      const transaction = new Transaction({
        bookingId: booking._id, // Reference to the created booking
        transactionId: paymentIntent.id, // Stripe payment intent ID
        userId: req.userId, // User ID associated with the booking
        ticketNumber: booking.ticketNumber,
        hotelId: req.params.hotelId, // Hotel ID
        amount: totalCost, // Total amount processed
        commissionAmount: commissionAmount, // Commission amount
        hotelOwnerAmount: hotelOwnerAmount, // Amount for hotel owner
        transactionType: 'payment', // Set transaction type to 'payment'
        createdAt: new Date(), // Current date
      });

      await transaction.save(); // Save the transaction to the database

      res.status(200).json({ message: "Booking and transaction created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);


const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

router.get('/cities/:country', async (req: Request, res: Response) => {
  const { country } = req.params;
  try {
    const cities = await Hotel.aggregate([
      { $match: { country } },  // Match the country
      { $group: { _id: "$city", hotelCount: { $sum: 1 } } }  // Group by city and count hotels
    ]);
    res.json(cities.map(city => ({ city: city._id, hotelCount: city.hotelCount })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

router.get('/hotels/:city', async (req: Request, res: Response) => {
  const { city } = req.params;
  try {
    const hotels = await Hotel.find({ city });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});




export default router;
