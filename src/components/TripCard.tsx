import React from 'react';
import { Calendar, MapPin, Clock, Star, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelect }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalActivities = trip.destinations.reduce((sum, dest) => sum + dest.activities.length, 0);
  const completedActivities = trip.destinations.reduce((sum, dest) => 
    sum + dest.activities.filter(activity => activity.completed).length, 0
  );
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  
  const isUpcoming = trip.startDate && new Date(trip.startDate) > new Date();
  const isCompleted = progressPercentage === 100 && totalActivities > 0;
  const aiGeneratedDestinations = trip.destinations.filter(dest => dest.aiItineraryGenerated).length;

  const getStatusColor = () => {
    if (isCompleted) return 'from-green-500 to-emerald-600';
    if (isUpcoming) return 'from-blue-500 to-cyan-600';
    return 'from-gray-400 to-gray-500';
  };
  return (
    <div 
      onClick={() => onSelect(trip)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-gray-100 overflow-hidden group"
    >
      {/* Status Indicator */}
      <div className={`h-1 bg-gradient-to-r ${getStatusColor()}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                {trip.name}
              </h3>
              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isUpcoming && <TrendingUp className="w-5 h-5 text-blue-500" />}
            </div>
            {trip.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        {totalActivities > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor()} transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-3 text-sky-500" />
            <span className="font-medium">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-3 text-purple-500" />
            <span>{trip.destinations.length} destination{trip.destinations.length !== 1 ? 's' : ''}</span>
            {aiGeneratedDestinations > 0 && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {aiGeneratedDestinations} AI
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-3 text-green-500" />
            <span>
              {completedActivities}/{totalActivities} activit{totalActivities !== 1 ? 'ies' : 'y'}
            </span>
          </div>
        </div>
        
        {/* Trip Highlights */}
        {trip.destinations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {trip.destinations.slice(0, 3).map((dest, index) => (
                  <div 
                    key={dest.id}
                    className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    title={dest.name}
                  >
                    {dest.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {trip.destinations.length > 3 && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold">
                    +{trip.destinations.length - 3}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {isUpcoming ? 'Upcoming' : isCompleted ? 'Completed' : 'In Progress'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};