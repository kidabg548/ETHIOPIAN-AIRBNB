// ListHotelPage.jsx
import React, { useEffect, useState } from 'react';
import Layout from '../layouts/LayoutForListing';
import { FaCheckCircle } from 'react-icons/fa'; 
import { useLocation, useNavigate } from 'react-router-dom';

const ListHotelPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

 const handleContinue = () => {
    if (selectedCategory) {
      navigate('/hotel-confirmation', { state: { selectedCategory } });
    }
  };
  
  return (
    <Layout currentStep={2}>
      <div className="container mx-auto px-8 mb-20">
        <h1 className="text-3xl font-bold mb-8">From the list below, which property category is most similar to your place?</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* Hotel Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Hotel' ? 'border-green-500 border-2' : ''}`} 
            onClick={() => handleCategoryClick('Hotel')} 
          >
            <h2 className="text-xl font-bold">Hotel</h2>
            <p className="text-gray-700">Accommodation for travelers often offering restaurants, meeting rooms, and other guest services.</p>
            {selectedCategory === 'Hotel' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Guest House Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Guest house' ? 'border-green-500 border-2' : ''}`} 
            onClick={() => handleCategoryClick('Guest house')} 
          >
            <h2 className="text-xl font-bold">Guest house</h2>
            <p className="text-gray-700">Private home with separate living facilities for host and guest.</p>
            {selectedCategory === 'Guest house' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Bed and Breakfast Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Bed and breakfast' ? 'border-green-500 border-2' : ''}`}
            onClick={() => handleCategoryClick('Bed and breakfast')} 
          >
            <h2 className="text-xl font-bold">Bed and breakfast</h2>
            <p className="text-gray-700">Private home offering overnight stays and breakfast.</p>
            {selectedCategory === 'Bed and breakfast' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Homestay Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Homestay' ? 'border-green-500 border-2' : ''}`}
            onClick={() => handleCategoryClick('Homestay')} 
          >
            <h2 className="text-xl font-bold">Homestay</h2>
            <p className="text-gray-700">A shared home where the guest has a private room, and the host lives on-site.</p>
            {selectedCategory === 'Homestay' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Hostel Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Hostel' ? 'border-green-500 border-2' : ''}`}
            onClick={() => handleCategoryClick('Hostel')} 
          >
            <h2 className="text-xl font-bold">Hostel</h2>
            <p className="text-gray-700">Budget accommodation with mostly dorm-style bedding and a social atmosphere.</p>
            {selectedCategory === 'Hostel' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Aparthotel Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Aparthotel' ? 'border-green-500 border-2' : ''}`}
            onClick={() => handleCategoryClick('Aparthotel')} 
          >
            <h2 className="text-xl font-bold">Aparthotel</h2>
            <p className="text-gray-700">A self-catering apartment with some hotel facilities like a reception desk.</p>
            {selectedCategory === 'Aparthotel' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Capsule Hotel Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Capsule hotel' ? 'border-green-500 border-2' : ''}`}
            onClick={() => handleCategoryClick('Capsule hotel')} 
          >
            <h2 className="text-xl font-bold">Capsule hotel</h2>
            <p className="text-gray-700">Extremely small units offering cheap and basic overnight accommodation.</p>
            {selectedCategory === 'Capsule hotel' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Country House Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Country house' ? 'border-green-500 border-2' : ''}`}
            onClick={() => handleCategoryClick('Country house')} 
          >
            <h2 className="text-xl font-bold">Country house</h2>
            <p className="text-gray-700">Private home with simple accommodation in the countryside.</p>
            {selectedCategory === 'Country house' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

          {/* Farm Stay Option */}
          <div 
            className={`bg-white p-6 rounded-lg border border-gray-300 shadow-sm cursor-pointer ${selectedCategory === 'Farm stay' ? 'border-green-500 border-2' : ''}`}
            onClick={() => handleCategoryClick('Farm stay')} 
          >
            <h2 className="text-xl font-bold">Farm stay</h2>
            <p className="text-gray-700">Private farm with simple accommodation.</p>
            {selectedCategory === 'Farm stay' && ( 
              <FaCheckCircle className="text-green-500 float-right mt-2 text-2xl" /> 
            )}
          </div>

        
        </div>

        <div className="flex mt-8">
        
          <button 
            className={`bg-blue-600 text-white py-4 px-8 cursor-pointer hover:bg-blue-800 rounded ${selectedCategory ? 'bg-blue-600' : 'bg-gray-400'}`} 
            disabled={!selectedCategory} 
            onClick={handleContinue} 
          >
            Continue
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ListHotelPage;