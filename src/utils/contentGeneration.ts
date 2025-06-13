
import { BrandBrief, GeneratedContent } from '@/pages/Index';
import { ClaudeService } from '@/services/claudeApi';

export const generateContent = async (brandBrief: BrandBrief, apiKey?: string): Promise<GeneratedContent> => {
  const claude = new ClaudeService(apiKey);

  try {
    console.log('Starting comprehensive content generation with Claude...');
    console.log('Brand Brief:', brandBrief);

    // Step 1: Generate the main blog content using Claude as a marketing manager
    console.log('Generating blog post...');
    const blogContent = await claude.generateBlogPost(brandBrief);
    
    // Step 2: Extract title from blog content
    const lines = blogContent.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^#\s*/, '') || generateFallbackTitle(brandBrief);
    
    // Remove title from body content
    const body = lines.slice(1).join('\n').trim();

    // Step 3: Generate SEO data based on the actual content
    console.log('Generating SEO data...');
    const seoData = await claude.generateSEOData(blogContent, brandBrief);

    // Step 4: Generate image prompts and convert to image URLs
    console.log('Generating image prompts...');
    const imagePrompts = await claude.generateImagePrompts(blogContent, brandBrief);
    const images = generateImageUrls(brandBrief, blogContent, imagePrompts);

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
    console.error('Error generating content with Claude:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    
    // Fallback to original mock generation if Claude fails
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

const generateImageUrls = (brief: BrandBrief, content: string, prompts?: string[]): string[] => {
  // Count image placeholders in content
  const imageMatches = content.match(/\[IMAGE_PLACEHOLDER_\d+\]/g);
  const imageCount = imageMatches ? imageMatches.length : 4;

  // Enhanced category-specific images using Unsplash
  const categoryImages = {
    'Wellness & Health': [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&q=80'
    ],
    'Furniture & Home': [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615874694520-474822394e73?w=800&h=400&fit=crop&q=80'
    ],
    'Technology': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&q=80'
    ],
    'Fashion & Beauty': [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop&q=80'
    ],
    'default': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&q=80'
    ]
  };

  const availableImages = categoryImages[brief.category as keyof typeof categoryImages] || categoryImages.default;
  
  // Return the requested number of images
  const result = [];
  for (let i = 0; i < Math.min(imageCount, 6); i++) {
    result.push(availableImages[i % availableImages.length]);
  }
  
  return result;
};

// Enhanced fallback mock content generation
const generateMockContent = (brief: BrandBrief): GeneratedContent => {
  const title = generateFallbackTitle(brief);
  const body = `# ${title}

[IMAGE_PLACEHOLDER_1]

## Introduction

Welcome to the comprehensive guide on ${brief.topic.toLowerCase()} brought to you by ${brief.brandName}. In today's competitive ${brief.category.toLowerCase()} landscape, understanding ${brief.topic.toLowerCase()} is crucial for success.

## Understanding ${brief.topic}

[IMAGE_PLACEHOLDER_2]

When it comes to ${brief.category.toLowerCase()}, ${brief.brandName} stands out as a leader in delivering solutions that truly resonate with ${brief.targetAudience || 'your target audience'}.

## Key Strategies and Best Practices

${brief.keywords ? `Our focus areas include: ${brief.keywords.split(',').map(k => k.trim()).join(', ')}.` : 'We focus on proven methodologies that deliver real results.'}

[IMAGE_PLACEHOLDER_3]

### Strategy 1: Foundation Building
Building a strong foundation is essential for long-term success in ${brief.category.toLowerCase()}.

### Strategy 2: Implementation Excellence
Proper implementation ensures maximum ROI and customer satisfaction.

## Advanced Techniques

[IMAGE_PLACEHOLDER_4]

Our advanced approach to ${brief.topic.toLowerCase()} incorporates the latest industry trends and customer insights.

## Conclusion

${brief.brandName} is committed to helping you succeed in ${brief.category.toLowerCase()}. ${brief.websiteUrl ? `Visit us at ${brief.websiteUrl} to learn more.` : 'Contact us today to get started on your journey.'}

Ready to take the next step? Let's work together to achieve your goals.`;

  return {
    title,
    body,
    metaDescription: `Discover expert ${brief.topic.toLowerCase()} insights from ${brief.brandName}. Get actionable strategies and tips for ${brief.category.toLowerCase()} success.`,
    extractedKeywords: [
      brief.brandName.toLowerCase(),
      brief.category.toLowerCase(),
      brief.topic.toLowerCase(),
      'strategy',
      'guide',
      'expert tips',
      'best practices'
    ],
    images: generateImageUrls(brief, body),
    tone: brief.tone
  };
};
