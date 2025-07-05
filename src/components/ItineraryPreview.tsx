import React from 'react';
import { Check, X, Edit3, MapPin, Clock, DollarSign, Star, Bed, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { AIItineraryResponse, AIItineraryRequest } from '../types';

interface ItineraryPreviewProps {
  itinerary: AIItineraryResponse;
  destination: string;
  preferences: AIItineraryRequest;
  onCreateTrip: (tripName: string) => void;
  onRegenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

export const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({
  itinerary,
  destination,
  preferences,
  onCreateTrip,
  onRegenerate,
  onBack,
  isGenerating
}) => {
  const [tripName, setTripName] = React.useState(`${destination} Adventure`);

  const getCategoryIcon = (category: any) => {
    const icons = {
      sightseeing: '🏛️',
      dining: '🍽️',
      entertainment: '🎭',
      shopping: '🛍️',
      outdoor: '🌲',
      cultural: '🎨',
      relaxation: '🧘'
    };
    return icons[category] || '📍';
  };

  const getAccommodationIcon = (type: any) => {
    const icons = {
      hotel: '🏨',
      hostel: '🏠',
      airbnb: '🏡',
      resort: '🏖️',
      guesthouse: '🏘️'
    };
    return icons[type] || '🏨';
  };

  const getDays = () => {
    if (!preferences.arrivalDate || !preferences.departureDate) return 0;
    return Math.ceil((new Date(preferences.departureDate).getTime() - new Date(preferences.arrivalDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-lg"
          >
            <ArrowRight className="w-5 h-5 transform rotate-180" />
            <span>Back to Search</span>
          </button>
        </div>

        {/* AI Generated Itinerary Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your AI-Generated Itinerary</h1>
              <p className="text-purple-100 text-lg">Personalized for {destination}</p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 mt-6">
            <p className="text-lg leading-relaxed">{itinerary.overview}</p>
          </div>

          {/* Trip Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {getDays() > 0 && (
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Duration</span>
                </div>
                <p className="text-2xl font-bold">{getDays()} days</p>
              </div>
            )}
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Activities</span>
              </div>
              <p className="text-2xl font-bold">{itinerary.activities.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Bed className="w-5 h-5" />
                <span className="font-semibold">Accommodations</span>
              </div>
              <p className="text-2xl font-bold">{itinerary.accommodations.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="w-5 h-5" />
                <span className="font-semibold">Travelers</span>
              </div>
              <p className="text-2xl font-bold">{preferences.travelers}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activities Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-sky-500" />
                Suggested Activities ({itinerary.activities.length})
              </h3>
              <div className="space-y-4">
                {itinerary.activities.map((activity, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {activity.image ? (
                          <div className="relative">
                            <img 
                              src={activity.image} 
                              alt={activity.name}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-2xl">${getCategoryIcon(activity.category)}</span>`;
                                }
                              }}
                            />
                            <span className="absolute -top-1 -right-1 text-lg bg-white rounded-full p-1 shadow-sm">
                              {getCategoryIcon(activity.category)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900">{activity.name}</h4>
                        <p className="text-gray-600 mt-2 leading-relaxed">{activity.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                          {activity.time && (
                            <span className="flex items-center bg-white px-3 py-1 rounded-lg">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.time}
                            </span>
                          )}
                          {activity.duration && (
                            <span className="bg-white px-3 py-1 rounded-lg">{activity.duration}</span>
                          )}
                          {activity.cost && (
                            <span className="flex items-center bg-white px-3 py-1 rounded-lg">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {activity.cost}
                            </span>
                          )}
                          <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full capitalize font-medium">
                            {activity.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodations Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Bed className="w-6 h-6 mr-3 text-pink-500" />
                Accommodation Options
              </h3>
              <div className="space-y-4">
                {itinerary.accommodations.map((accommodation, index) => (
                  <div key={index} className="bg-pink-50 border border-pink-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">{getAccommodationIcon(accommodation.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900">{accommodation.name}</h4>
                        <p className="text-gray-600 mt-2 leading-relaxed">{accommodation.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                          <span className="flex items-center bg-white px-3 py-1 rounded-lg">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {accommodation.priceRange}
                          </span>
                          {accommodation.rating && (
                            <span className="flex items-center bg-white px-3 py-1 rounded-lg">
                              <Star className="w-3 h-3 mr-1 text-yellow-500" />
                              {accommodation.rating}
                            </span>
                          )}
                          <span className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full capitalize font-medium">
                            {accommodation.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Create Trip */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Trip</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Name
                  </label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Enter trip name"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Trip Summary</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Destination:</span>
                      <span className="font-medium">{destination}</span>
                    </div>
                    {preferences.arrivalDate && preferences.departureDate && (
                      <div className="flex items-center justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{getDays()} days</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Activities:</span>
                      <span className="font-medium">{itinerary.activities.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Travelers:</span>
                      <span className="font-medium">{preferences.travelers}</span>
                    </div>
                    {preferences.budget && (
                      <div className="flex items-center justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">{preferences.budget}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => onCreateTrip(tripName)}
                    disabled={!tripName.trim()}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-3 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Create Trip</span>
                  </button>
                  
                  <button
                    onClick={onRegenerate}
                    disabled={isGenerating}
                    className="w-full text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 py-3 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate New Itinerary</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Preferences</h3>
              <div className="space-y-3 text-sm">
                {preferences.interests.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Interests:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferences.interests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {preferences.arrivalDate && preferences.departureDate && (
                  <div>
                    <span className="font-medium text-gray-700">Dates:</span>
                    <p className="text-gray-600">
                      {new Date(preferences.arrivalDate).toLocaleDateString()} - {new Date(preferences.departureDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};