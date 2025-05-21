
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Athlete GPT Dashboard</h1>
          <Button variant="outline" className="text-white border-white hover:bg-blue-700">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Workout Plans</h2>
            <p className="text-gray-600 mb-4">View and manage your personalized workout plans.</p>
            <Button>View Plans</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Nutrition</h2>
            <p className="text-gray-600 mb-4">Track your meal plans and nutrition goals.</p>
            <Button>View Nutrition</Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Progress</h2>
            <p className="text-gray-600 mb-4">Track your fitness progress and achievements.</p>
            <Button>View Progress</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
