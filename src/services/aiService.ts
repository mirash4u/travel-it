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
      throw new Error('AI API key is required. Please set VITE_AI_API_KEY in your .env file.');
    }

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

The JSON must include real, high-quality Pexels image URLs for each activity. Use this format for images:
https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg?auto=compress&cs=tinysrgb&w=400

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
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', data);
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
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Anthropic API Response:', data);
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
      throw new Error(`Google AI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Google AI API Response:', data);
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
      throw new Error(`Custom API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Custom API Response:', data);
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
      "image": "https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg?auto=compress&cs=tinysrgb&w=400"
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
- Each activity must have a valid Pexels image URL showing the actual attraction/activity
- Focus on authentic local experiences that match the specified interests and budget
- Ensure activities are logically sequenced by time
- Include a mix of categories: sightseeing, dining, cultural, shopping, etc.
- Provide realistic costs and durations
- Use specific location names within the destination`;
  }

  static async generateItinerary(request: AIItineraryRequest): Promise<AIItineraryResponse> {
    console.log('Generating itinerary for request:', request);
    
    try {
      const prompt = this.createPrompt(request);
      console.log('Generated prompt:', prompt);
      
      const aiResponse = await this.callAI(prompt);
      console.log('Raw AI response:', aiResponse);
      
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
      
      console.log('Final processed result:', result);
      return result;
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      
      // Re-throw the error with more context
      if (error instanceof Error) {
        throw new Error(`Failed to generate itinerary: ${error.message}`);
      } else {
        throw new Error('Failed to generate itinerary: Unknown error occurred');
      }
    }
  }
}