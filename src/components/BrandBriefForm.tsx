
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrandBrief } from '@/pages/Index';
import { Send } from 'lucide-react';

interface BrandBriefFormProps {
  onSubmit: (brief: BrandBrief) => void;
}

const BrandBriefForm: React.FC<BrandBriefFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BrandBrief>({
    brandName: '',
    websiteUrl: '',
    category: '',
    keywords: '',
    targetAudience: '',
    tone: '',
    referenceUrls: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.brandName && formData.category && formData.tone) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof BrandBrief, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      <div className="grid md:grid-cols-2 gap-6">
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
        disabled={!formData.brandName || !formData.category || !formData.tone}
      >
        <Send className="w-4 h-4 mr-2" />
        Generate AI Content
      </Button>
    </form>
  );
};

export default BrandBriefForm;
