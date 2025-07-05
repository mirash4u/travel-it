import React, { useState } from 'react';
import { Sparkles, Clock, MapPin, DollarSign, Users, Loader2 } from 'lucide-react';
import { AIItineraryRequest } from '../types';

interface AIItineraryGeneratorProps {
  destination: string;
  arrivalDate?: string;
  departureDate?: string;
  onGenerate: (request: AIItineraryRequest) => void;
  isGenerating: boolean;
}

export const AIItineraryGenerator: React.FC<AIItineraryGeneratorProps> = ({
  destination,
  arrivalDate,
  departureDate,
  onGenerate,
  isGenerating
}) => {
  const [preferences, setPreferences] = useState({
    budget: '',
    travelers: 1,
    interests: [] as string[]
  });

  const interestOptions = [
    'Culture & History',
    'Food & Dining',
    'Nightlife',
    'Nature & Outdoors',
    'Shopping',
    'Art & Museums',
    'Adventure Sports',
    'Relaxation'
  ];

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGenerate = () => {
    onGenerate({
      destination,
      arrivalDate,
      departureDate,
      budget: preferences.budget,
      travelers: preferences.travelers,
      interests: preferences.interests
    });
  };

  const getDays = () => {
    if (!arrivalDate || !departureDate) return 0;
    return Math.ceil((new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-500 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">AI Itinerary Generator</h3>
          <p className="text-gray-600 text-sm">Let AI create a personalized itinerary for {destination}</p>
        </div>
      </div>

      {getDays() > 0 && (
        <div className="bg-white rounded-lg p-4 mb-6 border border-purple-100">
          <div className="flex items-center space-x-2 text-purple-700">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{getDays()} days planned</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(arrivalDate!).toLocaleDateString()} - {new Date(departureDate!).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Budget Range (Optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Budget ($)', 'Mid-range ($$)', 'Luxury ($$$)', 'No preference'].map((option) => (
              <button
                key={option}
                onClick={() => setPreferences(prev => ({ ...prev, budget: option }))}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  preferences.budget === option
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Users className="w-4 h-4 inline mr-2" />
            Number of Travelers
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={preferences.travelers}
            onChange={(e) => setPreferences(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <MapPin className="w-4 h-4 inline mr-2" />
            Interests (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                  preferences.interests.includes(interest)
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating your perfect itinerary...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate AI Itinerary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};