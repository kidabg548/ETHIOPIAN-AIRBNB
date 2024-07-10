import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">About hulubeand booking.com</h1>

        {/* Introduction Section */}
        <section className="mb-12">
          <div className="flex flex-col items-center">
            <img 
              src="https://source.unsplash.com/featured/?hotel" 
              alt="Hotels in Ethiopia"
              className="rounded-lg shadow-lg w-full max-w-md mb-6"
            />
            <h2 className="text-3xl font-semibold text-blue-500 mb-4 text-center">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed text-center max-w-3xl">
              Welcome to <strong>hulubeand booking.com</strong>, Ethiopia's premier online hotel booking platform. Our goal is to provide travelers with a seamless and efficient way to book accommodations throughout the country, whether for business, leisure, or adventure. With a wide selection of hotels and guesthouses, we strive to make your stay in Ethiopia as comfortable and enjoyable as possible.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-500 mb-4 text-center">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            Our mission is to revolutionize the hospitality industry in Ethiopia by offering a user-friendly, reliable, and comprehensive booking platform that connects travelers with the best accommodations. We are committed to helping our customers discover the perfect place to stay, whether it's a luxury hotel in Addis Ababa or a cozy guesthouse in the highlands.
          </p>
        </section>

        {/* Our Values Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-blue-500 mb-4 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-400">Customer Satisfaction</h3>
              <p className="text-gray-600 mt-2">
                We prioritize customer satisfaction by ensuring a smooth booking process and offering 24/7 support for all inquiries and concerns.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-400">Innovation</h3>
              <p className="text-gray-600 mt-2">
                We're constantly innovating our platform to provide users with new features, better search options, and faster bookings.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-400">Integrity</h3>
              <p className="text-gray-600 mt-2">
                Integrity is at the core of what we do. We work with trusted partners and ensure transparency in pricing and service.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section>
          <h2 className="text-3xl font-semibold text-blue-500 mb-4 text-center">Why Choose hulubeand booking.com?</h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            With our vast network of hotel partners across Ethiopia, our easy-to-use platform, and our commitment to excellent customer service, <strong>hulubeand booking.com</strong> is the best choice for your next trip. Whether you're exploring the vibrant culture of Addis Ababa or seeking a peaceful retreat in Lalibela, we have the perfect accommodation for you.
          </p>
        </section>

        {/* Contact Us Section */}
        <section className="mt-12 text-center">
          <h2 className="text-3xl font-semibold text-blue-500 mb-4">Get In Touch</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Have any questions or need assistance? Feel free to contact our team at:
          </p>
          <p className="text-lg font-bold text-gray-900">Email: support@hulubeandbooking.com</p>
          <p className="text-lg font-bold text-gray-900">Phone: +251-123-456789</p>
        </section>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
            Book Your Stay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
