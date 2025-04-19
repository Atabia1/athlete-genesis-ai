
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { sportsList, sportsCategories, searchSports } from '@/data/sportsDatabase';

interface SportsSelectorProps {
  selectedSport: string | null;
  onSelectSport: (sport: string) => void;
}

const SportsSelector = ({ selectedSport, onSelectSport }: SportsSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSports, setFilteredSports] = useState(sportsList);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery) {
      setFilteredSports(searchSports(searchQuery));
      setActiveCategory(null);
    } else if (activeCategory) {
      setFilteredSports(sportsList.filter(sport => sport.category === activeCategory));
    } else {
      setFilteredSports(sportsList);
    }
  }, [searchQuery, activeCategory]);

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search for a sport or activity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!searchQuery && (
        <div className="flex flex-wrap gap-2 mb-4">
          {sportsCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-athleteBlue-100 text-athleteBlue-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
        {filteredSports.map((sport) => (
          <div
            key={sport.id}
            className={`border rounded-md p-3 cursor-pointer transition-all ${
              selectedSport === sport.name
                ? 'border-athleteBlue-600 bg-athleteBlue-50'
                : 'border-gray-200 hover:border-athleteBlue-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelectSport(sport.name)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full mr-3 ${
                selectedSport === sport.name 
                  ? 'bg-athleteBlue-600' 
                  : 'bg-gray-200'
              }`}>
                {selectedSport === sport.name && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">{sport.name}</p>
                <p className="text-xs text-gray-500">{sport.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No sports found matching your search.</p>
          <p className="text-sm mt-2">Try a different search term or category.</p>
        </div>
      )}
    </div>
  );
};

export default SportsSelector;
