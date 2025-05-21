import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Heart, LineChart, Flame, Zap } from "lucide-react";

interface QuickStatsProps {
  visible: boolean;
}

/**
 * QuickStats component for the Athlete Dashboard
 * 
 * Displays key metrics in a row of cards at the top of the dashboard
 */
const QuickStats: React.FC<QuickStatsProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="pt-6 pb-4 relative">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Weekly Training Load</p>
              <h3 className="text-3xl font-bold text-blue-700 mt-1">8.2</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-blue-600 flex items-center">
              <Zap className="h-3 w-3 mr-1" /> Optimal zone
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 via-green-100 to-green-50 border-green-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="pt-6 pb-4 relative">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Recovery Status</p>
              <h3 className="text-3xl font-bold text-green-700 mt-1">Good</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <Heart className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-green-600 flex items-center">
              <Zap className="h-3 w-3 mr-1" /> 85% recovered
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="pt-6 pb-4 relative">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Monthly Progress</p>
              <h3 className="text-3xl font-bold text-purple-700 mt-1">+12%</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <LineChart className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-purple-600 flex items-center">
              <Zap className="h-3 w-3 mr-1" /> Above target
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="pt-6 pb-4 relative">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Workout Streak</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-1">10 days</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <Flame className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-amber-600 flex items-center">
              <Zap className="h-3 w-3 mr-1" /> Personal best!
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
