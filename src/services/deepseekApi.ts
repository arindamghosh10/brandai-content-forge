
// DeepSeek API Configuration
export const DEEPSEEK_API_CONFIG = {
  endpoint: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  // Note: In production, this should be stored in Supabase Edge Function Secrets
  // For now, we'll use a placeholder that users can input
  apiKey: process.env.DEEPSEEK_API_KEY || ''
};

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class DeepSeekService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || DEEPSEEK_API_CONFIG.apiKey;
  }

  async generateContent(messages: DeepSeekMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key is required. Please add it to your environment variables or Supabase secrets.');
    }

    try {
      console.log('Making request to DeepSeek API...');
      const response = await fetch(DEEPSEEK_API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: DEEPSEEK_API_CONFIG.model,
          messages,
          max_tokens: 4000,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: DeepSeekResponse = await response.json();
      console.log('DeepSeek API response received successfully');
      return data.choices[0]?.message?.content || 'No content generated';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async generateBlogPost(brandBrief: any): Promise<string> {
    const systemPrompt = `You are a world-class content writer and marketing manager with 15+ years of experience. You specialize in creating engaging, SEO-optimized blog posts that drive conversions and build brand authority. Your writing is compelling, informative, and perfectly tailored to the brand's voice and target audience.

Key principles:
- Write in a conversational yet professional tone
- Use storytelling to engage readers
- Include actionable insights and practical tips
- Optimize for SEO naturally without keyword stuffing
- Create content that builds trust and authority
- Structure content for easy scanning and reading
- Include strategic calls-to-action`;

    const userPrompt = `As an expert content writer and marketing manager, create a comprehensive blog post for ${brandBrief.brandName} with the following specifications:

BRAND INFORMATION:
- Brand: ${brandBrief.brandName}
- Industry: ${brandBrief.category}
- Website: ${brandBrief.websiteUrl || 'Not provided'}

CONTENT REQUIREMENTS:
- Topic: ${brandBrief.topic}
- Word Count: ${brandBrief.wordCount} words
- Tone: ${brandBrief.tone}
- Target Audience: ${brandBrief.targetAudience || 'General audience interested in ' + brandBrief.category}
- Target Keywords: ${brandBrief.keywords || 'Not specified'}
- Reference URLs: ${brandBrief.referenceUrls || 'None provided'}

DELIVERABLES:
1. Create an engaging, SEO-optimized title that includes the main keyword
2. Write a ${brandBrief.wordCount}-word blog post with:
   - Compelling introduction that hooks the reader
   - 5-7 main sections with descriptive H2 subheadings
   - Practical tips, insights, and actionable advice
   - Strategic use of target keywords (natural integration)
   - Include [IMAGE_PLACEHOLDER_X] markers where relevant images should be placed (minimum 4 images)
   - Strong conclusion with clear call-to-action
3. Match the ${brandBrief.tone} tone throughout
4. Make it highly relevant to ${brandBrief.targetAudience}
5. Position ${brandBrief.brandName} as a trusted authority in ${brandBrief.category}

CONTENT STRUCTURE:
- Title (H1)
- Introduction (engaging hook + preview of value)
- Main sections (H2 headings with valuable content)
- Conclusion (summary + strong CTA)

Write as if you're crafting content for a premium brand that wants to establish thought leadership and drive meaningful engagement. Focus on providing genuine value while subtly promoting the brand's expertise.

Format the response as a complete, publication-ready blog post.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return await this.generateContent(messages);
  }

  async generateSEOData(blogContent: string, brandBrief: any): Promise<{ metaDescription: string; keywords: string[] }> {
    const systemPrompt = `You are an SEO expert and digital marketing specialist. Generate powerful SEO metadata that will help content rank higher and attract more clicks. Focus on creating compelling meta descriptions that encourage clicks and extract the most relevant, high-value keywords.`;

    const userPrompt = `Based on this blog content for ${brandBrief.brandName} in the ${brandBrief.category} industry, generate optimal SEO metadata:

BLOG CONTENT PREVIEW:
${blogContent.substring(0, 800)}...

BRAND CONTEXT:
- Brand: ${brandBrief.brandName}
- Industry: ${brandBrief.category}
- Target Keywords: ${brandBrief.keywords}
- Target Audience: ${brandBrief.targetAudience}

GENERATE:
1. A compelling meta description (150-160 characters) that:
   - Includes the primary keyword naturally
   - Creates urgency or curiosity
   - Mentions the brand benefit
   - Encourages clicks

2. 10-12 high-value SEO keywords including:
   - Primary keywords (from brand brief)
   - Long-tail keywords
   - Industry-specific terms
   - Intent-based keywords
   - Local/geographic terms if relevant

Respond in JSON format:
{
  "metaDescription": "...",
  "keywords": ["keyword1", "keyword2", ...]
}`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateContent(messages);
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      // Fallback if JSON parsing fails
      return {
        metaDescription: `Discover expert ${brandBrief.topic.toLowerCase()} insights from ${brandBrief.brandName}. Get actionable tips and strategies to succeed in ${brandBrief.category.toLowerCase()}.`,
        keywords: [
          brandBrief.brandName.toLowerCase(),
          brandBrief.category.toLowerCase(),
          brandBrief.topic.toLowerCase(),
          'expert tips',
          'guide',
          'strategies',
          'best practices'
        ]
      };
    }
  }

  async localizeContent(content: string, variant: 'UK' | 'AU'): Promise<string> {
    const systemPrompt = `You are a professional localization expert specializing in ${variant} English. Convert content to authentic ${variant} English by adjusting:

- Spelling (e.g., color→colour, organize→organise)
- Terminology (e.g., elevator→lift, apartment→flat)
- Cultural references and examples
- Currency and measurement units
- Local business practices and regulations
- Idiomatic expressions and colloquialisms

Maintain the original tone, structure, and marketing message while making it feel natural to ${variant} readers.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Convert this content to authentic ${variant} English:\n\n${content}` }
    ];

    return await this.generateContent(messages);
  }

  async humanizeContent(content: string): Promise<string> {
    const systemPrompt = `You are an expert content editor who specializes in making AI-generated content sound more natural, emotional, and human. Your goal is to:

- Add personality and emotional depth
- Vary sentence structure and rhythm
- Include conversational elements and transitions
- Add subtle humor or relatable anecdotes where appropriate
- Use more dynamic and engaging language
- Include rhetorical questions and direct reader address
- Make the content feel like it was written by a passionate expert
- Maintain the core message and structure while adding human warmth

Transform robotic AI writing into engaging, authentic content that builds genuine connection with readers.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Make this content sound more natural, engaging, and human while maintaining its core message:\n\n${content}` }
    ];

    return await this.generateContent(messages);
  }

  async generateImagePrompts(blogContent: string, brandBrief: any): Promise<string[]> {
    const systemPrompt = `You are a creative director specializing in visual content strategy. Generate detailed, specific image prompts that will create compelling visuals for blog content.`;

    const userPrompt = `Based on this blog content about "${brandBrief.topic}" for ${brandBrief.brandName} in the ${brandBrief.category} industry, generate 4-5 specific image prompts:

BLOG CONTENT:
${blogContent.substring(0, 1000)}...

BRAND CONTEXT:
- Industry: ${brandBrief.category}
- Tone: ${brandBrief.tone}
- Target Audience: ${brandBrief.targetAudience}

Generate image prompts that are:
- Relevant to the content sections
- Professional and on-brand
- Visually appealing and modern
- Suitable for ${brandBrief.category} industry
- Matching the ${brandBrief.tone} tone

Return as a JSON array of strings:
["prompt1", "prompt2", "prompt3", "prompt4"]`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateContent(messages);
    try {
      return JSON.parse(response);
    } catch {
      // Fallback prompts
      return [
        `Professional ${brandBrief.category} setting, modern and clean`,
        `${brandBrief.topic} concept visualization, high quality`,
        `People using ${brandBrief.category} products, lifestyle photography`,
        `Abstract representation of ${brandBrief.topic}, minimalist design`
      ];
    }
  }
}
