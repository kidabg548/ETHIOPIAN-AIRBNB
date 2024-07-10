import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { BookingType, HotelSearchResponse,
  HotelType,
  PaymentIntentResponse, ReviewType, RoomType, SavedHotelType, UserType } from "../../backend/shared/types";
// import { BookingFormData } from "./forms/BookingForm/BookingForm";
import {BookingFormData2} from "./forms/BookingForm2/BookingForm"
import { ReviewFormData } from "./forms/ReviewForm/reviewForm";
import { PersonalDetailsFormData } from "./pages/ManageAccount/PersonalDetails";
import { RoomFormData } from "./forms/ManageHotelForm/RoomSection";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import dayjs from "dayjs";

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const fetchAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/all-users`);
  if (!response.ok) {
    throw new Error('Error fetching users');
  }
  return response.json();
};

export const fetchCurrentUserForVerification = async (): Promise<{
  verified: boolean;
  isProfileComplete: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/users/verificationstatus`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching user for verification");
  }

  const user: {
    verified: boolean;
    isProfileComplete: boolean;
  } = await response.json();

  return user;
};


export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const updatePassword = async ({
  currentPassword, 
  newPassword, 
  confirmPassword,
}: { currentPassword: string; newPassword: string; confirmPassword: string; }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/update-password`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error updating password");
  }

  return response.json();
};

export const updatePersonalDetails = async (
  formData: PersonalDetailsFormData
) => {
  const data = new FormData();

  // Append all form data fields to FormData object
  Object.keys(formData).forEach((key) => {
    const value = (formData as any)[key];
    if (value !== undefined && key !== 'profilePicture') { // Exclude profilePicture file input
      data.append(key, value);
    }
  });

  // Append the profile picture file if it exists
  if (formData.profilePicture instanceof File) {
    data.append('profilePicture', formData.profilePicture);
  }

  const response = await fetch(`${API_BASE_URL}/api/users/me/personal-details`, {
    method: "PUT",
    credentials: "include", // Ensure cookies are sent
    body: data, // Send the FormData object
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Error updating personal details");
  }

  return response.json();
};



export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  }); 

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const addRoom = async (roomData: RoomFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/rooms`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add room");
  }

  return await response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchMyReviews = async (): Promise<ReviewType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/review/user`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching reviews");
  }

  return response.json();
};


export const fetchPendingHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/pending-hotels`, {
  });

  if (!response.ok) {
    throw new Error("Error fetching rooms");
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const fetchBookingByTicket = async (ticketNumber: string): Promise<BookingType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings/${ticketNumber}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};


export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("page", searchParams.page || "");
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotel");
  }

  return response.json();
};

export const fetchRoomById = async (roomId: string): Promise<RoomType> => {
  const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`);
  if (!response.ok) {
    throw new Error("Error fetching Room");
  }

  return response.json();
};

export const fetchRoomsByHotelId = async (hotelId: string): Promise<RoomType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/rooms/hotels/${hotelId}/rooms`);
  if (!response.ok) {
    throw new Error("Error fetching Rooms");
  }

  return response.json(); 
};

export const createPaymentIntent = async (
  hotelId: string,
  totalCost: number // Updated parameter to reflect calculated totalPrice
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ totalCost }), // Send totalPrice
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};


export const createRoomBooking = async (formData: BookingFormData2) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
};

export const submitReview = async (reviewData: ReviewFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/review/${reviewData.hotelId}/${reviewData.bookingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || "Error submitting review");
  }

  return response.json();
};

// apiClient.ts
export const fetchReviewsByHotelId = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/review/${hotelId}/reviews`);
  if (!response.ok) {
    throw new Error("Error fetching reviews");
  }
  return response.json();
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch bookings");
  }

  return response.json();
};

export const saveHotel = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/saved-hotels/${hotelId}`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to save hotel: ${errorMessage}`);
  }

  return response.json(); // Return the response data
};

export const unsaveHotel = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/saved-hotels/${hotelId}`, {
    method: "DELETE",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to unsave hotel: ${errorMessage}`);
  }

  return response.json(); // Return the response data
};


export const fetchSavedHotels = async (): Promise<SavedHotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/saved-hotels`, {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch saved hotels');
  }

  return response.json();
};


export const sendEmailVerification = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/api/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP');
  }

  return response.json();
};

export const verifyOtp = async (userId: string, otp: string) => {
  try {
    console.log("Sending OTP verification request with userId:", userId, "and OTP:", otp);
    const response = await fetch("http://localhost:7000/api/verify-otp", { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, otp }), 
    });
    console.log("API Response (before parsing):", response); 
    if (!response.ok) {
      const errorData = await response.json(); 
      console.error("API Error:", errorData);
      throw new Error(`Error: ${errorData.message}`);
    }
    const data = await response.json();
    console.log("API Response (parsed):", data); 
    return data; 
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};


export const fetchReviewCount = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/review/${hotelId}/review-count`);
  if (!response.ok) {
    throw new Error("Error fetching review count");
  }
  const data = await response.json();
  return data.count;
};
// api-client.js

  // Assuming your API returns { bookingCount: ... }

export const fetchBookingCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings/owner/owner`, {
      method: 'GET',
      credentials: 'include', // Include credentials (cookies) if you're using authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    const data = await response.json();
    return data.bookingCount; // Return the booking count or any other data you need
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    // Handle error (e.g., show a toast or error message to the user)
    return null;
  }
};
export const fetchBookingsByCheckinDate = async (date: dayjs.Dayjs) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings/checkin/${date.format('YYYY-MM-DD')}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings by check-in date');
    }

    const data = await response.json();
    return data.bookings; // Assuming your backend sends an array of bookings
  } catch (error) {
    console.error('Error fetching bookings by check-in date:', error);
    return []; // Return an empty array on error
  }
};

export const fetchBookingsByCheckoutDate = async (date: dayjs.Dayjs) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings/checkout/${date.format('YYYY-MM-DD')}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings by check-out date');
    }

    const data = await response.json();
    return data.bookings; // Assuming your backend sends an array of bookings
  } catch (error) {
    console.error('Error fetching bookings by check-out date:', error);
    return []; // Return an empty array on error
  }
};

export const fetchBookingsByOwner = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings/owner/bookings`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings by ');
    }

    const data = await response.json();
    return data.bookings; // Assuming your backend sends an array of bookings
  } catch (error) {
    console.error('Error fetching bookings', error);
    return []; // Return an empty array on error
  }
};
export const fetchHotelName = async (hotelId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotel name');
    }

    const data = await response.json();
    return data.name; 
  } catch (error) {
    console.error('Error fetching hotel name:', error);
    return 'Hotel Not Found'; 
  }
};

export const deactivateAccount = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/deactivate`, {
    method: "PUT",
    credentials: "include", // Ensures cookies (auth token) are included
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};