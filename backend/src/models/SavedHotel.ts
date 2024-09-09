import mongoose from 'mongoose';
import { SavedHotelType } from '../../shared/types';

const savedhotelSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }, 
    lastUpdated: { type: Date, required: true },
  });


const SavedHotel = mongoose.model<SavedHotelType>('SavedHotel', savedhotelSchema);

export default SavedHotel;