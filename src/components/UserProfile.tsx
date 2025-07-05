import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Settings, Camera, Edit3, Save, X } from 'lucide-react';

interface UserProfileProps {
  onClose: () => void;
}

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  preferences?: {
    budget: string;
    travelStyle: string;
    interests: string[];
  };
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>(() => {
    const stored = localStorage.getItem('travelcraft_user');
    const baseUser = stored ? JSON.parse(stored) : { name: 'Guest User', email: 'guest@example.com' };
    
    // Get extended profile data
    const profileData = localStorage.getItem('travelcraft_profile');
    const profile = profileData ? JSON.parse(profileData) : {};
    
    return {
      ...baseUser,
      bio: profile.bio || '',
      location: profile.location || '',
      joinDate: profile.joinDate || new Date().toISOString(),
      preferences: profile.preferences || {
        budget: 'Mid-range ($$)',
        travelStyle: 'Cultural Explorer',
        interests: ['Culture & History', 'Food & Dining']
      }
    };
  });

  const [editData, setEditData] = useState(userData);

  const travelStyles = [
    'Adventure Seeker',
    'Cultural Explorer', 
    'Luxury Traveler',
    'Budget Backpacker',
    'Family Traveler',
    'Solo Explorer',
    'Business Traveler',
    'Eco Tourist'
  ];

  const budgetOptions = [
    'Budget ($)',
    'Mid-range ($$)',
    'Luxury ($$$)',
    'Ultra Luxury ($$$$)'
  ];

  const interestOptions = [
    'Culture & History',
    'Food & Dining',
    'Nightlife',
    'Nature & Outdoors',
    'Shopping',
    'Art & Museums',
    'Adventure Sports',
    'Relaxation',
    'Photography',
    'Architecture',
    'Local Experiences',
    'Festivals & Events'
  ];

  const handleSave = () => {
    // Update localStorage
    const baseUser = { name: editData.name, email: editData.email };
    localStorage.setItem('travelcraft_user', JSON.stringify(baseUser));
    
    const profileData = {
      bio: editData.bio,
      location: editData.location,
      joinDate: editData.joinDate,
      preferences: editData.preferences
    };
    localStorage.setItem('travelcraft_profile', JSON.stringify(profileData));
    
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const toggleInterest = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        interests: prev.preferences!.interests.includes(interest)
          ? prev.preferences!.interests.filter(i => i !== interest)
          : [...prev.preferences!.interests, interest]
      }
    }));
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-blue-100 flex items-center mt-2">
                <Mail className="w-4 h-4 mr-2" />
                {userData.email}
              </p>
              {userData.location && (
                <p className="text-blue-100 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  {userData.location}
                </p>
              )}
              <p className="text-blue-100 flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                Member since {formatJoinDate(userData.joinDate!)}
              </p>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Bio Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself and your travel experiences..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {userData.bio || 'No bio added yet. Click edit to add information about yourself!'}
              </p>
            )}
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{userData.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{userData.location || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Travel Preferences</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Budget Preference</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {budgetOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setEditData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences!, budget: option }
                        }))}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          editData.preferences?.budget === option
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">{userData.preferences?.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Travel Style</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {travelStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => setEditData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences!, travelStyle: style }
                        }))}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          editData.preferences?.travelStyle === style
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">{userData.preferences?.travelStyle}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Interests</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                          editData.preferences?.interests.includes(interest)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userData.preferences?.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};