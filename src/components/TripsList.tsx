import React, { useState } from 'react';
import { Plus, Plane, TrendingUp, Calendar, MapPin, Clock, Star, DollarSign } from 'lucide-react';
import { Trip } from '../types';
import { TripCard } from './TripCard';
import { AddTripForm } from './AddTripForm';

interface TripsListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onAddTrip: (trip: Omit<Trip, 'id'>) => void;
  onBackToSearch: () => void;
}

export const TripsList: React.FC<TripsListProps> = ({ trips, onSelectTrip, onAddTrip, onBackToSearch }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Calculate insights
  const totalDestinations = trips.reduce((sum, trip) => sum + trip.destinations.length, 0);
  const totalActivities = trips.reduce((sum, trip) => 
    sum + trip.destinations.reduce((destSum, dest) => destSum + dest.activities.length, 0), 0
  );
  const completedActivities = trips.reduce((sum, trip) => 
    sum + trip.destinations.reduce((destSum, dest) => 
      destSum + dest.activities.filter(activity => activity.completed).length, 0
    ), 0
  );
  const upcomingTrips = trips.filter(trip => 
    trip.startDate && new Date(trip.startDate) > new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12">
          <div className="flex items-center space-x-4 mb-6 lg:mb-0">
            <button
              onClick={onBackToSearch}
              className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-200 transition-colors"
              title="Back to destination search"
            >
              <Plus className="w-6 h-6 text-gray-600 transform rotate-45" />
            </button>
            <div className="p-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Travel Planner
              </h1>
              <p className="text-gray-600 text-lg">Plan your perfect adventures with AI assistance</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            <span className="text-lg">Create Manual Trip</span>
          </button>
        </div>

        {/* Insights Dashboard */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-sky-100 rounded-xl">
                  <Plane className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
                  <p className="text-sm text-gray-600">Total Trips</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalDestinations}</p>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{upcomingTrips}</p>
                  <p className="text-sm text-gray-600">Upcoming Trips</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedActivities}</p>
                  <p className="text-sm text-gray-600">Activities Done</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Plane className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Your created trips will appear here</p>
            <button
              onClick={onBackToSearch}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-10 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 mr-4"
            >
              Discover Destinations
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Manual Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip}
                onSelect={onSelectTrip}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};