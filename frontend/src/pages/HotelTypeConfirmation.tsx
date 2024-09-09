import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../layouts/LayoutForListing';
import { FaCheckCircle } from 'react-icons/fa'; // Import FaCheckCircle

// Define the type for the state that will be passed via navigate
interface LocationState {
  selectedCategory: string;
}

const HotelConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { selectedCategory } = (location.state as LocationState) || { selectedCategory: 'property' };

  const getPropertyText = () => {
    switch (selectedCategory) {
      case 'Hotel':
        return 'One hotel where guests can book a room';
      case 'Guest house':
        return 'One guest house where guests can book a room';
      case 'Bed and breakfast':
        return 'One bed and breakfast where guests can book a room';
      case 'Homestay':
        return 'One homestay where guests can book a room';
      case 'Hostel':
        return 'One hostel where guests can book a room';
      case 'Aparthotel':
        return 'One aparthotel where guests can book a room';
      case 'Capsule hotel':
        return 'One capsule hotel where guests can book a room';
      case 'Country house':
        return 'One country house where guests can book a room';
      case 'Farm stay':
        return 'One farm stay where guests can book a room';
      default:
        return 'One property where guests can book a room';
    }
  };

  const handleContinue = () => {
    navigate('/list-hotels');

    // Logic for proceeding to the next step
  };

  const handleMakeChange = () => {
    navigate('/list-hotel', { state: { selectedCategory } });
  };
  

  return (
    <Layout currentStep={3}>
      <div className="container mx-auto px-8 py-20">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center"> {/* Card wrapper */}
          <p className="text-gray-700 mb-4">You're listing:</p>
          <div className="flex justify-center mb-4"> {/* Center the icon */}
            <FaCheckCircle className="text-green-500 text-4xl" /> {/* Confirmation icon */}
          </div>
          <h1 className="text-2xl font-bold mb-6">{getPropertyText()}</h1>
          <p className="text-gray-700 mb-8">Does this sound like your property?</p>
          <div className="flex justify-center"> {/* Center the buttons */}
            <button 
              onClick={handleContinue} 
              className="bg-blue-600 text-white py-4 px-8 rounded-lg cursor-pointer hover:bg-blue-800 mr-4"
            >
              Continue
            </button>
            <button 
              onClick={handleMakeChange} 
              className="bg-transparent text-blue-600 py-4 px-8 rounded-lg border border-blue-600 cursor-pointer hover:bg-blue-100"
            >
              No, I need to make a change
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HotelConfirmationPage;