
import { BrandBrief, GeneratedContent } from '@/pages/Index';

// Mock content generation - in a real app, this would call actual AI APIs
export const generateContent = async (brandBrief: BrandBrief): Promise<GeneratedContent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate sample content based on brand brief
  const title = generateTitle(brandBrief);
  const body = generateBlogBody(brandBrief, title);
  const metaDescription = generateMetaDescription(brandBrief, title);
  const extractedKeywords = extractKeywords(brandBrief);
  const images = generateImageUrls(brandBrief);

  return {
    title,
    body,
    metaDescription,
    extractedKeywords,
    images,
    tone: brandBrief.tone
  };
};

const generateTitle = (brief: BrandBrief): string => {
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

  const categoryTitles = {
    'Wellness & Health': 'to Wellness and Healthy Living',
    'Furniture & Home': 'to Beautiful Home Design',
    'Dating & Relationships': 'to Building Meaningful Relationships',
    'Technology': 'to Modern Technology Solutions',
    'Fashion & Beauty': 'to Style and Beauty',
    'Food & Beverage': 'to Culinary Excellence',
    'Finance': 'to Financial Success',
    'Education': 'to Learning and Growth',
    'Travel & Hospitality': 'to Memorable Travel Experiences',
    'Automotive': 'to Automotive Excellence',
    'Other': 'to Success in Your Industry'
  };

  const adjective = toneAdjectives[brief.tone as keyof typeof toneAdjectives] || 'Complete Guide';
  const categoryTitle = categoryTitles[brief.category as keyof typeof categoryTitles] || 'to Success';

  return `The ${adjective} ${categoryTitle} with ${brief.brandName}`;
};

const generateBlogBody = (brief: BrandBrief, title: string): string => {
  const toneStyles = {
    'Professional': {
      intro: 'In today\'s competitive marketplace, businesses and consumers alike are seeking reliable solutions that deliver exceptional value.',
      transition: 'Industry experts recognize that',
      conclusion: 'To summarize, implementing these strategic approaches will'
    },
    'Casual': {
      intro: 'Hey there! Let\'s dive into something that\'s been on everyone\'s mind lately.',
      transition: 'Here\'s the thing -',
      conclusion: 'So there you have it!'
    },
    'Empathetic': {
      intro: 'We understand that navigating this space can feel overwhelming, and you\'re not alone in facing these challenges.',
      transition: 'We recognize that',
      conclusion: 'Remember, every journey begins with a single step, and'
    },
    'Authoritative': {
      intro: 'Based on extensive research and industry analysis, the following insights will transform your understanding of this domain.',
      transition: 'Data clearly demonstrates that',
      conclusion: 'The evidence conclusively shows that'
    },
    'Friendly': {
      intro: 'Welcome! We\'re excited to share some fantastic insights that we think you\'ll find really valuable.',
      transition: 'What we\'ve discovered is that',
      conclusion: 'We hope this has been helpful, and'
    },
    'Inspirational': {
      intro: 'Imagine a world where your goals aren\'t just dreams, but achievable realities waiting to be unlocked.',
      transition: 'The transformation happens when',
      conclusion: 'Your journey toward success starts now, and'
    },
    'Conversational': {
      intro: 'Let\'s have a chat about something that might just change how you think about this topic.',
      transition: 'You know what\'s interesting?',
      conclusion: 'What do you think? We\'d love to hear your thoughts, and'
    },
    'Educational': {
      intro: 'This comprehensive overview will provide you with the fundamental knowledge needed to excel in this area.',
      transition: 'It\'s important to understand that',
      conclusion: 'To reinforce these key concepts,'
    }
  };

  const style = toneStyles[brief.tone as keyof typeof toneStyles] || toneStyles['Professional'];

  return `${style.intro}

When it comes to ${brief.category.toLowerCase()}, ${brief.brandName} stands out as a leader in delivering solutions that truly resonate with ${brief.targetAudience || 'modern consumers'}. 

## Understanding Your Needs

${style.transition} the landscape has evolved significantly, and what worked yesterday may not be sufficient for tomorrow's challenges. ${brief.brandName} recognizes this evolution and has adapted its approach to meet the changing demands of the market.

${brief.keywords ? `Key areas of focus include: ${brief.keywords.split(',').map(k => k.trim()).join(', ')}.` : ''}

## The ${brief.brandName} Approach

Our methodology centers on three core principles:

1. **Innovation**: Staying ahead of industry trends and continuously improving our offerings
2. **Quality**: Ensuring every interaction and product meets the highest standards
3. **Customer-Centricity**: Putting your needs and goals at the heart of everything we do

## What Sets Us Apart

${style.transition} in today's market, consistency and reliability are paramount. ${brief.brandName} has built its reputation on delivering measurable results while maintaining the highest levels of service excellence.

Our team brings together diverse expertise and perspectives, enabling us to tackle complex challenges with creative solutions. Whether you're just starting your journey or looking to optimize existing processes, we have the tools and knowledge to support your success.

## Moving Forward

${style.conclusion} taking action today will position you for long-term success. ${brief.brandName} is here to support you every step of the way, providing the guidance, tools, and expertise you need to achieve your goals.

Ready to get started? ${brief.websiteUrl ? `Visit us at ${brief.websiteUrl} to learn more about how we can help you succeed.` : 'Contact us today to discover how we can help you succeed.'}`;
};

