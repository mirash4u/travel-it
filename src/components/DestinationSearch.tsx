import React, { useState } from 'react';
import { Search, MapPin, Star, TrendingUp, Sparkles, Users, Calendar, DollarSign, ArrowRight, Globe, Plane, Camera, Mountain, Waves, Building2, Award, Clock, Heart } from 'lucide-react';
import { AIItineraryRequest } from '../types';
import { Logo } from './Logo';

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
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [preferences, setPreferences] = useState({
    budget: '',
    travelers: 1,
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
    },
    {
      id: '7',
      name: 'New York',
      country: 'USA',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      description: 'The city that never sleeps with iconic skylines, Broadway shows, and world-class dining',
      category: 'city',
      popularActivities: ['Times Square', 'Central Park', 'Broadway Shows', 'Museums'],
      bestTime: 'Apr-Jun, Sep-Nov',
      avgCost: '$200-400/day'
    },
    {
      id: '8',
      name: 'Maldives',
      country: 'Maldives',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      description: 'Pristine coral islands with crystal-clear waters and luxury overwater bungalows',
      category: 'beach',
      popularActivities: ['Snorkeling', 'Diving', 'Spa Treatments', 'Sunset Cruises'],
      bestTime: 'Nov-Apr',
      avgCost: '$300-800/day'
    },
    {
      id: '9',
      name: 'Iceland',
      country: 'Iceland',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      description: 'Land of fire and ice with dramatic landscapes, geysers, and Northern Lights',
      category: 'adventure',
      popularActivities: ['Northern Lights', 'Blue Lagoon', 'Waterfalls', 'Glacier Tours'],
      bestTime: 'Jun-Aug, Sep-Mar',
      avgCost: '$150-300/day'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <Logo size="xl" className="drop-shadow-lg" />
            <div className="text-left">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                TravelCraft
              </h1>
              <p className="text-xl text-gray-600 font-medium">AI-Powered Journey Planning</p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your Next
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Dream Adventure</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Let our AI create personalized itineraries for any destination worldwide. 
              From hidden gems to iconic landmarks, we'll craft the perfect journey just for you.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-gray-900">195+ Countries</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Heart className="w-5 h-5 text-pink-600" />
                <span className="font-semibold text-gray-900">Personalized</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Award className="w-5 h-5 text-cyan-600" />
                <span className="font-semibold text-gray-900">Expert Curated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Where would you like to go? (e.g., Tokyo, New York, Bali, anywhere...)"
                className="w-full pl-16 pr-6 py-6 text-lg border-0 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:outline-none bg-transparent placeholder-gray-500"
              />
              {searchQuery.trim() && !filteredDestinations.some(dest => 
                dest.name.toLowerCase() === searchQuery.toLowerCase()
              ) && (
                <button
                  onClick={handleCustomSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-2xl transition-all duration-300 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Explore "{searchQuery}"</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/25'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                <IconComponent className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                  selectedCategory === category.id ? 'text-white' : 'text-indigo-600'
                }`} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Search Result */}
        {searchQuery.trim() && filteredDestinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="p-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-40 h-40 mx-auto flex items-center justify-center shadow-2xl">
                <Globe className="w-20 h-20 text-indigo-600" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Ready to explore "{searchQuery}"?</h3>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Let our AI create a personalized itinerary for your destination. 
              We'll find the best activities, restaurants, and hidden gems just for you.
            </p>
            <button
              onClick={handleCustomSearch}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-12 py-5 rounded-2xl transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 flex items-center space-x-4 mx-auto"
            >
              <Sparkles className="w-7 h-7" />
              <span>Generate AI Itinerary for {searchQuery}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <>
            {searchQuery.trim() === '' && (
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Trending <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Destinations</span>
                </h2>
                <p className="text-xl text-gray-600">Handpicked destinations loved by travelers worldwide</p>
              </div>
            )}
            
            {/* Enhanced Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredDestinations.map((destination) => {
                const IconComponent = getCategoryIcon(destination.category);
                return (
                  <div
                    key={destination.id}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-[1.02] border border-gray-100"
                    onClick={() => handleDestinationSelect(destination.name)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                          <IconComponent className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-semibold text-gray-700 capitalize">{destination.category}</span>
                        </div>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1 shadow-lg">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-700">{destination.rating}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
                        <p className="text-white/90 font-medium">{destination.country}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{destination.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-3 text-green-500" />
                          <span className="font-medium">Best time: {destination.bestTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-3 text-blue-500" />
                          <span className="font-medium">Average cost: {destination.avgCost}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {destination.popularActivities.slice(0, 3).map((activity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full font-medium"
                          >
                            {activity}
                          </span>
                        ))}
                        {destination.popularActivities.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                            +{destination.popularActivities.length - 3} more
                          </span>
                        )}
                      </div>

                      <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 rounded-2xl transition-all duration-300 font-bold flex items-center justify-center space-x-3 group shadow-lg hover:shadow-xl">
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span>Generate AI Itinerary</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Enhanced Preferences Modal */}
        {showPreferences && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white rounded-t-3xl">
                <div className="flex items-center space-x-4 mb-4">
                  <Logo size="md" />
                  <div>
                    <h2 className="text-3xl font-bold">Plan Your Trip to {selectedDestination}</h2>
                    <p className="text-indigo-100 text-lg">Tell us your preferences to create the perfect itinerary</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Calendar className="w-5 h-5 inline mr-2 text-indigo-600" />
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={preferences.arrivalDate}
                      onChange={(e) => setPreferences(prev => ({ ...prev, arrivalDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Calendar className="w-5 h-5 inline mr-2 text-indigo-600" />
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={preferences.departureDate}
                      onChange={(e) => setPreferences(prev => ({ ...prev, departureDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    <DollarSign className="w-5 h-5 inline mr-2 text-indigo-600" />
                    Budget Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Budget ($)', 'Mid-range ($$)', 'Luxury ($$$)', 'No preference'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setPreferences(prev => ({ ...prev, budget: option }))}
                        className={`p-4 text-sm rounded-xl border-2 transition-all duration-200 font-semibold ${
                          preferences.budget === option
                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    <Users className="w-5 h-5 inline mr-2 text-indigo-600" />
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={preferences.travelers}
                    onChange={(e) => setPreferences(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    <Heart className="w-5 h-5 inline mr-2 text-indigo-600" />
                    Interests (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-4 text-sm rounded-xl border-2 transition-all duration-200 text-left font-semibold ${
                          preferences.interests.includes(interest)
                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="flex-1 px-8 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-bold text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateItinerary}
                    className="flex-2 px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="w-6 h-6" />
                    <span>Generate My Perfect Itinerary</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};