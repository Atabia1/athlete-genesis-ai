
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-blue-800 dark:text-blue-300 mb-6">Athlete GPT</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your AI-Powered Personal Coach for customized fitness plans, nutrition guidance, and expert training support.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-lg text-lg">
                View Dashboard
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold px-8 py-6 rounded-lg text-lg">
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="mt-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Already have an account?</p>
            <Link to="/login">
              <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                Login to your account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
