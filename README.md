# Travel Planner - AI-Powered Itinerary Generator

A beautiful, production-ready travel planning application that uses AI to generate personalized itineraries for any destination worldwide.

## 🌟 Features

- **AI-Powered Itinerary Generation**: Create detailed travel plans using OpenAI, Anthropic, Google AI, or custom AI models
- **Global Destination Search**: Search and plan trips to any destination worldwide
- **Smart Trip Management**: Organize multiple trips with progress tracking
- **Interactive Planning**: Add, edit, and check off activities as you travel
- **Responsive Design**: Beautiful UI that works on all devices
- **Popular Destinations**: Curated suggestions with stunning visuals

## 🤖 AI Integration

This app supports multiple AI providers:

### Supported AI Models:
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude-3-sonnet, Claude-3-haiku
- **Google AI**: Gemini-pro
- **Custom APIs**: Any OpenAI-compatible endpoint

## 🚀 Setup Instructions

### 1. Clone and Install
```bash
git clone <your-repo>
cd travel-planner
npm install
```

### 2. Configure AI Provider

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your AI configuration:

#### For OpenAI:
```env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-your-openai-api-key
VITE_AI_MODEL=gpt-4
```

#### For Anthropic:
```env
VITE_AI_PROVIDER=anthropic
VITE_AI_API_KEY=your-anthropic-api-key
VITE_AI_MODEL=claude-3-sonnet-20240229
```

#### For Google AI:
```env
VITE_AI_PROVIDER=google
VITE_AI_API_KEY=your-google-ai-api-key
VITE_AI_MODEL=gemini-pro
```

#### For Custom API:
```env
VITE_AI_PROVIDER=custom
VITE_AI_API_KEY=your-api-key
VITE_AI_MODEL=your-model-name
VITE_AI_BASE_URL=https://your-api.com/v1/chat/completions
```

### 3. Get API Keys

#### OpenAI:
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create an account and generate an API key
3. Add billing information (required for API usage)

#### Anthropic:
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account and generate an API key
3. Add credits to your account

#### Google AI:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a project and generate an API key

### 4. Run the Application
```bash
npm run dev
```

## 🔧 Configuration Options

### AI Provider Settings

You can modify the AI configuration in `src/services/aiService.ts`:

```typescript
const AI_CONFIG: AIConfig = {
  provider: 'openai', // Change to your preferred provider
  apiKey: import.meta.env.VITE_AI_API_KEY,
  model: 'gpt-4', // Adjust model as needed
  baseUrl: import.meta.env.VITE_AI_BASE_URL // For custom endpoints
};
```

### Fallback Behavior

If no API key is provided or the AI service fails, the app automatically falls back to mock data, ensuring the application always works for demonstration purposes.

## 📱 How to Use

1. **Search Destinations**: Type any destination worldwide in the search bar
2. **Set Preferences**: Choose your travel dates, budget, interests, and group size
3. **Generate Itinerary**: Let AI create a personalized itinerary
4. **Create Trip**: Save the itinerary as a trip for future reference
5. **Manage Activities**: Check off activities as you complete them during your trip

## 🎨 Features

- **Beautiful UI**: Modern, responsive design with smooth animations
- **Progress Tracking**: Visual progress indicators for trip completion
- **Smart Categories**: Activities organized by type (sightseeing, dining, etc.)
- **Accommodation Suggestions**: AI-recommended places to stay
- **Notes System**: Add personal notes and reminders
- **Trip Statistics**: Insights and analytics for your travel planning

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI Integration**: Multiple provider support

## 🔒 Security Notes

- API keys are stored in environment variables
- All AI calls include error handling and fallbacks
- No sensitive data is logged or exposed

## 📄 License

This project is open source and available under the MIT License.

---

**Ready to start planning your next adventure? Configure your AI provider and start exploring the world! 🌍✈️**