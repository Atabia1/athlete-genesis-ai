
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Athlete GPT</h1>
      <p className="text-xl text-gray-700 mb-8">Your AI-Powered Personal Coach</p>
      <div className="flex gap-4">
        <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </Link>
        <Link to="/about" className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-4 rounded border border-blue-600">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Index;
