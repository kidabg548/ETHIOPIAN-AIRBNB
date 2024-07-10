import React from 'react';

const PrivacyAndCookies: React.FC = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Privacy Policy & Cookies</h1>

        {/* Privacy Policy Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-500 mb-4">Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            At <strong>hulubeand booking.com</strong>, your privacy is important to us. This privacy policy outlines how we collect, use, and protect your personal information when you use our services to book hotels online in Ethiopia.
          </p>

          <h3 className="text-2xl font-semibold text-blue-400 mt-6">1. Information We Collect</h3>
          <p className="text-gray-700 leading-relaxed">
            We collect the following information to provide a seamless booking experience:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 leading-relaxed">
            <li>Personal details such as name, email address, and phone number.</li>
            <li>Payment information to process your bookings securely.</li>
            <li>Browser cookies and device information to enhance your experience on our website.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-400 mt-6">2. How We Use Your Information</h3>
          <p className="text-gray-700 leading-relaxed">
            We use your personal information to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 leading-relaxed">
            <li>Facilitate hotel bookings and confirm reservations.</li>
            <li>Communicate with you regarding your bookings or inquiries.</li>
            <li>Improve our services and offer personalized recommendations.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-400 mt-6">3. Data Security</h3>
          <p className="text-gray-700 leading-relaxed">
            We implement strict security measures to protect your personal information from unauthorized access or disclosure. Your data is encrypted during transmission and stored securely on our servers.
          </p>
        </section>

        {/* Cookies Policy Section */}
        <section>
          <h2 className="text-3xl font-semibold text-blue-500 mb-4">Cookies Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>hulubeand booking.com</strong> uses cookies to enhance your browsing experience and provide personalized services.
          </p>

          <h3 className="text-2xl font-semibold text-blue-400 mt-6">1. What are Cookies?</h3>
          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and track site usage to improve performance.
          </p>

          <h3 className="text-2xl font-semibold text-blue-400 mt-6">2. Types of Cookies We Use</h3>
          <p className="text-gray-700 leading-relaxed">
            We use the following types of cookies:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700 leading-relaxed">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function correctly.</li>
            <li><strong>Performance Cookies:</strong> Track user behavior and improve the site's performance.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences, such as language or region.</li>
            <li><strong>Advertising Cookies:</strong> Provide personalized ads based on your browsing habits.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-400 mt-6">3. Managing Cookies</h3>
          <p className="text-gray-700 leading-relaxed">
            You can control or delete cookies through your browser settings. Disabling cookies may affect your experience on our website.
          </p>

          <h3 className="text-2xl font-semibold text-blue-400 mt-6">4. Third-Party Cookies</h3>
          <p className="text-gray-700 leading-relaxed">
            We may also use third-party cookies from advertising or analytics partners to provide you with personalized content and improve our services. You can opt-out of third-party cookie tracking at any time.
          </p>
        </section>

        <div className="mt-12 text-center">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAndCookies;
