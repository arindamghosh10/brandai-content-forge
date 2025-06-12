
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrandBrief, GeneratedContent } from '@/pages/Index';
import { generateContent } from '@/utils/contentGeneration';
import { Sparkles, PenTool, Image, Hash, Globe, Key } from 'lucide-react';

interface ContentGeneratorProps {
  brandBrief: BrandBrief;
  onContentGenerated: (content: GeneratedContent) => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ brandBrief, onContentGenerated }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Analyzing your brand...');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const steps = [
    { label: 'Analyzing your brand...', icon: Sparkles, duration: 1500 },
    { label: 'Generating blog content...', icon: PenTool, duration: 3000 },
    { label: 'Creating images...', icon: Image, duration: 2000 },
    { label: 'Extracting keywords...', icon: Hash, duration: 1500 },
    { label: 'Optimizing for SEO...', icon: Globe, duration: 1000 }
  ];

  useEffect(() => {
    if (!showApiKeyInput) {
      const generateContentAsync = async () => {
        let currentProgress = 0;
        const progressIncrement = 100 / steps.length;

        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(steps[i].label);
          
          // Animate progress for this step
          const stepStart = currentProgress;
          const stepEnd = currentProgress + progressIncrement;
          const animationDuration = steps[i].duration;
          const animationSteps = 20;
          const progressStep = (stepEnd - stepStart) / animationSteps;
          
          for (let j = 0; j <= animationSteps; j++) {
            setProgress(stepStart + (progressStep * j));
            await new Promise(resolve => setTimeout(resolve, animationDuration / animationSteps));
          }
          
          currentProgress = stepEnd;
        }

        // Generate the actual content
        const content = await generateContent(brandBrief, apiKey);
        onContentGenerated(content);
      };

      generateContentAsync();
    }
  }, [brandBrief, onContentGenerated, apiKey, showApiKeyInput]);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
    }
  };

  const currentStepIndex = steps.findIndex(step => step.label === currentStep);
  const CurrentIcon = currentStepIndex >= 0 ? steps[currentStepIndex].icon : Sparkles;

  if (showApiKeyInput) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-lg mx-auto border-purple-100">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Key className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                DeepSeek API Configuration
              </h2>
              <p className="text-gray-600">
                Enter your DeepSeek API key to generate high-quality content
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-left">
                <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
                  DeepSeek API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="border-gray-200 focus:border-purple-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleApiKeySubmit()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">DeepSeek Platform</a>
                </p>
              </div>

              <button
                onClick={handleApiKeySubmit}
                disabled={!apiKey.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-md transition-all"
              >
                Start Content Generation
              </button>

              <button
                onClick={() => setShowApiKeyInput(false)}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
              >
                Skip and use mock content
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto border-purple-100">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <CurrentIcon className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Creating Your Content
            </h2>
            <p className="text-gray-600">
              We're generating personalized <strong>{brandBrief.topic}</strong> content for <strong>{brandBrief.brandName}</strong>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{currentStep}</span>
              <span className="text-purple-600 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-5 gap-2 mt-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;
              
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isCurrent 
                        ? 'bg-purple-50 border-purple-200' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <StepIcon className={`w-5 h-5 mx-auto ${
                    isCompleted 
                      ? 'text-green-600' 
                      : isCurrent 
                        ? 'text-purple-600' 
                        : 'text-gray-400'
                  }`} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentGenerator;
