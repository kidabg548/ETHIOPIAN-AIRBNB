import { Types, Document } from 'mongoose';

export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  // New fields for detailed information
  phoneNumber?: string;
  isEmailVerified?:boolean;
  dateOfBirth?: Date;
  nationality?: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  passportDetails: {
    firstName: string;
    lastName: string;
    issuingCountry: string;
    number: string;
    expiryDate: Date;
  };
  verified: boolean;
  isActive: boolean;
}; 

export type SavedHotelType = {
  _id: string;
  userId: string;
  hotelId: {_id: string};
  lastUpdated: Date;
 
};


export type LocationType = {
  latitude: number;
  longitude: number;
};

export type ReviewType = {
  _id: string;
  hotelId: string;
  bookingId: string;
  userId: string;
  staffRating: number;
  facilitiesRating: number;
  cleanlinessRating: number;
  comfortRating: number;
  valueForMoneyRating: number;
  locationRating: number;
  freeWifiRating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type RoomType = {
  _id: string;
  hotelId: string; // Reference to the hotel's _id
  roomType: string; // e.g., "King Suite", "Double Room"
  capacity: number; // Number of guests
  pricePerNight: number; // Price per night
  amenities: string[]; // Array of amenities
  availability: boolean; // True if available, False if booked
  numberOfRooms: number;
  imageUrl?: string; // Optional image URL for the room
  cancellationPolicy: string; // Add cancellationPolicy
};

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  facilities: string[];
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
  reviews: ReviewType[];
  location: LocationType; 
  averageRating?: number;
  rooms: RoomType[];
  status: 'Pending' | 'Approved' | 'Rejected';  // Add this field
  reviewCount: number;
  // pdfFile?: File; // Add this line to include pdfFile
};

export type NotificationType = {
  _id: string;
  hotelId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
};


export interface BookingType extends Document {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  hotelId: Types.ObjectId; // Use Types.ObjectId for Mongoose ObjectId
  rooms: { 
    roomId: string; // Room ID
    quantity: number;
  }[]; // Array to store room details (ID and quantity)
  ticketNumber: string; // New field for ticket number
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled'; // Add status field
}


export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };

export type PaymentIntentResponse = {
    paymentIntentId: string;
    clientSecret: string;
};
