
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandBrief, GeneratedContent } from '@/pages/Index';
import { ArrowLeft, Copy, Download, RefreshCw, Globe, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClaudeService } from '@/services/claudeApi';

interface ContentResultsProps {
  content: GeneratedContent;
  brandBrief: BrandBrief;
  onBackToBrief: () => void;
  onRegenerateWithTone: (tone: string) => void;
}

const ContentResults: React.FC<ContentResultsProps> = ({ 
  content, 
  brandBrief, 
  onBackToBrief, 
  onRegenerateWithTone 
}) => {
  const [selectedTone, setSelectedTone] = useState(content.tone);
  const [isLocalizing, setIsLocalizing] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [localizedContent, setLocalizedContent] = useState<string>('');
  const [humanizedContent, setHumanizedContent] = useState<string>('');
  const { toast } = useToast();

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleDownload = () => {
    const contentText = `
Title: ${content.title}

Meta Description: ${content.metaDescription}

Keywords: ${content.extractedKeywords.join(', ')}

Blog Content:
${content.body}
    `.trim();

    const blob = new Blob([contentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandBrief.brandName}_blog_content.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Content saved to your downloads folder",
    });
  };

  const handleLocalization = async (variant: 'UK' | 'AU') => {
    setIsLocalizing(true);
    try {
      const claude = new ClaudeService();
      const localized = await claude.localizeContent(content.body, variant);
      setLocalizedContent(localized);
      toast({
        title: "Localization Complete",
        description: `Content converted to ${variant} English`,
      });
    } catch (error) {
      toast({
        title: "Localization Failed",
        description: "Backend API integration pending",
        variant: "destructive"
      });
    } finally {
      setIsLocalizing(false);
    }
  };

  const handleHumanization = async () => {
    setIsHumanizing(true);
    try {
      const claude = new ClaudeService();
      const humanized = await claude.humanizeContent(content.body);
      setHumanizedContent(humanized);
      toast({
        title: "Humanization Complete",
        description: "Content has been made more natural and engaging",
      });
    } catch (error) {
      toast({
        title: "Humanization Failed",
        description: "Backend API integration pending",
        variant: "destructive"
      });
    } finally {
      setIsHumanizing(false);
    }
  };

  // Function to render content with image placeholders replaced
  const renderContentWithImages = (text: string) => {
    const parts = text.split(/(\[IMAGE_PLACEHOLDER_\d+\])/g);
    let imageIndex = 0;
    
    return parts.map((part, index) => {
      if (part.match(/\[IMAGE_PLACEHOLDER_\d+\]/)) {
        const imageUrl = content.images[imageIndex];
        imageIndex++;
        
        if (imageUrl) {
          return (
            <div key={index} className="my-6">
              <img 
                src={imageUrl} 
                alt={`Content illustration ${imageIndex}`}
                className="w-full max-w-2xl mx-auto rounded-lg border border-gray-200"
              />
            </div>
          );
        }
        return null;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBackToBrief}
          className="text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Brief
        </Button>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {tones.map(tone => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
          
          <Button 
            onClick={() => onRegenerateWithTone(selectedTone)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={selectedTone === content.tone}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>

          <Button 
            onClick={handleDownload}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Content Display */}
      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blog">Blog Post</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="seo">SEO Data</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{content.title}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCopy(content.title, "Title")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="w-fit">
                Tone: {content.tone} | Topic: {brandBrief.topic}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {renderContentWithImages(content.body)}
                </div>
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => handleCopy(content.body, "Blog content")}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <img 
                      src={image} 
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCopy(image, `Image ${index + 1} URL`)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meta Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{content.metaDescription}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(content.metaDescription, "Meta description")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Extracted Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {content.extractedKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(content.extractedKeywords.join(', '), "Keywords")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Localization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Convert content to different English variants using Claude AI</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => handleLocalization('UK')}
                    disabled={isLocalizing}
                  >
                    {isLocalizing ? 'Converting...' : 'Convert to UK English'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleLocalization('AU')}
                    disabled={isLocalizing}
                  >
                    {isLocalizing ? 'Converting...' : 'Convert to Australian English'}
                  </Button>
                </div>
                {localizedContent && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 mb-2">Localized Content:</p>
                    <div className="text-xs text-green-700 max-h-32 overflow-y-auto">
                      {localizedContent.substring(0, 200)}...
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleCopy(localizedContent, "Localized content")}
                    >
                      Copy Localized Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Humanizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Make AI content sound more natural and emotional using Claude AI</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleHumanization}
                  disabled={isHumanizing}
                >
                  {isHumanizing ? 'Humanizing...' : 'Humanize Content'}
                </Button>
                {humanizedContent && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800 mb-2">Humanized Content:</p>
                    <div className="text-xs text-blue-700 max-h-32 overflow-y-auto">
                      {humanizedContent.substring(0, 200)}...
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleCopy(humanizedContent, "Humanized content")}
                    >
                      Copy Humanized Content
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentResults;
