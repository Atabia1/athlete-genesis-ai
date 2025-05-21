
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full py-4 px-6 bg-blue-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span className="inline-block">🏋️‍♂️</span>
          <span>Athlete GPT</span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/features" className="hover:text-blue-200 transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-blue-200 transition-colors">Pricing</Link>
          <Link to="/about" className="hover:text-blue-200 transition-colors">About</Link>
          <Link to="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-white hover:bg-blue-700"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
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
