import React, { useState } from 'react';
import { Search, MapPin, Star, TrendingUp, Sparkles, Users, Calendar, DollarSign, ArrowRight, Globe, Plane, Camera, Mountain, Waves, Building2 } from 'lucide-react';
import { AIItineraryRequest } from '../types';
import { Navigation } from './Navigation';
import { AuthModal } from './AuthModal';

interface PopularDestination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  description: string;
  category: 'beach' | 'city' | 'mountain' | 'cultural' | 'adventure';
  popularActivities: string[];
  bestTime: string;
  avgCost: string;
}

interface DestinationSearchProps {
  onGenerateItinerary: (destination: string, preferences: AIItineraryRequest) => void;
}

export const DestinationSearch: React.FC<DestinationSearchProps> = ({ onGenerateItinerary }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [preferences, setPreferences] = useState({
    budget: '',
    travelers: 2,
    interests: [] as string[],
    arrivalDate: '',
    departureDate: ''
  });

  const popularDestinations: PopularDestination[] = [
    {
      id: '1',
      name: 'Paris',
      country: 'France',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      description: 'The City of Light with iconic landmarks, world-class museums, and romantic atmosphere',
      category: 'city',
      popularActivities: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre'],
      bestTime: 'Apr-Jun, Sep-Oct',
      avgCost: '$150-300/day'
    },
    {
      id: '2',
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture',
      category: 'beach',
      popularActivities: ['Beach Hopping', 'Temple Tours', 'Rice Terraces', 'Volcano Hiking'],
      bestTime: 'Apr-Oct',
      avgCost: '$50-150/day'
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      description: 'Modern metropolis blending traditional culture with cutting-edge technology',
      category: 'city',
      popularActivities: ['Shibuya Crossing', 'Sushi Markets', 'Temple Visits', 'Cherry Blossoms'],
      bestTime: 'Mar-May, Sep-Nov',
      avgCost: '$100-250/day'
    },
    {
      id: '4',
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      description: 'Stunning Greek island with white-washed buildings and breathtaking sunsets',
      category: 'beach',
      popularActivities: ['Sunset Viewing', 'Wine Tasting', 'Beach Relaxation', 'Boat Tours'],
      bestTime: 'Apr-Oct',
      avgCost: '$120-280/day'
    },
    {
      id: '5',
      name: 'Swiss Alps',
      country: 'Switzerland',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      description: 'Majestic mountain ranges perfect for skiing, hiking, and scenic train rides',
      category: 'mountain',
      popularActivities: ['Skiing', 'Mountain Hiking', 'Scenic Trains', 'Alpine Lakes'],
      bestTime: 'Dec-Mar, Jun-Sep',
      avgCost: '$200-400/day'
    },
    {
      id: '6',
      name: 'Marrakech',
      country: 'Morocco',
      image: 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      description: 'Vibrant imperial city with bustling souks, palaces, and rich cultural heritage',
      category: 'cultural',
      popularActivities: ['Medina Tours', 'Souk Shopping', 'Palace Visits', 'Desert Trips'],
      bestTime: 'Oct-Apr',
      avgCost: '$60-120/day'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Destinations', icon: Globe },
    { id: 'city', name: 'Cities', icon: Building2 },
    { id: 'beach', name: 'Beaches', icon: Waves },
    { id: 'mountain', name: 'Mountains', icon: Mountain },
    { id: 'cultural', name: 'Cultural', icon: Camera },
    { id: 'adventure', name: 'Adventure', icon: TrendingUp }
  ];

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

  const filteredDestinations = popularDestinations.filter(dest => {
    const matchesSearch = searchQuery.trim() === '' || 
                         dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleDestinationSelect = (destination: string) => {
    setSelectedDestination(destination);
    setShowPreferences(true);
  };

  const handleCustomSearch = () => {
    if (searchQuery.trim()) {
      setSelectedDestination(searchQuery.trim());
      setShowPreferences(true);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleCustomSearch();
    }
  };

  const handleGenerateItinerary = () => {
    const request: AIItineraryRequest = {
      destination: selectedDestination,
      arrivalDate: preferences.arrivalDate,
      departureDate: preferences.departureDate,
      budget: preferences.budget,
      travelers: preferences.travelers,
      interests: preferences.interests
    };
    onGenerateItinerary(selectedDestination, request);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Globe;
  };

  const handleNavigation = (section: string) => {
    switch (section) {
      case 'signin':
        setAuthMode('signin');
        setShowAuthModal(true);
        break;
      case 'register':
        setAuthMode('register');
        setShowAuthModal(true);
        break;
      case 'packages':
        // Handle holiday packages navigation
        console.log('Navigate to holiday packages');
        break;
      case 'schedule':
        // Handle flight schedule navigation
        console.log('Navigate to flight schedule');
        break;
      case 'settings':
        // Handle account settings navigation
        console.log('Navigate to account settings');
        break;
      case 'booking':
        // Handle manage booking navigation
        console.log('Navigate to manage booking');
        break;
      default:
        console.log('Navigate to:', section);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <Navigation onNavigate={handleNavigation} />

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hey Buddy! Where are you
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Flying to?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Discover amazing destinations and let our AI create the perfect itinerary for your next adventure
            </p>
            
            <button
              onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Search Section */}
          <div id="search-section" className="mb-16">
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Search destinations worldwide..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                />
                {searchQuery.trim() && (
                  <button
                    onClick={handleCustomSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    Search
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-900">Popular Destinations</h3>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2 transition-colors"
              >
                <span>Explore All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination) => {
                const IconComponent = getCategoryIcon(destination.category);
                return (
                  <div
                    key={destination.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => handleDestinationSelect(destination.name)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                          <IconComponent className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 capitalize">{destination.category}</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-700">{destination.rating}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                        <p className="text-white/90">{destination.country}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-green-500" />
                          <span>Best time: {destination.bestTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Average cost: {destination.avgCost}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {destination.popularActivities.slice(0, 3).map((activity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                        {destination.popularActivities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{destination.popularActivities.length - 3} more
                          </span>
                        )}
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Generate AI Itinerary</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Search Result */}
          {searchQuery.trim() && filteredDestinations.length === 0 && (
            <div className="text-center py-16">
              <div className="p-6 bg-blue-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Globe className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to explore "{searchQuery}"?</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Let our AI create a personalized itinerary for your destination
              </p>
              <button
                onClick={handleCustomSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 mx-auto"
              >
                <Sparkles className="w-6 h-6" />
                <span>Generate AI Itinerary for {searchQuery}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Preferences Modal */}
        {showPreferences && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Plan Your Trip to {selectedDestination}</h2>
                <p className="text-gray-600 mt-1">Tell us your preferences to create the perfect itinerary</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={preferences.arrivalDate}
                      onChange={(e) => setPreferences(prev => ({ ...prev, arrivalDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={preferences.departureDate}
                      onChange={(e) => setPreferences(prev => ({ ...prev, departureDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Budget Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Budget ($)', 'Mid-range ($$)', 'Luxury ($$$)', 'No preference'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setPreferences(prev => ({ ...prev, budget: option }))}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          preferences.budget === option
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Interests (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                          preferences.interests.includes(interest)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateItinerary}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Itinerary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </div>
    </div>
  );
};