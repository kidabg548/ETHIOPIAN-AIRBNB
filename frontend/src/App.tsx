import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Layout1 from "./layouts/LayoutForListing";
import LayoutForListing from "./layouts/LayoutForListing";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
// import Detail from "./pages/Detail";
// import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import ReviewForm from "./forms/ReviewForm/reviewForm";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import PersonalDetails from "./pages/ManageAccount/PersonalDetails";
import Security from "./pages/ManageAccount/Security";
import PaymentDetails from "./pages/ManageAccount/PaymentDetails";
import Privacy from "./pages/ManageAccount/Privacy";
import EmailNotifications from "./pages/ManageAccount/EmailNotifications";
import RoomForm from "./forms/ManageHotelForm/RoomSection";
import VerificationStatusPage from "./pages/ProfileVerificationProcess";
import ListPropertyPage from "./pages/ListProperty";
import ListHotelPage from "./pages/ListHotel";
import HotelConfirmationPage from "./pages/HotelTypeConfirmation";
import Saved from "./pages/saved";
import AddHotel2 from "./pages/AddHotel2";
import AdminPendingHotelsPage from "./pages/AdminHotelPending";
import Detail2 from "./pages/RoomBooking/Detail";
import Booking2 from "./pages/RoomBooking/Booking";

function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />

        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail2 />
            </Layout>
          }
        />

        {/* <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        /> */}

        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />

        {isLoggedIn && (
          <>
            {/* <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            /> */}

                <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking2 />
                </Layout>
              }
            />

            {/* <Route
              path="/hotel/:hotelId/:roomId/booking"
              element={
                <Layout>
                  <Booking2 />
                </Layout>
              }
            /> */}

            <Route
              path="/add-hotel"
              element={
                <LayoutForListing>
                  <AddHotel />
                </LayoutForListing>
              }
            />

            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />

            <Route
              path="/my-hotels"
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />

            <Route
              path="/hotel/:hotelId/:bookingId/review"
              element={<ReviewForm />}
            />
            <Route path="/manage-account" element={<ManageAccount />} />
            <Route path="/room" element={<RoomForm />} />
            <Route
              path="/manage-account/personal-details"
              element={<PersonalDetails />}
            />
            <Route path="/manage-account/security" element={<Security />} />
            <Route
              path="/manage-account/payment-details"
              element={<PaymentDetails />}
            />
            <Route path="/manage-account/privacy" element={<Privacy />} />
            <Route
              path="/manage-account/email-notifications"
              element={<EmailNotifications />}
            />

            <Route
              path="/verification-status"
              element={<VerificationStatusPage />}
            />
            <Route path="/list-property" element={<ListPropertyPage />} />

            <Route path="/list-hotel" element={<ListHotelPage />} />
            <Route
              path="/hotel-confirmation"
              element={<HotelConfirmationPage />}
            />
            <Route
              path="/pending-hotels"
              element={<AdminPendingHotelsPage />}
            />

            <Route
              path="/list-hotels"
              element={
                <Layout1>
                  <AddHotel2 />
                </Layout1>
              }
            />

            <Route path="/saved" element={<Saved />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
