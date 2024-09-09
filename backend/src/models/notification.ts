import mongoose from "mongoose";

// Define the Notification schema
const notificationSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }, // Reference to the Hotel
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }, // Status of the notification
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // Timestamp for when the notification was created
});

// Define the Notification model using the schema
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;