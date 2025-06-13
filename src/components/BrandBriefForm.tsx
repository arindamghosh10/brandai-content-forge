import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BrandBrief } from '@/pages/Index';
import { Send, Key, FileText } from 'lucide-react';

interface BrandBriefFormProps {
  onSubmit: (brief: BrandBrief & { apiKey: string }) => void;
}

const BrandBriefForm: React.FC<BrandBriefFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BrandBrief>({
    brandName: '',
    websiteUrl: '',
    category: '',
    topic: '',
    keywords: '',
    targetAudience: '',
    tone: '',
    referenceUrls: '',
    wordCount: 800
  });
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.brandName && formData.category && formData.topic && formData.tone && apiKey) {
      onSubmit({ ...formData, apiKey });
    }
  };

  const handleInputChange = (field: keyof BrandBrief, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWordCountChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, wordCount: value[0] }));
  };

  const categories = [
    'Wellness & Health',
    'Furniture & Home',
    'Dating & Relationships',
    'Technology',
    'Fashion & Beauty',
    'Food & Beverage',
    'Finance',
    'Education',
    'Travel & Hospitality',
    'Automotive',
    'Other'
  ];

  const tones = [
    'Professional',
    'Casual',
    'Empathetic',
    'Authoritative',
    'Friendly',
    'Inspirational',
    'Conversational',
    'Educational'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Claude API Key */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Key className="w-4 h-4 text-blue-600" />
          <Label htmlFor="apiKey" className="text-sm font-medium text-blue-800">
            Claude API Key *
          </Label>
        </div>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Claude API key..."
          className="border-blue-300 focus:border-blue-500"
          required
        />
        <p className="text-xs text-blue-700 mt-1">
          Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline">Anthropic Console</a>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brandName" className="text-sm font-medium text-gray-700">
            Brand Name *
          </Label>
          <Input
            id="brandName"
            value={formData.brandName}
            onChange={(e) => handleInputChange('brandName', e.target.value)}
            placeholder="Enter your brand name"
            className="border-gray-200 focus:border-purple-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
            Website URL
          </Label>
          <Input
            id="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
            placeholder="https://yourbrand.com"
            className="border-gray-200 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
          Industry Category *
        </Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger className="border-gray-200 focus:border-purple-500">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
          Content Topic *
        </Label>
        <Input
          id="topic"
          value={formData.topic}
          onChange={(e) => handleInputChange('topic', e.target.value)}
          placeholder="e.g., Benefits of sustainable furniture for modern homes"
          className="border-gray-200 focus:border-purple-500"
          required
        />
        <p className="text-xs text-gray-500">
          Describe the specific topic you want the blog post to cover
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tone" className="text-sm font-medium text-gray-700">
            Content Tone *
          </Label>
          <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
            <SelectTrigger className="border-gray-200 focus:border-purple-500">
              <SelectValue placeholder="Select content tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <Label className="text-sm font-medium text-gray-700">
              Blog Post Length: {formData.wordCount} words
            </Label>
          </div>
          <Slider
            value={[formData.wordCount]}
            onValueChange={handleWordCountChange}
            max={2000}
            min={300}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>300 words</span>
            <span>2000 words</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
          Target Keywords
        </Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) => handleInputChange('keywords', e.target.value)}
          placeholder="e.g., sustainable furniture, eco-friendly, home decor"
          className="border-gray-200 focus:border-purple-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="text-sm font-medium text-gray-700">
          Target Audience
        </Label>
        <Textarea
          id="targetAudience"
          value={formData.targetAudience}
          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
          placeholder="Describe your ideal customers (age, interests, needs, etc.)"
          className="border-gray-200 focus:border-purple-500 min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="referenceUrls" className="text-sm font-medium text-gray-700">
          Reference URLs
        </Label>
        <Textarea
          id="referenceUrls"
          value={formData.referenceUrls}
          onChange={(e) => handleInputChange('referenceUrls', e.target.value)}
          placeholder="URLs of content you like or want to reference (one per line)"
          className="border-gray-200 focus:border-purple-500 min-h-[80px]"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3"
        disabled={!formData.brandName || !formData.category || !formData.topic || !formData.tone || !apiKey}
      >
        <Send className="w-4 h-4 mr-2" />
        Generate AI Content
      </Button>
    </form>
  );
};

export default BrandBriefForm;
