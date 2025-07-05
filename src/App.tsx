import React, { useState } from 'react';
import { Trip, AIItineraryRequest, AIItineraryResponse } from './types';
import { TripsList } from './components/TripsList';
import { TripDetails } from './components/TripDetails';
import { DestinationSearch } from './components/DestinationSearch';
import { ItineraryPreview } from './components/ItineraryPreview';
import { AIItineraryService } from './services/aiService';
import { UserProfile } from './components/UserProfile';
import { ProcessingTracker } from './components/ProcessingTracker';

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'itinerary' | 'trips' | 'trip-details' | 'profile'>('search');
  const [generatedItinerary, setGeneratedItinerary] = useState<AIItineraryResponse | null>(null);
  const [currentPreferences, setCurrentPreferences] = useState<AIItineraryRequest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showProcessingTracker, setShowProcessingTracker] = useState(false);
  const [processingDestination, setProcessingDestination] = useState('');

  const handleGenerateItinerary = async (destination: string, preferences: AIItineraryRequest) => {
    console.log('App: Starting itinerary generation for:', destination);
    console.log('App: Preferences:', preferences);
    setIsGenerating(true);
    setCurrentPreferences(preferences);
    setProcessingDestination(destination);
    setShowProcessingTracker(true);
    
    try {
      const response = await AIItineraryService.generateItinerary(preferences);
      console.log('App: Received AI response:', response);
      
      // Hide processing tracker before showing results
      setShowProcessingTracker(false);
      setGeneratedItinerary(response);
      setCurrentView('itinerary');
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Check if it's an API key issue
      if (errorMessage.includes('API key')) {
        alert(`AI Configuration Required:\n\nTo use real AI-generated itineraries, please:\n1. Copy .env.example to .env\n2. Add your AI API key\n3. Restart the application\n\nFor now, you'll see demo data.`);
      } else {
        alert(`Failed to generate itinerary: ${errorMessage}\n\nPlease try again or check your internet connection.`);
      }
    } finally {
      setIsGenerating(false);
      setShowProcessingTracker(false);
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

  const handleShowProfile = () => {
    setShowUserProfile(true);
  };

  const handleCloseProfile = () => {
    setShowUserProfile(false);
  };

  const handleProcessingComplete = () => {
    // This will be called when the processing animation completes
    // The actual API call continues in the background
  };

  // Prevent flickering by ensuring stable rendering
  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return (
          <DestinationSearch 
            onGenerateItinerary={handleGenerateItinerary}
            onGoToTrips={goToTrips}
            onShowProfile={handleShowProfile}
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
      
      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile onClose={handleCloseProfile} />
      )}
      
      {/* Processing Tracker */}
      <ProcessingTracker 
        isVisible={showProcessingTracker}
        destination={processingDestination}
        onComplete={handleProcessingComplete}
      />
    </div>
  );
}

export default App;