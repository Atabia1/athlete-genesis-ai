
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-athleteBlue-600">Athlete GPT</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="inline-flex items-center p-2 ml-3 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="text-gray-600 hover:text-athleteBlue-600">Home</Link>
          <Link to="/pricing" className="text-gray-600 hover:text-athleteBlue-600">Pricing</Link>
          <Link to="/features" className="text-gray-600 hover:text-athleteBlue-600">Features</Link>
          <Link to="/about" className="text-gray-600 hover:text-athleteBlue-600">About</Link>
          <Link to="/onboarding">
            <Button variant="default" className="bg-athleteBlue-600 hover:bg-athleteBlue-700">Get Started</Button>
          </Link>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-lg md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">Home</Link>
              <Link to="/pricing" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">Pricing</Link>
              <Link to="/features" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">Features</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">About</Link>
              <Link to="/onboarding" className="block px-3 py-2 bg-athleteBlue-600 text-white rounded">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
