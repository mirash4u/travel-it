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
  provider: (import.meta.env.VITE_AI_PROVIDER as any) || 'openai', // Change to your preferred provider
  apiKey: import.meta.env.VITE_AI_API_KEY || '', // Set your API key in .env
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4', // or 'gpt-3.5-turbo', 'claude-3-sonnet', etc.
  baseUrl: import.meta.env.VITE_AI_BASE_URL // Optional custom endpoint
};

export class AIItineraryService {
  private static async callAI(prompt: string): Promise<string> {
    const { provider, apiKey, model, baseUrl } = AI_CONFIG;

    console.log('AI Configuration:', { 
      provider, 
      hasApiKey: !!apiKey, 
      model,
      hasBaseUrl: !!baseUrl 
    });

    if (!apiKey) {
      console.warn('No AI API key found in environment variables. Using mock data.');
      console.log('Available environment variables:', {
        VITE_AI_PROVIDER: import.meta.env.VITE_AI_PROVIDER,
        VITE_AI_MODEL: import.meta.env.VITE_AI_MODEL,
        VITE_AI_BASE_URL: import.meta.env.VITE_AI_BASE_URL,
        hasApiKey: !!import.meta.env.VITE_AI_API_KEY
      });
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
          name: "Visit Jemaa el-Fnaa Square",
          description: "Experience the heart of Marrakech with street performers, food stalls, and vibrant atmosphere",
          time: "09:00",
          duration: "2-3 hours",
          category: "sightseeing",
          cost: "Free",
          location: "Medina"
        },
        {
          name: "Explore Bahia Palace",
          description: "Marvel at stunning Moroccan architecture and intricate tile work",
          time: "10:30",
          duration: "1.5 hours",
          category: "cultural",
          cost: "$7",
          location: "Medina"
        },
        {
          name: "Traditional Moroccan Cooking Class",
          description: "Learn to prepare authentic tagines and couscous with local spices",
          time: "11:30",
          duration: "3 hours",
          category: "dining",
          cost: "$45-65",
          location: "Riad Cooking School"
        },
        {
          name: "Souk Shopping Adventure",
          description: "Navigate the bustling markets for spices, textiles, and handcrafted goods",
          time: "14:00",
          duration: "2 hours",
          category: "shopping",
          cost: "$20-100",
          location: "Souk Semmarine"
        },
        {
          name: "Majorelle Garden Visit",
          description: "Stroll through the famous blue garden and Berber Museum",
          time: "16:00",
          duration: "1.5 hours",
          category: "relaxation",
          cost: "$7",
          location: "Gueliz"
        },
        {
          name: "Sunset at Koutoubia Mosque",
          description: "Admire the iconic minaret and enjoy the evening call to prayer",
          time: "18:30",
          duration: "1 hour",
          category: "cultural",
          cost: "Free",
          location: "Medina"
        }
      ],
      accommodations: [
        {
          name: "Riad Yasmine",
          type: "riad",
          priceRange: "$80-120/night",
          rating: 4.5,
          description: "Traditional riad with rooftop terrace and authentic Moroccan decor"
        },
        {
          name: "La Mamounia",
          type: "hotel",
          priceRange: "$400-800/night",
          rating: 4.8,
          description: "Legendary luxury palace hotel with world-class spa and gardens"
        },
        {
          name: "Dar Anika",
          type: "guesthouse",
          priceRange: "$45-75/night",
          rating: 4.2,
          description: "Charming family-run guesthouse in the heart of the medina"
        }
      ],
      overview: "An immersive Marrakech experience combining imperial history, vibrant souks, traditional cuisine, and stunning Islamic architecture in Morocco's red city."
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