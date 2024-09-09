import React from 'react';
import Layout from '../layouts/LayoutForListing'
import hotelImage from '../assets/Hotels.jpeg';
import { Link } from 'react-router-dom';

const ListPropertyPage: React.FC = () => {
  return (
    <Layout  currentStep={1}> 
    
      <div className="container mx-auto px-8 mb-20">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">List your property on HuluBeand!</h1>
        <p className="text-gray-600 mb-8 text-2xl font-medium">Ready to share your unique space with the world?  Let's get started on your HuluBeand journey. Choose the type of property you want to list:</p>
        
        <div className="overflow-x-auto white-space-nowrap p-4 rounded-md border border-gray-300"> {/* Tailwind CSS for scrollable grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> 
            <div className="bg-white rounded-lg shadow-md p-6 h-auto">
              <img src={hotelImage} alt="Apartment" className="mx-auto mb-4 w-48 h-32 object-cover" />
              <h2 className="text-lg font-medium">Apartment</h2>
              <p className="text-gray-600 mb-4">Perfect for a cozy stay! Furnished and self-catering accommodation where guests have the entire place to themselves.</p>
              <Link to="/list-apartment" className="bg-blue-600 text-white py-2 px-4 rounded">List your property</Link> 
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 h-auto"> 
              <img src={hotelImage} alt="Homes" className="mx-auto mb-4 w-48 h-32 object-cover" />
              <h2 className="text-lg font-medium">Homes</h2>
              <p className="text-gray-600 mb-4">From charming cottages to spacious villas, share your entire home with travelers seeking unique experiences.</p>
              <Link to="/list-home" className="bg-blue-600 text-white py-2 px-4 rounded">List your property</Link> 
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 h-auto"> 
              <img src={hotelImage} alt="Hotel, B&Bs, and more" className="mx-auto mb-4 w-48 h-32 object-cover" />
              <h2 className="text-lg font-medium">Hotel, B&Bs, and more</h2>
              <p className="text-gray-600 mb-4">Welcome guests to your hotel, B&B, guesthouse, hostel, or aparthotel, offering them a comfortable and memorable stay.</p>
              <Link to="/list-hotel" className="bg-blue-600 text-white py-2 px-4 rounded">List your property</Link>
              </div>
            <div className="bg-white rounded-lg shadow-md p-6 h-auto"> 
              <img src={hotelImage} alt="Alternative places" className="mx-auto mb-4 w-48 h-32 object-cover" />
              <h2 className="text-lg font-medium">Alternative places</h2>
              <p className="text-gray-600 mb-4">Think outside the box! List unique accommodations like boats, campsites, luxury tents, and more. </p>
              <Link to="/list-alternative" className="bg-blue-600 text-white py-2 px-4 rounded">List your property</Link> 
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListPropertyPage;