import React from 'react';
import Header from '../components/FooterForListing'; 
import Footer from '../components/HeaderForListing'; 
import StepIndicator from '../components/StepIndicator';

const Layout: React.FC<{ children: React.ReactNode, currentStep?: number }> = ({ children, currentStep = 1 }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 "> 
      <Footer />
      <main className="flex-grow text-center my-0 pt-16 p-20">
      <StepIndicator currentStep={currentStep} totalSteps={3} />
        {children} 
      </main>
      <Header />
    </div>
  );
};

export default Layout;