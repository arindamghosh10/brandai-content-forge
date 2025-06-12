
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandBrief, GeneratedContent } from '@/pages/Index';
import { ArrowLeft, Copy, Download, RefreshCw, Globe, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
                Tone: {content.tone}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {content.body}
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
                <p className="text-gray-600 mb-4">Convert content to different English variants</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Convert to UK English
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Convert to Australian English
                  </Button>
                </div>
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
                <p className="text-gray-600 mb-4">Make AI content sound more natural and emotional</p>
                <Button variant="outline" className="w-full">
                  Humanize Content
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentResults;
