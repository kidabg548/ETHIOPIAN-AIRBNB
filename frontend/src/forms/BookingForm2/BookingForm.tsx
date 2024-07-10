import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import axios from 'axios'; 
import stripeLogo from '../../assets/stripe.png'
import chapaLogo from '../../assets/chapa.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";


type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
  totalCost: number; // Add totalPrice here
  selectedRooms: { [key: string]: number };
};

export type BookingFormData2 = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number; // Add totalPrice here
  rooms: { [key: string]: number };
  paymentMethod: "stripe" | "chapa"; // Add payment method field
};

const BookingForm2 = ({ currentUser, paymentIntent, totalCost, selectedRooms  }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const search = useSearchContext();
  const { hotelId } = useParams();

  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
        navigate('/')
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  const { handleSubmit, register, watch } = useForm<BookingFormData2>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId || "", 
      totalCost: totalCost,  // Ensure this is being set correctly
      paymentIntentId: paymentIntent.paymentIntentId,
      paymentMethod: "stripe", // Default to stripe
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chapa/api/pay`, {
        amount: totalCost, 
        currency: 'ETB', 
        email: currentUser.email,
        first_name: currentUser.firstName,
        last_name: currentUser.lastName,
      });

      if (response.status === 200) {
        const { checkout_url } = response.data;
        console.log("Response data : ", checkout_url);
        if (checkout_url) {
          window.location.href = checkout_url; // Redirect to the checkout URL
        }
      } else {
        showToast({ message: "Failed to initiate payment", type: "ERROR" });
      }
    } catch (error) {
      showToast({ message: "Failed to place the order", type: "ERROR" });
    }
  };

  const onSubmit = async (formData: BookingFormData2) => {
    if (selectedPaymentMethod === "stripe") {
      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement) as StripeCardElement,
        },
      });

      if (result.paymentIntent?.status === "succeeded") {
        bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id, rooms: selectedRooms, });
      }
    } else if (selectedPaymentMethod === "chapa") {
      handlePlaceOrder();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>

      <div className="flex gap-20">
  <label className="flex items-center gap-2 font-bold text-2xl">
    <input 
      type="radio" 
      value="stripe"
      checked={selectedPaymentMethod === "stripe"} 
      {...register("paymentMethod")} 
      className="w-6 h-6" // Added className for radio button styling
    />
    <img src={stripeLogo} alt="Stripe Logo" className="h-14 w-auto" />
    Stripe
  </label>
  <label className="flex font-bold text-2xl items-center gap-2">
    <input 
      type="radio" 
      value="chapa"
      checked={selectedPaymentMethod === "chapa"} 
      {...register("paymentMethod")} 
      className="w-6 h-6" // Added className for radio button styling
    />
    <img src={chapaLogo} alt="Chapa Logo" className="h-20 w-auto" />
    Chapa
  </label>
</div>

      {selectedPaymentMethod === "stripe" && (
        <div className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
          <span className="text-3xl font-bold">Confirm Your Details</span>
          <div className="grid grid-cols-2 gap-6">
            <label className="text-gray-700 text-sm font-bold flex-1">
              First Name
              <input
                className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                type="text"
                readOnly
                disabled
                {...register("firstName")}
              />
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
              Last Name
              <input
                className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                type="text"
                readOnly
                disabled
                {...register("lastName")}
              />
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
              Email
              <input
                className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                type="text"
                readOnly
                disabled
                {...register("email")}
              />
            </label>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Price Summary</h2>

            <div className="bg-blue-200 p-4 rounded-md">
              <div className="font-semibold text-lg">
                Total Cost: {totalCost.toFixed(2)} Birr
              </div>
              <div className="text-xs">Includes taxes and charges</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Payment Details</h3>
            <CardElement
              id="payment-element"
              className="border rounded-md p-2 text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
            >
              {isLoading ? "Saving..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}

      {selectedPaymentMethod === "chapa" && (
        <div className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
          <span className="text-3xl font-bold">Confirm Your Details</span>
          <div className="grid grid-cols-2 gap-6">
            <label className="text-gray-700 text-sm font-bold flex-1">
              First Name
              <input
                className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                type="text"
                readOnly
                disabled
                value={currentUser.firstName}
              />
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
              Last Name
              <input
                className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                type="text"
                readOnly
                disabled
                value={currentUser.lastName}
              />
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
              Email
              <input
                className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                type="text"
                readOnly
                disabled
                value={currentUser.email}
              />
            </label>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Price Summary</h2>

            <div className="bg-blue-200 p-4 rounded-md">
              <div className="font-semibold text-lg">
                Total Cost: {totalCost.toFixed(2)} Birr
              </div>
              <div className="text-xs">Includes taxes and charges</div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-green-500 text-white p-2 font-bold hover:bg-green-600"
              onClick={handlePlaceOrder} // Call handlePlaceOrder on click
            >
              Pay with Chapa
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookingForm2;