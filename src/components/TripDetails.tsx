import React, { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Calendar, Clock, StickyNote, Sparkles, TrendingUp, Target, CheckCircle2, Star, BarChart3 } from 'lucide-react';
import { Trip, Destination, Activity, Accommodation, AIItineraryRequest, AIItineraryResponse } from '../types';
import { DestinationCard } from './DestinationCard';
import { AIItineraryGenerator } from './AIItineraryGenerator';
import { AIItineraryPreview } from './AIItineraryPreview';
import { AIItineraryService } from '../services/aiService';

interface TripDetailsProps {
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
  onBack: () => void;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ trip, onUpdateTrip, onBack }) => {
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiItinerary, setAiItinerary] = useState<AIItineraryResponse | null>(null);
  const [currentDestinationForAI, setCurrentDestinationForAI] = useState<string>('');
  const [newDestination, setNewDestination] = useState({
    name: '',
    description: '',
    arrivalDate: '',
    departureDate: ''
  });

  const addDestination = () => {
    if (newDestination.name.trim()) {
      const destination: Destination = {
        id: Date.now().toString(),
        name: newDestination.name.trim(),
        description: newDestination.description.trim(),
        arrivalDate: newDestination.arrivalDate,
        departureDate: newDestination.departureDate,
        activities: [],
        notes: []
      };

      onUpdateTrip({
        ...trip,
        destinations: [...trip.destinations, destination]
      });

      setNewDestination({
        name: '',
        description: '',
        arrivalDate: '',
        departureDate: ''
      });
      setShowAddDestination(false);
    }
  };

  const handleAIGeneration = async (request: AIItineraryRequest) => {
    setIsGeneratingAI(true);
    try {
      const response = await AIItineraryService.generateItinerary(request);
      setAiItinerary(response);
    } catch (error) {
      console.error('Failed to generate AI itinerary:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAcceptAIItinerary = () => {
    if (!aiItinerary || !currentDestinationForAI) return;

    const destination: Destination = {
      id: Date.now().toString(),
      name: currentDestinationForAI,
      description: aiItinerary.overview,
      arrivalDate: newDestination.arrivalDate,
      departureDate: newDestination.departureDate,
      activities: aiItinerary.activities.map((activity, index) => ({
        ...activity,
        id: `${Date.now()}-${index}`,
        completed: false
      })),
      accommodations: aiItinerary.accommodations.map((accommodation, index) => ({
        ...accommodation,
        id: `${Date.now()}-acc-${index}`
      })),
      notes: [],
      aiItineraryGenerated: true,
      itineraryFinalized: true
    };

    onUpdateTrip({
      ...trip,
      destinations: [...trip.destinations, destination]
    });

    // Reset states
    setAiItinerary(null);
    setShowAIGenerator(false);
    setShowAddDestination(false);
    setCurrentDestinationForAI('');
    setNewDestination({
      name: '',
      description: '',
      arrivalDate: '',
      departureDate: ''
    });
  };

  const handleCustomizeAIItinerary = () => {
    if (!aiItinerary || !currentDestinationForAI) return;

    const destination: Destination = {
      id: Date.now().toString(),
      name: currentDestinationForAI,
      description: aiItinerary.overview,
      arrivalDate: newDestination.arrivalDate,
      departureDate: newDestination.departureDate,
      activities: aiItinerary.activities.map((activity, index) => ({
        ...activity,
        id: `${Date.now()}-${index}`,
        completed: false
      })),
      accommodations: aiItinerary.accommodations.map((accommodation, index) => ({
        ...accommodation,
        id: `${Date.now()}-acc-${index}`
      })),
      notes: [],
      aiItineraryGenerated: true,
      itineraryFinalized: false
    };

    onUpdateTrip({
      ...trip,
      destinations: [...trip.destinations, destination]
    });

    // Reset states
    setAiItinerary(null);
    setShowAIGenerator(false);
    setShowAddDestination(false);
    setCurrentDestinationForAI('');
    setNewDestination({
      name: '',
      description: '',
      arrivalDate: '',
      departureDate: ''
    });
  };

  const handleRejectAIItinerary = () => {
    setAiItinerary(null);
  };

  const handleGenerateAIItinerary = () => {
    if (newDestination.name.trim()) {
      setCurrentDestinationForAI(newDestination.name.trim());
      setShowAIGenerator(true);
    }
  };

  const updateDestination = (updatedDestination: Destination) => {
    onUpdateTrip({
      ...trip,
      destinations: trip.destinations.map(dest =>
        dest.id === updatedDestination.id ? updatedDestination : dest
      )
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalActivities = trip.destinations.reduce((total, dest) => total + dest.activities.length, 0);
  const completedActivities = trip.destinations.reduce((total, dest) => 
    total + dest.activities.filter(activity => activity.completed).length, 0
  );
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  const aiGeneratedDestinations = trip.destinations.filter(dest => dest.aiItineraryGenerated).length;
  const finalizedDestinations = trip.destinations.filter(dest => dest.itineraryFinalized).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Trips</span>
            </button>
          </div>
          
          <button
            onClick={() => setShowAddDestination(true)}
            className="flex items-center space-x-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 mt-4 lg:mt-0"
          >
            <Plus className="w-6 h-6" />
            <span>Add Destination</span>
          </button>
        </div>

        {/* Trip Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                {trip.name}
              </h1>
              {trip.description && (
                <p className="text-gray-600 text-lg mb-6">{trip.description}</p>
              )}
            </div>
            
            {/* Progress Circle */}
            {totalActivities > 0 && (
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray={`${progressPercentage}, 100`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Trip Progress</p>
                  <p>{completedActivities} of {totalActivities} done</p>
                </div>
              </div>
            )}
          </div>
          {trip.description && (
            <p className="text-gray-600 mb-6">{trip.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-sky-100 rounded-xl">
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold text-gray-900">{formatDate(trip.startDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-semibold text-gray-900">{formatDate(trip.endDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Destinations</p>
                <p className="font-semibold text-gray-900">{trip.destinations.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Activities</p>
                <p className="font-semibold text-gray-900">{completedActivities}/{totalActivities}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-pink-100 rounded-xl">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">AI Generated</p>
                <p className="font-semibold text-gray-900">{aiGeneratedDestinations}/{trip.destinations.length}</p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          {trip.destinations.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-900">Planning Status</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {finalizedDestinations} of {trip.destinations.length} destinations finalized
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold text-gray-900">AI Assistance</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Math.round((aiGeneratedDestinations / Math.max(trip.destinations.length, 1)) * 100)}% AI-powered planning
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-gray-900">Completion Rate</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {totalActivities > 0 ? Math.round(progressPercentage) : 0}% activities completed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Destinations */}
        {trip.destinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="p-6 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-lg">
                <MapPin className="w-16 h-16 text-sky-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to explore?</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Add your first destination and let AI create a personalized itinerary for you
            </p>
            <button
              onClick={() => setShowAddDestination(true)}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-10 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Add Your First Destination
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Destinations</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>AI Generated</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Finalized</span>
                </span>
              </div>
            </div>
            <div className="space-y-8">
              {trip.destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onUpdateDestination={updateDestination}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Destination Modal */}
        {showAddDestination && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add Destination</h2>
                <button
                  onClick={() => setShowAddDestination(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-6 h-6 transform rotate-45" />
                </button>
              </div>

              <div className="p-6">
                {!showAIGenerator && !aiItinerary && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Destination Name
                      </label>
                      <input
                        type="text"
                        value={newDestination.name}
                        onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        placeholder="Enter destination name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <StickyNote className="w-4 h-4 inline mr-2" />
                        Description (Optional)
                      </label>
                      <textarea
                        value={newDestination.description}
                        onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        placeholder="Describe this destination..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Arrival Date
                        </label>
                        <input
                          type="date"
                          value={newDestination.arrivalDate}
                          onChange={(e) => setNewDestination({ ...newDestination, arrivalDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Departure Date
                        </label>
                        <input
                          type="date"
                          value={newDestination.departureDate}
                          onChange={(e) => setNewDestination({ ...newDestination, departureDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => setShowAddDestination(false)}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleGenerateAIItinerary}
                        disabled={!newDestination.name.trim()}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate with AI</span>
                      </button>
                      <button
                        onClick={addDestination}
                        className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                      >
                        Add Manually
                      </button>
                    </div>
                  </div>
                )}

                {showAIGenerator && !aiItinerary && (
                  <AIItineraryGenerator
                    destination={currentDestinationForAI}
                    arrivalDate={newDestination.arrivalDate}
                    departureDate={newDestination.departureDate}
                    onGenerate={handleAIGeneration}
                    isGenerating={isGeneratingAI}
                  />
                )}

                {aiItinerary && (
                  <AIItineraryPreview
                    itinerary={aiItinerary}
                    destination={currentDestinationForAI}
                    onAccept={handleAcceptAIItinerary}
                    onReject={handleRejectAIItinerary}
                    onCustomize={handleCustomizeAIItinerary}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};