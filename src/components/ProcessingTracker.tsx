import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Clock, Bed, CheckCircle2, Loader2 } from 'lucide-react';

interface ProcessingTrackerProps {
  isVisible: boolean;
  destination: string;
  onComplete?: () => void;
}

interface ProcessingStep {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  duration: number;
  status: 'pending' | 'processing' | 'completed';
}

export const ProcessingTracker: React.FC<ProcessingTrackerProps> = ({ 
  isVisible, 
  destination, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'analyzing',
      label: 'Analyzing destination preferences',
      icon: MapPin,
      duration: 2000,
      status: 'pending'
    },
    {
      id: 'activities',
      label: 'Finding amazing activities',
      icon: Clock,
      duration: 3000,
      status: 'pending'
    },
    {
      id: 'accommodations',
      label: 'Selecting perfect accommodations',
      icon: Bed,
      duration: 2500,
      status: 'pending'
    },
    {
      id: 'optimizing',
      label: 'Optimizing your itinerary',
      icon: Sparkles,
      duration: 2000,
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (!isVisible) {
      // Reset when not visible
      setCurrentStep(0);
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let currentStepIndex = 0;

    const processStep = () => {
      if (currentStepIndex >= steps.length) {
        // All steps completed
        setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
        return;
      }

      // Mark current step as processing
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === currentStepIndex ? 'processing' : 
                index < currentStepIndex ? 'completed' : 'pending'
      })));

      setCurrentStep(currentStepIndex);

      // Wait for step duration then mark as completed and move to next
      timeoutId = setTimeout(() => {
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= currentStepIndex ? 'completed' : 'pending'
        })));

        currentStepIndex++;
        
        // Small delay before starting next step
        setTimeout(processStep, 300);
      }, steps[currentStepIndex].duration);
    };

    // Start processing
    processStep();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-2">Creating Your Perfect Trip</h2>
          <p className="text-purple-100">Generating AI-powered itinerary for {destination}</p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="h-full bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="p-6 space-y-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = step.status === 'processing';
            const isCompleted = step.status === 'completed';
            
            return (
              <div 
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-purple-50 border-2 border-purple-200 scale-105' :
                  isCompleted ? 'bg-green-50 border-2 border-green-200' :
                  'bg-gray-50 border-2 border-gray-100'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isActive ? 'bg-purple-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium transition-colors duration-300 ${
                    isCompleted ? 'text-green-700' :
                    isActive ? 'text-purple-700' :
                    'text-gray-600'
                  }`}>
                    {step.label}
                  </p>
                  
                  {isActive && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-purple-600 font-medium">Processing...</span>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <p className="text-xs text-green-600 font-medium mt-1">✓ Completed</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>AI is crafting your personalized experience...</span>
          </div>
        </div>
      </div>
    </div>
  );
};