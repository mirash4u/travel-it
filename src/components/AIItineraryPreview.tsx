import React from 'react';
import { Check, X, Edit3, MapPin, Clock, DollarSign, Star, Bed } from 'lucide-react';
import { AIItineraryResponse, Activity, Accommodation } from '../types';

interface AIItineraryPreviewProps {
  itinerary: AIItineraryResponse;
  destination: string;
  onAccept: () => void;
  onReject: () => void;
  onCustomize: () => void;
}

export const AIItineraryPreview: React.FC<AIItineraryPreviewProps> = ({
  itinerary,
  destination,
  onAccept,
  onReject,
  onCustomize
}) => {
  const getCategoryIcon = (category: Activity['category']) => {
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

  const getAccommodationIcon = (type: Accommodation['type']) => {
    const icons = {
      hotel: '🏨',
      hostel: '🏠',
      airbnb: '🏡',
      resort: '🏖️',
      guesthouse: '🏘️'
    };
    return icons[type] || '🏨';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Your AI-Generated Itinerary</h3>
        <p className="text-purple-100">{itinerary.overview}</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Activities Section */}
        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-500" />
            Suggested Activities ({itinerary.activities.length})
          </h4>
          <div className="grid gap-4">
            {itinerary.activities.slice(0, 6).map((activity, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{activity.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {activity.time && (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </span>
                      )}
                      {activity.duration && (
                        <span>{activity.duration}</span>
                      )}
                      {activity.cost && (
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {activity.cost}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize">
                    {activity.category}
                  </span>
                </div>
              </div>
            ))}
            {itinerary.activities.length > 6 && (
              <div className="text-center py-2 text-gray-500 text-sm">
                +{itinerary.activities.length - 6} more activities...
              </div>
            )}
          </div>
        </div>

        {/* Accommodations Section */}
        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Bed className="w-5 h-5 mr-2 text-pink-500" />
            Accommodation Options
          </h4>
          <div className="grid gap-4">
            {itinerary.accommodations.map((accommodation, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getAccommodationIcon(accommodation.type)}</span>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{accommodation.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{accommodation.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {accommodation.priceRange}
                      </span>
                      {accommodation.rating && (
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          {accommodation.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full capitalize">
                    {accommodation.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Generate New</span>
          </button>
          <button
            onClick={onCustomize}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Customize</span>
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Accept & Finalize</span>
          </button>
        </div>
      </div>
    </div>
  );
};