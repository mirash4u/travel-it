import React, { useState } from 'react';
import { Trip, AIItineraryRequest, AIItineraryResponse } from './types';
import { TripsList } from './components/TripsList';
import { TripDetails } from './components/TripDetails';
import { DestinationSearch } from './components/DestinationSearch';
import { ItineraryPreview } from './components/ItineraryPreview';
import { AIItineraryService } from './services/aiService';

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'itinerary' | 'trips' | 'trip-details'>('search');
  const [generatedItinerary, setGeneratedItinerary] = useState<AIItineraryResponse | null>(null);
  const [currentPreferences, setCurrentPreferences] = useState<AIItineraryRequest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateItinerary = async (destination: string, preferences: AIItineraryRequest) => {
    console.log('App: Starting itinerary generation for:', destination);
    setIsGenerating(true);
    setCurrentPreferences(preferences);
    try {
      const response = await AIItineraryService.generateItinerary(preferences);
      console.log('App: Received AI response:', response);
      setGeneratedItinerary(response);
      setCurrentView('itinerary');
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      // Show user-friendly error message
      alert('Failed to generate itinerary. Please check your AI configuration or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateTripFromItinerary = (tripName: string) => {
    if (!generatedItinerary || !currentPreferences) return;

    const destination = {
      id: Date.now().toString(),
      name: currentPreferences.destination,
      description: generatedItinerary.overview,
      arrivalDate: currentPreferences.arrivalDate,
      departureDate: currentPreferences.departureDate,
      activities: generatedItinerary.activities.map((activity, index) => ({
        ...activity,
        id: `${Date.now()}-${index}`,
        completed: false
      })),
      accommodations: generatedItinerary.accommodations.map((accommodation, index) => ({
        ...accommodation,
        id: `${Date.now()}-acc-${index}`
      })),
      notes: [],
      aiItineraryGenerated: true,
      itineraryFinalized: true
    };

    const newTrip: Trip = {
      id: Date.now().toString(),
      name: tripName,
      description: `AI-generated trip to ${currentPreferences.destination}`,
      startDate: currentPreferences.arrivalDate,
      endDate: currentPreferences.departureDate,
      destinations: [destination]
    };

    setTrips([...trips, newTrip]);
    setSelectedTrip(newTrip);
    setCurrentView('trip-details');
    
    // Reset states
    setGeneratedItinerary(null);
    setCurrentPreferences(null);
  };

  const addTrip = (tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString()
    };
    setTrips([...trips, newTrip]);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    ));
    setSelectedTrip(updatedTrip);
  };

  const selectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setCurrentView('trip-details');
  };

  const goBackToTrips = () => {
    setSelectedTrip(null);
    setCurrentView('trips');
  };

  const goBackToSearch = () => {
    setCurrentView('search');
    setGeneratedItinerary(null);
    setCurrentPreferences(null);
    setSelectedTrip(null);
  };

  const goToTrips = () => {
    setCurrentView('trips');
    setGeneratedItinerary(null);
    setCurrentPreferences(null);
  };

  // Prevent flickering by ensuring stable rendering
  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return (
          <DestinationSearch 
            onGenerateItinerary={handleGenerateItinerary}
            onGoToTrips={goToTrips}
          />
        );
      
      case 'itinerary':
        if (!generatedItinerary || !currentPreferences) {
          setCurrentView('search');
          return null;
        }
        return (
          <ItineraryPreview
            itinerary={generatedItinerary}
            destination={currentPreferences.destination}
            preferences={currentPreferences}
            onCreateTrip={handleCreateTripFromItinerary}
            onRegenerate={() => handleGenerateItinerary(currentPreferences.destination, currentPreferences)}
            onBack={goBackToSearch}
            isGenerating={isGenerating}
          />
        );
      
      case 'trips':
        return (
          <TripsList
            trips={trips}
            onSelectTrip={selectTrip}
            onAddTrip={addTrip}
            onBackToSearch={goBackToSearch}
          />
        );
      
      case 'trip-details':
        if (!selectedTrip) {
          setCurrentView('trips');
          return null;
        }
        return (
          <TripDetails
            trip={selectedTrip}
            onUpdateTrip={updateTrip}
            onBack={goBackToTrips}
          />
        );
      
      default:
        return (
          <DestinationSearch 
            onGenerateItinerary={handleGenerateItinerary}
            onGoToTrips={goToTrips}
          />
        );
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {renderCurrentView()}
    </div>
  );
}

export default App;