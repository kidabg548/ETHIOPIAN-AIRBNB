import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import myHotelRoutes from './routes/my-hotels';
import hotelRoutes from "./routes/hotels";
import reviewRoutes from "./routes/review";
import roomRoutes from "./routes/room"
import bookingRoutes from "./routes/my-bookings";
import savedHotelsRoutes from './routes/savedHotels'
import pendingHotelsRoutes from './routes/admin'
import emailVerificationRoutes from "./routes/emailVerificationRoutes"
import chapaRoutes from "./routes/chapaRoutes"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/saved-hotels", savedHotelsRoutes);
app.use("/api/admin", pendingHotelsRoutes);
app.use("/api", emailVerificationRoutes);
app.use('/chapa', chapaRoutes);


app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});
