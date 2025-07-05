export interface Activity {
  id: string;
  name: string;
  description?: string;
  time?: string;
  duration?: string;
  category: 'sightseeing' | 'dining' | 'entertainment' | 'shopping' | 'outdoor' | 'cultural' | 'relaxation';
  completed: boolean;
  cost?: string;
  location?: string;
  aiGenerated?: boolean;
}

export interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'guesthouse';
  priceRange: string;
  rating?: number;
  description?: string;
  aiGenerated?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  description?: string;
  activities: Activity[];
  notes: Note[];
  accommodations: Accommodation[];
  arrivalDate?: string;
  departureDate?: string;
  aiItineraryGenerated?: boolean;
  itineraryFinalized?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  destinations: Destination[];
  startDate?: string;
  endDate?: string;
  coverImage?: string;
  budget?: string;
  travelers?: number;
}

export interface AIItineraryRequest {
  destination: string;
  arrivalDate?: string;
  departureDate?: string;
  budget?: string;
  travelers?: number;
  interests?: string[];
}

export interface AIItineraryResponse {
  activities: Omit<Activity, 'id' | 'completed'>[];
  accommodations: Omit<Accommodation, 'id'>[];
  overview: string;
}