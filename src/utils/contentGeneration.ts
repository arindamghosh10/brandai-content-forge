
import { BrandBrief, GeneratedContent } from '@/pages/Index';
import { DeepSeekService } from '@/services/deepseekApi';

export const generateContent = async (brandBrief: BrandBrief, apiKey?: string): Promise<GeneratedContent> => {
  const deepseek = new DeepSeekService(apiKey);

  try {
    console.log('Starting content generation with DeepSeek...');

    // Generate the main blog content
    const blogContent = await deepseek.generateBlogPost(brandBrief);
    
    // Extract title from blog content (assuming it starts with the title)
    const lines = blogContent.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^#\s*/, '') || generateFallbackTitle(brandBrief);
    
    // Remove title from body content
    const body = lines.slice(1).join('\n').trim();

    // Generate SEO data
    const seoData = await deepseek.generateSEOData(blogContent, brandBrief);

    // Generate images based on content
    const images = generateImageUrls(brandBrief, blogContent);

    console.log('Content generation completed successfully');

    return {
      title,
      body,
      metaDescription: seoData.metaDescription,
      extractedKeywords: seoData.keywords,
      images,
      tone: brandBrief.tone
    };
  } catch (error) {
    console.error('Error generating content with DeepSeek:', error);
    
    // Fallback to original mock generation if DeepSeek fails
    console.log('Falling back to mock content generation...');
    return generateMockContent(brandBrief);
  }
};

const generateFallbackTitle = (brief: BrandBrief): string => {
  const toneAdjectives = {
    'Professional': 'Expert Guide',
    'Casual': 'Ultimate Guide',
    'Empathetic': 'Caring Guide',
    'Authoritative': 'Complete Guide',
    'Friendly': 'Friendly Guide',
    'Inspirational': 'Transformative Guide',
    'Conversational': 'Simple Guide',
    'Educational': 'Learning Guide'
  };

  const adjective = toneAdjectives[brief.tone as keyof typeof toneAdjectives] || 'Complete Guide';
  return `The ${adjective} to ${brief.topic} in ${brief.category} with ${brief.brandName}`;
};

const generateImageUrls = (brief: BrandBrief, content: string): string[] => {
  // Count image placeholders in content
  const imageMatches = content.match(/\[IMAGE_PLACEHOLDER_\d+\]/g);
  const imageCount = imageMatches ? imageMatches.length : 3;

  // Using Unsplash for placeholder images - in production, you'd use actual AI image generation
  const categoryImages = {
    'Wellness & Health': [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop'
    ],
    'Furniture & Home': [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop'
    ],
    'Technology': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'
    ],
    'Fashion & Beauty': [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&h=400&fit=crop'
    ],
    'default': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=400&fit=crop'
    ]
  };

  const availableImages = categoryImages[brief.category as keyof typeof categoryImages] || categoryImages.default;
  
  // Return the requested number of images
  const result = [];
  for (let i = 0; i < Math.min(imageCount, 5); i++) {
    result.push(availableImages[i % availableImages.length]);
  }
  
  return result;
};

// Fallback mock content generation
const generateMockContent = (brief: BrandBrief): GeneratedContent => {
  const title = generateFallbackTitle(brief);
  const body = `This is a sample blog post about ${brief.topic.toLowerCase()} in the ${brief.category.toLowerCase()} industry for ${brief.brandName}.

[IMAGE_PLACEHOLDER_1]

## Understanding ${brief.topic}

When it comes to ${brief.category.toLowerCase()}, ${brief.brandName} stands out as a leader in delivering solutions that truly resonate with your target audience.

[IMAGE_PLACEHOLDER_2]

## Key Strategies and Best Practices

${brief.keywords ? `Key areas of focus include: ${brief.keywords.split(',').map(k => k.trim()).join(', ')}.` : ''}

Our approach centers on proven methodologies that deliver real results.

[IMAGE_PLACEHOLDER_3]

## Conclusion

${brief.brandName} is committed to helping you succeed in ${brief.category.toLowerCase()}. ${brief.websiteUrl ? `Visit us at ${brief.websiteUrl} to learn more.` : 'Contact us today to get started.'}`;

  return {
    title,
    body,
    metaDescription: `Discover ${brief.topic.toLowerCase()} insights from ${brief.brandName}. Expert strategies for ${brief.category.toLowerCase()} success.`,
    extractedKeywords: [brief.brandName.toLowerCase(), brief.category.toLowerCase(), brief.topic.toLowerCase(), 'strategy', 'guide'],
    images: generateImageUrls(brief, body),
    tone: brief.tone
  };
};
