import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BrandBriefForm from '@/components/BrandBriefForm';
import ContentGenerator from '@/components/ContentGenerator';
import ContentResults from '@/components/ContentResults';
import { Sparkles, PenTool, Image, Globe } from 'lucide-react';

export interface BrandBrief {
  brandName: string;
  websiteUrl: string;
  category: string;
  topic: string;
  keywords: string;
  targetAudience: string;
  tone: string;
  referenceUrls: string;
  wordCount: number;
}

export interface GeneratedContent {
  title: string;
  body: string;
  metaDescription: string;
  extractedKeywords: string[];
  images: string[];
  tone: string;
}

const Index = () => {
  const [step, setStep] = useState<'brief' | 'generating' | 'results'>('brief');
  const [brandBrief, setBrandBrief] = useState<BrandBrief | null>(null);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleBriefSubmit = (brief: BrandBrief) => {
    console.log('Brand brief submitted:', brief);
    setBrandBrief(brief);
    setStep('generating');
  };

  const handleContentGenerated = (content: GeneratedContent) => {
    console.log('Content generated:', content);
    setGeneratedContent(content);
    setStep('results');
  };

  const handleBackToBrief = () => {
    setStep('brief');
    setGeneratedContent(null);
  };

  const handleRegenerateWithTone = (newTone: string) => {
    if (brandBrief) {
      const updatedBrief = { ...brandBrief, tone: newTone };
      setBrandBrief(updatedBrief);
      setStep('generating');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BrandAI Content Agent
              </h1>
              <p className="text-sm text-gray-600">AI-powered content generation for modern brands</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {step === 'brief' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Create Engaging Content with AI
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your brand vision into compelling blog posts, stunning images, and optimized content that resonates with your audience.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <PenTool className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Blog Generation</h3>
                  <p className="text-sm text-gray-600">AI-powered blog posts tailored to your brand voice and audience</p>
                </CardContent>
              </Card>
              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Image className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Image Creation</h3>
                  <p className="text-sm text-gray-600">Generate stunning visuals that complement your content</p>
                </CardContent>
              </Card>
              <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Localization</h3>
                  <p className="text-sm text-gray-600">Adapt content for different markets and languages</p>
                </CardContent>
              </Card>
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Tone Switching</h3>
                  <p className="text-sm text-gray-600">Adjust content tone to match your brand personality</p>
                </CardContent>
              </Card>
            </div>

            {/* Brand Brief Form */}
            <Card className="max-w-4xl mx-auto border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">Tell Us About Your Brand</CardTitle>
                <p className="text-purple-100">Fill out the form below to get personalized content recommendations</p>
              </CardHeader>
              <CardContent className="p-6">
                <BrandBriefForm onSubmit={handleBriefSubmit} />
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'generating' && brandBrief && (
          <ContentGenerator 
            brandBrief={brandBrief} 
            onContentGenerated={handleContentGenerated}
          />
        )}

        {step === 'results' && generatedContent && (
          <ContentResults 
            content={generatedContent}
            brandBrief={brandBrief!}
            onBackToBrief={handleBackToBrief}
            onRegenerateWithTone={handleRegenerateWithTone}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
