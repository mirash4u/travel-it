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
  provider: (import.meta.env.VITE_AI_PROVIDER as any) || 'openai',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4',
  baseUrl: import.meta.env.VITE_AI_BASE_URL
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
      console.warn('No API key found, using mock data for demonstration');
      return this.getMockResponse();
    }

    try {
      console.log('Making AI API call with provider:', provider);

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

  private static getMockResponse(): string {
    return JSON.stringify({
      activities: [
        {
          name: "Historic City Center Walking Tour",
          description: "Explore the charming old town with its medieval architecture, cobblestone streets, and historic landmarks. Visit the main square, cathedral, and local artisan shops.",
          time: "09:00",
          duration: "2-3 hours",
          category: "sightseeing",
          cost: "Free",
          location: "City Center",
          image: "https://images.pexels.com/photos/161901/paris-sunset-france-monument-161901.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          name: "Local Food Market Experience",
          description: "Immerse yourself in the local culinary scene at the bustling central market. Sample fresh produce, local delicacies, and traditional street food.",
          time: "11:30",
          duration: "1-2 hours",
          category: "dining",
          cost: "$15-30",
          location: "Central Market",
          image: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          name: "Cultural Museum Visit",
          description: "Discover the rich history and cultural heritage through fascinating exhibits, artifacts, and interactive displays showcasing local traditions.",
          time: "14:00",
          duration: "2 hours",
          category: "cultural",
          cost: "$12-20",
          location: "Museum District",
          image: "https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          name: "Scenic Viewpoint Sunset",
          description: "End your day at the most beautiful viewpoint in the city, offering panoramic views and perfect sunset photography opportunities.",
          time: "18:00",
          duration: "1-2 hours",
          category: "sightseeing",
          cost: "Free",
          location: "Scenic Overlook",
          image: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          name: "Traditional Dinner Experience",
          description: "Enjoy an authentic dining experience at a highly-rated local restaurant known for traditional cuisine and warm hospitality.",
          time: "19:30",
          duration: "2 hours",
          category: "dining",
          cost: "$25-45",
          location: "Restaurant District",
          image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          name: "Artisan Workshop Visit",
          description: "Visit local craftspeople and learn about traditional arts and crafts. Watch demonstrations and perhaps try your hand at creating something unique.",
          time: "10:00",
          duration: "1.5 hours",
          category: "cultural",
          cost: "$10-25",
          location: "Artisan Quarter",
          image: "https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      accommodations: [
        {
          name: "Grand Heritage Hotel",
          type: "hotel",
          priceRange: "$120-180/night",
          rating: 4.5,
          description: "Elegant hotel in a restored historic building with modern amenities, central location, and excellent service."
        },
        {
          name: "Boutique City Inn",
          type: "hotel",
          priceRange: "$80-120/night",
          rating: 4.2,
          description: "Charming boutique hotel with unique decor, personalized service, and great location near major attractions."
        },
        {
          name: "Cozy Local Guesthouse",
          type: "guesthouse",
          priceRange: "$45-75/night",
          rating: 4.0,
          description: "Family-run guesthouse offering authentic local experience, home-cooked breakfast, and insider tips from friendly hosts."
        },
        {
          name: "Modern Hostel Central",
          type: "hostel",
          priceRange: "$25-40/night",
          rating: 4.1,
          description: "Clean, modern hostel with social atmosphere, shared kitchen, and excellent location for budget-conscious travelers."
        }
      ],
      overview: "This carefully crafted itinerary combines cultural exploration, culinary adventures, and scenic beauty to provide an authentic and memorable travel experience that showcases the best of your destination."
    });
  }

  private static async callOpenAI(prompt: string, apiKey: string, model: string, baseUrl?: string): Promise<string> {
    const url = baseUrl || 'https://api.openai.com/v1/chat/completions';
    
    console.log('Calling OpenAI API:', { url, model });
    
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
            content: `You are a travel expert AI that creates detailed itineraries. You must return ONLY valid JSON in the exact format requested. Do not include any explanatory text before or after the JSON.

Make sure all image URLs are valid Pexels URLs that show relevant attractions, landmarks, or activities for the destination.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error Response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response received');
    return data.choices[0].message.content;
  }

  private static async callAnthropic(prompt: string, apiKey: string, model: string): Promise<string> {
    console.log('Calling Anthropic API:', { model });
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: `You are a travel expert AI that creates detailed itineraries. You must return ONLY valid JSON in the exact format requested. Do not include any explanatory text before or after the JSON.

The JSON must include real, high-quality Pexels image URLs for each activity. Use this format for images:
https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg?auto=compress&cs=tinysrgb&w=400

Make sure all image URLs are valid Pexels URLs that show relevant attractions, landmarks, or activities for the destination.

${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error Response:', errorText);
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Anthropic API Response received');
    return data.content[0].text;
  }

  private static async callGoogle(prompt: string, apiKey: string, model: string): Promise<string> {
    console.log('Calling Google AI API:', { model });
    
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
                text: `You are a travel expert AI that creates detailed itineraries. You must return ONLY valid JSON in the exact format requested. Do not include any explanatory text before or after the JSON.

The JSON must include real, high-quality Pexels image URLs for each activity. Use this format for images:
https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg?auto=compress&cs=tinysrgb&w=400

Make sure all image URLs are valid Pexels URLs that show relevant attractions, landmarks, or activities for the destination.

${prompt}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI API Error Response:', errorText);
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Google AI API Response received');
    return data.candidates[0].content.parts[0].text;
  }

  private static async callCustomAPI(prompt: string, apiKey: string, model: string, baseUrl?: string): Promise<string> {
    if (!baseUrl) {
      throw new Error('Custom API requires baseUrl to be configured');
    }

    console.log('Calling Custom API:', { baseUrl, model });

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt: `You are a travel expert AI that creates detailed itineraries. You must return ONLY valid JSON in the exact format requested. Do not include any explanatory text before or after the JSON.

The JSON must include real, high-quality Pexels image URLs for each activity. Use this format for images:
https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg?auto=compress&cs=tinysrgb&w=400

Make sure all image URLs are valid Pexels URLs that show relevant attractions, landmarks, or activities for the destination.

${prompt}`,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Custom API Error Response:', errorText);
      throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Custom API Response received');
    return data.response || data.text || data.content;
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

Return ONLY a JSON object with this exact structure (no additional text):
{
  "activities": [
    {
      "name": "Activity name",
      "description": "Detailed description of the activity",
      "time": "HH:MM format (e.g., 09:00)",
      "duration": "X hours or X-Y hours",
      "category": "sightseeing|dining|entertainment|shopping|outdoor|cultural|relaxation",
      "cost": "Price range (e.g., $10-20) or 'Free'",
      "location": "Specific location or area",
      "image": "Use real Pexels URLs that show relevant content for the activity type and destination. For ${request.destination}, find images that actually represent the specific activity, landmark, or attraction mentioned. Examples: museums should show museum interiors/artifacts, restaurants should show food/dining, temples should show temple architecture, markets should show market scenes. Format: https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ],
  "accommodations": [
    {
      "name": "Hotel/accommodation name",
      "type": "hotel|hostel|airbnb|resort|guesthouse|riad",
      "priceRange": "Price per night (e.g., $80-120/night)",
      "rating": 4.5,
      "description": "Brief description of the accommodation"
    }
  ],
  "overview": "A comprehensive 2-3 sentence overview of the itinerary highlighting the main experiences"
}

Requirements:
- Create ${Math.max(6, days * 2)} diverse activities spread across different times of day
- Include 3-4 accommodation options at different price points
- Ensure activities are logically sequenced by time
- Include a mix of categories: sightseeing, dining, cultural, shopping, etc.
- Provide realistic costs and durations
- CRITICAL: Each activity image must be directly relevant to the activity type and show what tourists would actually see/do. For example:
  * Museum visits: Show museum interiors, artifacts, or art galleries
  * Food experiences: Show local cuisine, restaurants, or food markets
  * Temple/religious sites: Show actual temple architecture or religious ceremonies
  * Scenic viewpoints: Show actual landscapes, city views, or natural attractions
  * Cultural activities: Show cultural performances, traditional crafts, or local customs
  * Shopping: Show markets, bazaars, or shopping districts
- Avoid generic stock photos that don't match the specific activity described`;
  }

  static async generateItinerary(request: AIItineraryRequest): Promise<AIItineraryResponse> {
    console.log('Generating itinerary for request:', request);
    
    try {
      const prompt = this.createPrompt(request);
      console.log('Generated prompt for AI');
      
      const aiResponse = await this.callAI(prompt);
      console.log('Received AI response, processing...');
      
      // Clean the response to ensure it's valid JSON
      let cleanedResponse = aiResponse.trim();
      
      // Remove any markdown code blocks
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Parse the AI response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Cleaned response:', cleanedResponse);
        throw new Error('AI returned invalid JSON format. Please try again.');
      }
      
      // Validate the response structure
      if (!parsedResponse.activities || !Array.isArray(parsedResponse.activities)) {
        throw new Error('AI response missing activities array');
      }
      
      if (!parsedResponse.accommodations || !Array.isArray(parsedResponse.accommodations)) {
        throw new Error('AI response missing accommodations array');
      }
      
      if (!parsedResponse.overview) {
        throw new Error('AI response missing overview');
      }
      
      // Add aiGenerated flag to all items
      const activities = parsedResponse.activities.map((activity: any) => ({
        ...activity,
        aiGenerated: true
      }));
      
      const accommodations = parsedResponse.accommodations.map((accommodation: any) => ({
        ...accommodation,
        aiGenerated: true
      }));

      const result = {
        activities,
        accommodations,
        overview: parsedResponse.overview
      };
      
      console.log('Successfully processed AI response');
      return result;
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }
}