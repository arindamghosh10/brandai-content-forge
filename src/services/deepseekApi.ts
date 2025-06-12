
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
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || 'No content generated';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async generateBlogPost(brandBrief: any): Promise<string> {
    const systemPrompt = `You are an expert content writer specializing in creating engaging, SEO-optimized blog posts. 
    Your writing is compelling, informative, and perfectly tailored to the brand's voice and target audience.`;

    const userPrompt = `Create a comprehensive blog post for ${brandBrief.brandName} with the following specifications:

Brand: ${brandBrief.brandName}
Industry: ${brandBrief.category}
Topic Type: ${brandBrief.topic}
Tone: ${brandBrief.tone}
Target Audience: ${brandBrief.targetAudience || 'General audience'}
Keywords: ${brandBrief.keywords || 'Not specified'}
Website: ${brandBrief.websiteUrl || 'Not provided'}

Requirements:
1. Create an engaging, SEO-optimized title
2. Write a 1000-1500 word blog post
3. Include 5-6 main sections with subheadings
4. Incorporate the specified keywords naturally
5. Add [IMAGE_PLACEHOLDER_X] markers where images should be placed (at least 3 images)
6. Include actionable tips and insights
7. End with a strong call-to-action
8. Match the specified tone throughout
9. Make it relevant to the target audience

Format the response as a complete blog post with clear structure and engaging content.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return await this.generateContent(messages);
  }

  async generateSEOData(blogContent: string, brandBrief: any): Promise<{ metaDescription: string; keywords: string[] }> {
    const systemPrompt = `You are an SEO expert. Generate SEO metadata based on the provided blog content.`;

    const userPrompt = `Based on this blog content for ${brandBrief.brandName}, generate:
1. A compelling meta description (150-160 characters)
2. 8-10 relevant SEO keywords

Blog content preview: ${blogContent.substring(0, 500)}...

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
      return JSON.parse(response);
    } catch {
      // Fallback if JSON parsing fails
      return {
        metaDescription: `Discover ${brandBrief.topic.toLowerCase()} insights from ${brandBrief.brandName}. Expert tips and strategies to help you succeed.`,
        keywords: [brandBrief.brandName.toLowerCase(), brandBrief.category.toLowerCase(), 'tips', 'guide']
      };
    }
  }

  async localizeContent(content: string, variant: 'UK' | 'AU'): Promise<string> {
    const systemPrompt = `You are a localization expert. Convert the provided content to ${variant} English, adjusting spelling, terminology, and cultural references appropriately.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Convert this content to ${variant} English:\n\n${content}` }
    ];

    return await this.generateContent(messages);
  }

  async humanizeContent(content: string): Promise<string> {
    const systemPrompt = `You are an expert editor who specializes in making AI-generated content sound more natural, emotional, and human. 
    Add personality, vary sentence structure, include conversational elements, and make the content more engaging while maintaining the core message.`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Make this content sound more natural and human:\n\n${content}` }
    ];

    return await this.generateContent(messages);
  }
}
