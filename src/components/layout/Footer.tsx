
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-athleteBlue-600 to-athleteGreen-600 bg-clip-text text-transparent">
                Athlete GPT
              </span>
            </Link>
            <p className="mt-4 text-gray-600">
              Hyper-personalized, AI-powered workout and meal plans for athletes and fitness enthusiasts.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">Pricing</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">Testimonials</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">Support</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-athleteBlue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Athlete GPT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