const generateMetaDescription = (brief: BrandBrief, title: string): string => {
  return `Discover how ${brief.brandName} transforms ${brief.category.toLowerCase()} with expert insights and proven strategies. ${brief.keywords ? `Learn about ${brief.keywords.split(',')[0]?.trim()}.` : ''} Start your journey today.`;
};

const extractKeywords = (brief: BrandBrief): string[] => {
  const baseKeywords = [brief.brandName.toLowerCase(), brief.category.toLowerCase()];
  
  if (brief.keywords) {
    baseKeywords.push(...brief.keywords.split(',').map(k => k.trim().toLowerCase()));
  }
  
  // Add some contextual keywords based on category
  const categoryKeywords = {
    'Wellness & Health': ['wellness', 'health', 'lifestyle', 'fitness'],
    'Furniture & Home': ['furniture', 'home decor', 'interior design', 'modern'],
    'Dating & Relationships': ['relationships', 'dating', 'love', 'connection'],
    'Technology': ['technology', 'innovation', 'digital', 'solutions'],
    'Fashion & Beauty': ['fashion', 'beauty', 'style', 'trends'],
    'Food & Beverage': ['food', 'culinary', 'dining', 'recipes'],
    'Finance': ['finance', 'investment', 'money', 'financial planning'],
    'Education': ['education', 'learning', 'training', 'development'],
    'Travel & Hospitality': ['travel', 'hospitality', 'vacation', 'destination'],
    'Automotive': ['automotive', 'cars', 'vehicles', 'transportation'],
    'Other': ['business', 'service', 'quality', 'professional']
  };

  const additionalKeywords = categoryKeywords[brief.category as keyof typeof categoryKeywords] || [];
  baseKeywords.push(...additionalKeywords);

  // Remove duplicates and return first 8 keywords
  return [...new Set(baseKeywords)].slice(0, 8);
};

const generateImageUrls = (brief: BrandBrief): string[] => {
  // Using Unsplash for placeholder images - in production, you'd use actual AI image generation
  const categoryImages = {
    'Wellness & Health': [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop'
    ],
    'Furniture & Home': [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=300&fit=crop'
    ],
    'Technology': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop'
    ],
    'Fashion & Beauty': [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=500&h=300&fit=crop'
    ],
    'default': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=500&h=300&fit=crop'
    ]
  };

  return categoryImages[brief.category as keyof typeof categoryImages] || categoryImages.default;
};
