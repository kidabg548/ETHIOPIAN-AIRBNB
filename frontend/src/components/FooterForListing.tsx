import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-blue-600 text-white py-4">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} HULUBEAND. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;