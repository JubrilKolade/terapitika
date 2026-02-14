import Anthropic from '@anthropic-ai/sdk';
import config from '../config/environment';
import logger from '../utils/logger';
import { cacheHelpers } from '../config/redis';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  conversationHistory?: ChatMessage[];
}

interface ChatResponse {
  message: string;
  conversationId?: string;
  tokens?: {
    input: number;
    output: number;
  };
}

let client: Anthropic | null = null;
const model = 'claude-sonnet-4-20250514';
const defaultSystemPrompt = `You are a compassionate and professional AI therapy assistant for Terapitika, a mental health platform. Your role is to:

1. Provide empathetic, supportive responses to users discussing mental health concerns
2. Use evidence-based therapeutic techniques (CBT, mindfulness, active listening)
3. Encourage users but NEVER provide medical diagnoses or prescribe medication
4. Detect crisis situations and recommend appropriate professional help
5. Maintain professional boundaries while being warm and understanding
6. Suggest seeking licensed therapist help when conversations go beyond your scope

IMPORTANT SAFETY GUIDELINES:
- If you detect suicidal thoughts, self-harm intentions, or immediate danger, strongly encourage contacting 988 Suicide & Crisis Lifeline or emergency services
- For serious mental health concerns, recommend booking a session with a licensed therapist on the platform
- You are NOT a replacement for professional therapy
- Be honest about your limitations as an AI

Your tone should be:
- Empathetic and non-judgmental
- Professional but warm
- Encouraging and hopeful
- Clear and accessible`;

const getClient = () => {
  if (!client) {
    if (!config.ai.anthropic.apiKey) {
      throw new Error('Anthropic API key not configured');
    }
    client = new Anthropic({ apiKey: config.ai.anthropic.apiKey });
  }
  return client;
};

/**
 * Chat with Claude AI
 */
export const chat = async (
  userMessage: string,
  options: ChatOptions = {}
): Promise<ChatResponse> => {
  try {
    const {
      systemPrompt = defaultSystemPrompt,
      temperature = 0.7,
      maxTokens = 1024,
      conversationHistory = [],
    } = options;

    const messages: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    logger.info('Sending chat request to Claude API', {
      messageCount: messages.length,
      model,
    });

    const response = await getClient().messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const assistantMessage = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('\n');

    logger.info('Received response from Claude API', {
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });

    return {
      message: assistantMessage,
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    };
  } catch (error: any) {
    logger.error('Claude API error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
};

/**
 * Stream chat response
 */
export async function* streamChat(
  userMessage: string,
  options: ChatOptions = {}
): AsyncGenerator<string> {
  try {
    const {
      systemPrompt = defaultSystemPrompt,
      temperature = 0.7,
      maxTokens = 1024,
      conversationHistory = [],
    } = options;

    const messages: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const stream = await getClient().messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  } catch (error: any) {
    logger.error('Claude streaming error:', error);
    throw new Error(`AI streaming error: ${error.message}`);
  }
}

/**
 * Analyze sentiment of text
 */
export const analyzeSentiment = async (text: string): Promise<{
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}> => {
  try {
    const prompt = `Analyze the emotional sentiment of the following text and respond ONLY with a JSON object in this exact format:
{
  "score": <number between -1 and 1, where -1 is very negative, 0 is neutral, 1 is very positive>,
  "label": "<positive, negative, or neutral>",
  "confidence": <number between 0 and 1 indicating confidence>
}

Text to analyze:
"${text}"

Respond with ONLY the JSON object, no other text.`;

    const response = await getClient().messages.create({
      model,
      max_tokens: 200,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid sentiment analysis response');

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error: any) {
    logger.error('Sentiment analysis error:', error);
    return { score: 0, label: 'neutral', confidence: 0.5 };
  }
};

/**
 * Generate conversation summary
 */
export const generateSummary = async (
  messages: ChatMessage[],
  focusAreas?: string[]
): Promise<string> => {
  try {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'Client' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    let prompt = `Please provide a concise, professional summary of the following therapy conversation. Focus on:
- Main topics discussed
- Client's primary concerns
- Key insights or progress
- Suggested follow-up areas

${focusAreas ? `Pay special attention to: ${focusAreas.join(', ')}` : ''}

Conversation:
${conversationText}

Summary:`;

    const response = await getClient().messages.create({
      model,
      max_tokens: 500,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('\n');

    return summary;
  } catch (error: any) {
    logger.error('Summary generation error:', error);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
};

/**
 * Generate therapeutic insights
 */
export const generateInsights = async (sessionData: {
  messages: ChatMessage[];
  duration?: number;
  clientConcerns?: string[];
}): Promise<{
  insights: string[];
  recommendations: string[];
  progressNotes: string;
}> => {
  try {
    const conversationText = sessionData.messages
      .map(msg => `${msg.role === 'user' ? 'Client' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `As a clinical supervisor, analyze this therapy conversation and provide insights in JSON format:

{
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "progressNotes": "Professional progress note suitable for clinical records"
}

Conversation:
${conversationText}

${sessionData.clientConcerns ? `Client's stated concerns: ${sessionData.clientConcerns.join(', ')}` : ''}

Respond with ONLY the JSON object.`;

    const response = await getClient().messages.create({
      model,
      max_tokens: 800,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid insights response');

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    logger.error('Insights generation error:', error);
    return {
      insights: [],
      recommendations: [],
      progressNotes: 'Unable to generate insights at this time.',
    };
  }
};

/**
 * Cache conversation
 */
export const cacheConversation = async (
  userId: string,
  sessionId: string,
  messages: ChatMessage[]
): Promise<void> => {
  const cacheKey = `conversation:${userId}:${sessionId}`;
  await cacheHelpers.cache(cacheKey, messages, 3600);
};

/**
 * Get cached conversation
 */
export const getCachedConversation = async (
  userId: string,
  sessionId: string
): Promise<ChatMessage[] | null> => {
  const cacheKey = `conversation:${userId}:${sessionId}`;
  return await cacheHelpers.getCached<ChatMessage[]>(cacheKey);
};

/**
 * Suggest coping strategies
 */
export const suggestCopingStrategies = async (
  concern: string,
  context?: string
): Promise<string[]> => {
  try {
    const prompt = `As a mental health professional, suggest 5 evidence-based coping strategies for someone dealing with: ${concern}

${context ? `Additional context: ${context}` : ''}

Respond with ONLY a JSON array of strings, each being a practical coping strategy:
["strategy 1", "strategy 2", ...]`;

    const response = await getClient().messages.create({
      model,
      max_tokens: 400,
      temperature: 0.6,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('');

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid strategies response');

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    logger.error('Coping strategies error:', error);
    return [
      'Practice deep breathing exercises',
      'Try progressive muscle relaxation',
      'Engage in physical activity',
      'Connect with supportive friends or family',
      'Consider speaking with a licensed therapist',
    ];
  }
};