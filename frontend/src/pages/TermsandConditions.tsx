import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-6">Terms and Conditions</h1>

        <p>Welcome to <strong>hulubeand booking.com</strong>. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully. If you do not agree to these terms, you may not use the site.</p>

        <h2 className="text-2xl font-semibold mt-6">1. Introduction</h2>
        <p>By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.</p>

        <h2 className="text-2xl font-semibold mt-6">2. Definitions</h2>
        <ul className="list-disc ml-6">
          <li><strong>“We”, “Us”, “Our”</strong>: Refers to <strong>hulubeand booking.com</strong>.</li>
          <li><strong>“User”, “You”, “Your”</strong>: Refers to the individual visiting or using the site.</li>
          <li><strong>“Hotel”</strong>: Refers to the properties listed on our platform available for booking.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">3. Bookings</h2>
        <p>All bookings made through the website are subject to availability. You are responsible for ensuring that the information you provide during booking is accurate.</p>

        <h2 className="text-2xl font-semibold mt-6">4. Payments</h2>
        <p>You agree to pay the full price of your booking as displayed on the site at the time of purchase. Payment methods and currency conversion terms are defined by your payment provider.</p>

        <h2 className="text-2xl font-semibold mt-6">5. Cancellations and Refunds</h2>
        <p>Cancellation policies vary by hotel. Please review the hotel's cancellation policy before confirming your booking. Refunds are processed according to hotel policy.</p>

        <h2 className="text-2xl font-semibold mt-6">6. User Responsibilities</h2>
        <ul className="list-disc ml-6">
          <li>You must be at least 18 years old to make a booking.</li>
          <li>You agree to use the website responsibly and to comply with all applicable laws and regulations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">7. Hotel Responsibilities</h2>
        <p>Hotels listed on our platform are responsible for providing accurate information. We are not liable for any inaccuracies or discrepancies in the hotel's listing.</p>

        <h2 className="text-2xl font-semibold mt-6">8. Liability</h2>
        <p><strong>hulubeand booking.com</strong> is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of our site or services.</p>

        <h2 className="text-2xl font-semibold mt-6">9. Privacy Policy</h2>
        <p>Your personal information is collected and processed in accordance with our Privacy Policy.</p>

        <h2 className="text-2xl font-semibold mt-6">10. Changes to Terms and Conditions</h2>
        <p>We reserve the right to modify these Terms and Conditions at any time. Continued use of the site implies acceptance of the modified terms.</p>

        <h2 className="text-2xl font-semibold mt-6">11. Intellectual Property</h2>
        <p>All content on this website, including text, images, and graphics, is the property of <strong>hulubeand booking.com</strong>. You may not copy or reproduce any part without permission.</p>

        <h2 className="text-2xl font-semibold mt-6">12. Governing Law</h2>
        <p>These Terms and Conditions are governed by the laws of [Your Country/Region]. Any disputes will be resolved in the courts of Ethiopia.</p>

        <h2 className="text-2xl font-semibold mt-6">13. Contact Information</h2>
        <p>If you have any questions about these Terms and Conditions, please contact us at hulubeand@gmail.com.</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
