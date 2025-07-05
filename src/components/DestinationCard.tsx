import React, { useState } from 'react';
import { MapPin, Plus, Calendar, Clock, StickyNote, Check, X, Bed, Sparkles, Star, DollarSign } from 'lucide-react';
import { Destination, Activity, Note } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onUpdateDestination: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination, 
  onUpdateDestination 
}) => {
  const [newActivity, setNewActivity] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showAccommodations, setShowAccommodations] = useState(false);

  const addActivity = () => {
    if (newActivity.trim()) {
      const activity: Activity = {
        id: Date.now().toString(),
        name: newActivity.trim(),
        completed: false
      };
      
      onUpdateDestination({
        ...destination,
        activities: [...destination.activities, activity]
      });
      
      setNewActivity('');
      setShowActivityForm(false);
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        timestamp: new Date()
      };
      
      onUpdateDestination({
        ...destination,
        notes: [...destination.notes, note]
      });
      
      setNewNote('');
      setShowNoteForm(false);
    }
  };

  const toggleActivity = (activityId: string) => {
    onUpdateDestination({
      ...destination,
      activities: destination.activities.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    });
  };

  const removeActivity = (activityId: string) => {
    onUpdateDestination({
      ...destination,
      activities: destination.activities.filter(activity => activity.id !== activityId)
    });
  };

  const removeNote = (noteId: string) => {
    onUpdateDestination({
      ...destination,
      notes: destination.notes.filter(note => note.id !== noteId)
    });
  };

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      {destination.aiItineraryGenerated && !destination.itineraryFinalized && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>AI Generated</span>
          </div>
        </div>
      )}
      
      {destination.itineraryFinalized && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
            <Check className="w-3 h-3" />
            <span>Finalized</span>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{destination.name}</h3>
            {destination.description && (
              <p className="text-teal-100 mt-2 leading-relaxed">{destination.description}</p>
            )}
          </div>
        </div>
        
        {(destination.arrivalDate || destination.departureDate) && (
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-teal-100">
            {destination.arrivalDate && (
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>Arrive: {new Date(destination.arrivalDate).toLocaleDateString()}</span>
              </div>
            )}
            {destination.departureDate && (
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>Depart: {new Date(destination.departureDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-8 space-y-8">
        {/* Activities Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              Activities ({destination.activities.length})
            </h4>
            <button
              onClick={() => setShowActivityForm(true)}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 font-semibold bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {destination.activities.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No activities planned yet</p>
              <p className="text-gray-400 text-sm">Add your first activity to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {destination.activities.map((activity) => (
                <div 
                  key={activity.id}
                  className={`flex items-start space-x-4 p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    activity.completed 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-teal-300'
                  }`}
                >
                  {activity.aiGenerated && (
                    <span className="text-2xl mt-1">{getCategoryIcon(activity.category)}</span>
                  )}
                  <button
                    onClick={() => toggleActivity(activity.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
                      activity.completed
                        ? 'bg-green-500 border-green-500 text-white shadow-sm'
                        : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    {activity.completed && <Check className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <div className={`font-semibold text-lg ${activity.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {activity.name}
                    </div>
                    {activity.description && (
                      <p className="text-gray-600 mt-2 leading-relaxed">{activity.description}</p>
                    )}
                    {activity.aiGenerated && (
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                        {activity.time && (
                          <span className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.time}
                          </span>
                        )}
                        {activity.duration && (
                          <span className="bg-gray-100 px-2 py-1 rounded-md">{activity.duration}</span>
                        )}
                        {activity.cost && (
                          <span className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {activity.cost}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full capitalize font-medium">
                          {activity.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors mt-1 p-1 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showActivityForm && (
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Enter activity name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4 font-medium"
                onKeyPress={(e) => e.key === 'Enter' && addActivity()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={addActivity}
                  className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-semibold"
                >
                  Add Activity
                </button>
                <button
                  onClick={() => setShowActivityForm(false)}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accommodations Section */}
        {destination.accommodations && destination.accommodations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-pink-100 rounded-lg mr-3">
                  <Bed className="w-5 h-5 text-pink-600" />
                </div>
                Accommodations ({destination.accommodations.length})
              </h4>
              <button
                onClick={() => setShowAccommodations(!showAccommodations)}
                className="text-pink-600 hover:text-pink-700 font-semibold bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg transition-colors"
              >
                {showAccommodations ? 'Hide' : 'Show'}
              </button>
            </div>

            {showAccommodations && (
              <div className="space-y-4">
                {destination.accommodations.map((accommodation) => (
                  <div key={accommodation.id} className="bg-pink-50 border-2 border-pink-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">{getAccommodationIcon(accommodation.type)}</span>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg text-gray-900">{accommodation.name}</h5>
                        {accommodation.description && (
                          <p className="text-gray-600 mt-2 leading-relaxed">{accommodation.description}</p>
                        )}
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
            )}
          </div>
        )}

        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <StickyNote className="w-5 h-5 text-amber-600" />
              </div>
              Notes ({destination.notes.length})
            </h4>
            <button
              onClick={() => setShowNoteForm(true)}
              className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {destination.notes.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No notes yet</p>
              <p className="text-gray-400 text-sm">Add important reminders and thoughts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {destination.notes.map((note) => (
                <div key={note.id} className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <p className="text-gray-900 flex-1 leading-relaxed font-medium">{note.content}</p>
                    <button
                      onClick={() => removeNote(note.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-3 p-1 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-amber-600 mt-3 font-medium">
                    {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showNoteForm && (
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 mb-4 font-medium"
                rows={3}
              />
              <div className="flex space-x-3">
                <button
                  onClick={addNote}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold"
                >
                  Add Note
                </button>
                <button
                  onClick={() => setShowNoteForm(false)}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};