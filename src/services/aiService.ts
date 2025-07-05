import { AIItineraryRequest, AIItineraryResponse } from '../types';

// Configuration for different AI providers
interface AIConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey: string;
  model: string;
  baseUrl?: string;
}

// Default configuration - you can modify this
const AI_CONFIG: AIConfig = {
  provider: 'openai', // Change to your preferred provider
  apiKey: import.meta.env.VITE_AI_API_KEY || '', // Set your API key in .env
  model: 'gpt-4', // or 'gpt-3.5-turbo', 'claude-3-sonnet', etc.
  baseUrl: import.meta.env.VITE_AI_BASE_URL // Optional custom endpoint
};

export class AIItineraryService {
  private static async callAI(prompt: string): Promise<string> {
    const { provider, apiKey, model, baseUrl } = AI_CONFIG;

    if (!apiKey) {
      console.warn('No AI API key found. Using mock data.');
      return this.getMockResponse();
    }

    try {
      switch (provider) {
        case 'openai':
          return await this.callOpenAI(prompt, apiKey, model, baseUrl);
        case 'anthropic':
          return await this.callAnthropic(prompt, apiKey, model);
        case 'google':
          return await this.callGoogle(prompt, apiKey, model);
        case 'custom':
          return await this.callCustomAPI(prompt, apiKey, model, baseUrl);
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      console.error('AI API call failed:', error);
      console.warn('Falling back to mock data');
      return this.getMockResponse();
    }
  }

  private static async callOpenAI(prompt: string, apiKey: string, model: string, baseUrl?: string): Promise<string> {
    const url = baseUrl || 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a travel expert AI that creates detailed itineraries. Return only valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private static async callAnthropic(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private static async callGoogle(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private static async callCustomAPI(prompt: string, apiKey: string, model: string, baseUrl?: string): Promise<string> {
    if (!baseUrl) {
      throw new Error('Custom API requires baseUrl to be configured');
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.text || data.content;
  }

  private static getMockResponse(): string {
    return JSON.stringify({
      activities: [
        {
          name: "Explore Historic City Center",
          description: "Walk through the charming old town and discover local architecture",
          time: "09:00",
          duration: "2-3 hours",
          category: "sightseeing",
          cost: "Free",
          location: "City Center"
        },
        {
          name: "Local Food Market Tour",
          description: "Experience authentic local cuisine and fresh ingredients",
          time: "11:30",
          duration: "1-2 hours",
          category: "dining",
          cost: "$20-40",
          location: "Central Market"
        },
        {
          name: "Cultural Museum Visit",
          description: "Learn about local history and cultural heritage",
          time: "14:00",
          duration: "2 hours",
          category: "cultural",
          cost: "$15-25",
          location: "Museum District"
        }
      ],
      accommodations: [
        {
          name: "City Center Hotel",
          type: "hotel",
          priceRange: "$120-180/night",
          rating: 4.3,
          description: "Modern hotel with excellent location and amenities"
        },
        {
          name: "Cozy Local Guesthouse",
          type: "guesthouse",
          priceRange: "$60-90/night",
          rating: 4.1,
          description: "Family-run guesthouse with authentic local experience"
        }
      ],
      overview: "A wonderful itinerary combining cultural exploration, local cuisine, and comfortable accommodations."
    });
  }

  private static createPrompt(request: AIItineraryRequest): string {
    const days = request.arrivalDate && request.departureDate 
      ? Math.ceil((new Date(request.departureDate).getTime() - new Date(request.arrivalDate).getTime()) / (1000 * 60 * 60 * 24))
      : 3;

    return `Create a detailed travel itinerary for ${request.destination} for ${days} days.

Requirements:
- Destination: ${request.destination}
- Duration: ${days} days
- Travelers: ${request.travelers || 1}
- Budget: ${request.budget || 'No preference'}
- Interests: ${request.interests?.join(', ') || 'General tourism'}
- Arrival: ${request.arrivalDate || 'Flexible'}
- Departure: ${request.departureDate || 'Flexible'}

Please return a JSON object with this exact structure:
{
  "activities": [
    {
      "name": "Activity name",
      "description": "Detailed description",
      "time": "HH:MM format",
      "duration": "X hours",
      "category": "sightseeing|dining|entertainment|shopping|outdoor|cultural|relaxation",
      "cost": "Price range or 'Free'",
      "location": "Specific location"
    }
  ],
  "accommodations": [
    {
      "name": "Hotel/accommodation name",
      "type": "hotel|hostel|airbnb|resort|guesthouse",
      "priceRange": "Price per night",
      "rating": 4.5,
      "description": "Brief description"
    }
  ],
  "overview": "A comprehensive overview of the itinerary"
}

Create ${Math.max(6, days * 2)} activities and 3-4 accommodation options. Focus on authentic local experiences that match the specified interests and budget.`;
  }

  static async generateItinerary(request: AIItineraryRequest): Promise<AIItineraryResponse> {
    try {
      const prompt = this.createPrompt(request);
      const aiResponse = await this.callAI(prompt);
      
      // Parse the AI response
      const parsedResponse = JSON.parse(aiResponse);
      
      // Add aiGenerated flag to all items
      const activities = parsedResponse.activities.map((activity: any) => ({
        ...activity,
        aiGenerated: true
      }));
      
      const accommodations = parsedResponse.accommodations.map((accommodation: any) => ({
        ...accommodation,
        aiGenerated: true
      }));

      return {
        activities,
        accommodations,
        overview: parsedResponse.overview
      };
    } catch (error) {
      console.error('Error generating itinerary:', error);
      
      // Fallback to mock data if AI fails
      const mockResponse = JSON.parse(this.getMockResponse());
      return {
        activities: mockResponse.activities.map((activity: any) => ({
          ...activity,
          aiGenerated: true
        })),
        accommodations: mockResponse.accommodations.map((accommodation: any) => ({
          ...accommodation,
          aiGenerated: true
        })),
        overview: mockResponse.overview
      };
    }
  }
}