import React from 'react';
import Header from '../components/FooterForListing'; 
import Footer from '../components/HeaderForListing'; 

const LayoutMy: React.FC<{ children: React.ReactNode}> = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100"> 
      <Footer />
      <main className="flex-grow text-center my-0 ">
        {children} 
      </main>
      <Header />
    </div>
  );
};

export default LayoutMy;