
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 bg-blue-800 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Athlete GPT</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/features" className="hover:text-blue-200">Features</Link>
          <Link to="/pricing" className="hover:text-blue-200">Pricing</Link>
          <Link to="/about" className="hover:text-blue-200">About</Link>
        </div>
        
        <div className="flex space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:bg-blue-700">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" className="text-white border-white hover:bg-blue-700">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
