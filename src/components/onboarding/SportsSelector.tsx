import { useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Sport {
  name: string;
  category: string;
}

// Comprehensive list of sports organized by category
const sportsData: Sport[] = [
  // Team Sports
  { name: 'Basketball', category: 'Team Sports' },
  { name: 'Soccer', category: 'Team Sports' },
  { name: 'Volleyball', category: 'Team Sports' },
  { name: 'Baseball', category: 'Team Sports' },
  { name: 'Hockey', category: 'Team Sports' },
  { name: 'Rugby', category: 'Team Sports' },
  { name: 'Cricket', category: 'Team Sports' },
  { name: 'Field Hockey', category: 'Team Sports' },
  { name: 'Lacrosse', category: 'Team Sports' },
  
  // Individual Sports
  { name: 'Running', category: 'Individual Sports' },
  { name: 'Triathlon', category: 'Individual Sports' },
  { name: 'Track and Field', category: 'Individual Sports' },
  { name: 'Cycling', category: 'Individual Sports' },
  { name: 'Golf', category: 'Individual Sports' },
  { name: 'Gymnastics', category: 'Individual Sports' },
  { name: 'Figure Skating', category: 'Individual Sports' },
  
  // Strength Sports
  { name: 'Weightlifting', category: 'Strength Sports' },
  { name: 'Powerlifting', category: 'Strength Sports' },
  { name: 'CrossFit', category: 'Strength Sports' },
  { name: 'Bodybuilding', category: 'Strength Sports' },
  { name: 'Strongman', category: 'Strength Sports' },
  
  // Combat Sports
  { name: 'Boxing', category: 'Combat Sports' },
  { name: 'MMA', category: 'Combat Sports' },
  { name: 'Wrestling', category: 'Combat Sports' },
  { name: 'Judo', category: 'Combat Sports' },
  { name: 'Karate', category: 'Combat Sports' },
  { name: 'Brazilian Jiu-Jitsu', category: 'Combat Sports' },
  { name: 'Taekwondo', category: 'Combat Sports' },
  
  // Water Sports
  { name: 'Swimming', category: 'Water Sports' },
  { name: 'Water Polo', category: 'Water Sports' },
  { name: 'Surfing', category: 'Water Sports' },
  { name: 'Diving', category: 'Water Sports' },
  { name: 'Rowing', category: 'Water Sports' },
  { name: 'Kayaking', category: 'Water Sports' },
  
  // Racquet Sports
  { name: 'Tennis', category: 'Racquet Sports' },
  { name: 'Badminton', category: 'Racquet Sports' },
  { name: 'Table Tennis', category: 'Racquet Sports' },
  { name: 'Squash', category: 'Racquet Sports' },
  { name: 'Pickleball', category: 'Racquet Sports' },
  
  // Winter Sports
  { name: 'Skiing', category: 'Winter Sports' },
  { name: 'Snowboarding', category: 'Winter Sports' },
  { name: 'Ice Hockey', category: 'Winter Sports' },
  { name: 'Speed Skating', category: 'Winter Sports' },
  
  // Other Activities
  { name: 'Rock Climbing', category: 'Other Activities' },
  { name: 'Dance', category: 'Other Activities' },
  { name: 'Yoga', category: 'Other Activities' },
  { name: 'HIIT', category: 'Other Activities' },
  { name: 'Pilates', category: 'Other Activities' },
];

interface SportsSelectorProps {
  selectedSport: string | null;
  onSelectSport: (sport: string) => void;
}

const SportsSelector = ({ selectedSport, onSelectSport }: SportsSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = Array.from(new Set(sportsData.map(sport => sport.category)));
  
  const filteredSports = searchTerm
    ? sportsData.filter(sport => 
        sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sportsData;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-athleteBlue-500 focus:border-athleteBlue-500 sm:text-sm"
          placeholder="Search for a sport or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredSports.map((sport) => (
            <div
              key={sport.name}
              className={`px-3 py-2 rounded-md cursor-pointer text-center transition-colors ${
                selectedSport === sport.name
                  ? 'bg-athleteBlue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => onSelectSport(sport.name)}
            >
              {sport.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="font-semibold text-gray-700">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sportsData
                  .filter((sport) => sport.category === category)
                  .map((sport) => (
                    <div
                      key={sport.name}
                      className={`px-3 py-2 rounded-md cursor-pointer text-center transition-colors ${
                        selectedSport === sport.name
                          ? 'bg-athleteBlue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => onSelectSport(sport.name)}
                    >
                      {sport.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SportsSelector;
