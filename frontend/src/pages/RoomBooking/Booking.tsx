import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useSearchContext } from "../../contexts/SearchContext";
import BookingDetailsSummary2 from "../../components/BookingDetailsSummary2";
import BookingForm2 from "../../forms/BookingForm2/BookingForm";
import * as apiClient from "../../api-client";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../../contexts/AppContext";

const Booking = () => {
  const { stripePromise } = useAppContext(); // Get the Stripe promise from context
  const { hotelId } = useParams();
  const location = useLocation();
  const search = useSearchContext();

  // Extract state from the navigation
  const { selectedRooms, rooms, totalCost, numberOfNights } = location.state || {};

  // Fetch hotel details by ID
  const { data: hotel } = useQuery(
    ["fetchHotelByID", hotelId],
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  // Fetch current user data
  const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);

  // Fetch payment intent data
  const { data: paymentIntentData } = useQuery(
    ["createPaymentIntent", hotelId, numberOfNights],
    () => apiClient.createPaymentIntent(hotelId as string, totalCost), // Pass totalPrice instead of numberOfNights
    {
      enabled: !!hotelId && totalCost > 0,
    }
  );

  if (!hotel || !rooms ) {
    return <></>; // Handle the case when data is not yet available
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-4 p-4">
      {/* Booking Details Summary Card */}
      <BookingDetailsSummary2
        hotel={hotel}
        selectedRooms={selectedRooms} // Pass the selected rooms from the navigation state
        checkIn={search.checkIn} // Use checkIn from SearchContext
        checkOut={search.checkOut} // Use checkOut from SearchContext
        adultCount={search.adultCount} // Use adultCount from SearchContext
        childCount={search.childCount} // Use childCount from SearchContext
        numberOfNights={numberOfNights} // Pass the calculated number of nights
        rooms={rooms} // Pass rooms from the navigation state
      />

      {/* Booking Form */}
      {currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm2
            totalCost={totalCost}
            currentUser={currentUser} // Pass current user data if needed in the form
            paymentIntent={paymentIntentData}
            selectedRooms={selectedRooms}
            
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
