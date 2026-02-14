import * as AIService from './ai.service';
import logger from '../utils/logger';
import { CrisisType, CrisisSeverity } from '../types';

interface CrisisAnalysis {
  isCrisis: boolean;
  severity: CrisisSeverity;
  type?: CrisisType;
  confidence: number;
  keywords: string[];
  recommendedAction: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

const criticalKeywords = [
  'kill myself', 'end my life', 'suicide', 'want to die', 'better off dead',
  'no reason to live', 'end it all', 'take my life', 'overdose', 'hanging myself',
];

const selfHarmKeywords = [
  'cut myself', 'hurt myself', 'self-harm', 'cutting', 'burning myself',
  'harm myself', 'self injury',
];

const violenceKeywords = [
  'hurt someone', 'kill them', 'violent thoughts', 'hurt others', 'harm someone', 'violent urges',
];

const psychosisKeywords = [
  'voices telling me', 'hearing voices', 'people watching me', 'not real',
  'hallucinating', 'controlling my thoughts',
];

const analyzeKeywords = (text: string) => {
  let score = 0;
  let type: CrisisType | undefined;
  const foundKeywords: string[] = [];

  for (const keyword of criticalKeywords) {
    if (text.includes(keyword)) {
      score = Math.max(score, 100);
      type = CrisisType.SUICIDE;
      foundKeywords.push(keyword);
    }
  }

  if (score < 100) {
    for (const keyword of selfHarmKeywords) {
      if (text.includes(keyword)) {
        score = Math.max(score, 80);
        type = CrisisType.SELF_HARM;
        foundKeywords.push(keyword);
      }
    }
  }

  if (score < 80) {
    for (const keyword of violenceKeywords) {
      if (text.includes(keyword)) {
        score = Math.max(score, 75);
        type = CrisisType.VIOLENCE;
        foundKeywords.push(keyword);
      }
    }
  }

  if (score < 75) {
    for (const keyword of psychosisKeywords) {
      if (text.includes(keyword)) {
        score = Math.max(score, 70);
        type = CrisisType.PSYCHOSIS;
        foundKeywords.push(keyword);
      }
    }
  }

  return { score, type, keywords: foundKeywords };
};

const analyzeSentiment = async (text: string): Promise<number> => {
  try {
    const sentiment = await AIService.analyzeSentiment(text);
    if (sentiment.score < -0.7) return 60;
    if (sentiment.score < -0.4) return 40;
    if (sentiment.score < 0) return 20;
    return 0;
  } catch (error) {
    logger.error('Sentiment analysis failed:', error);
    return 0;
  }
};

const analyzeWithAI = async (message: string, conversationHistory?: string[]): Promise<{ score: number; reasoning: string }> => {
  try {
    const context = conversationHistory ? conversationHistory.slice(-5).join('\n') : '';
    const prompt = `As a crisis counselor, analyze this message for signs of mental health crisis.
${context ? `Recent conversation:\n${context}\n\n` : ''}
Current message: "${message}"
Respond with ONLY a JSON object:
{ "crisisScore": <0-100>, "reasoning": "brief explanation" }`;

    const response = await AIService.chat(prompt, { maxTokens: 200, temperature: 0.3 });
    const jsonMatch = response.message.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return { score: result.crisisScore || 0, reasoning: result.reasoning || '' };
    }
    return { score: 0, reasoning: '' };
  } catch (error) {
    logger.error('AI crisis analysis failed:', error);
    return { score: 0, reasoning: '' };
  }
};

const analyzePatterns = (text: string): number => {
  let score = 0;
  const absolutistWords = ['never', 'always', 'nothing', 'everything', 'no one', 'everyone'];
  score += absolutistWords.filter(word => text.includes(word)).length * 5;

  const hopelessnessWords = ['hopeless', 'pointless', 'worthless', 'useless', 'give up'];
  score += hopelessnessWords.filter(word => text.includes(word)).length * 10;

  if (text.includes('alone') || text.includes('no one cares') || text.includes('isolated')) score += 15;

  if (text.includes('plan to') || text.includes('going to') || text.includes('will')) {
    const concerningActions = ['die', 'kill', 'harm', 'hurt', 'end'];
    if (concerningActions.some(action => text.includes(action))) score += 20;
  }

  return Math.min(score, 50);
};

const combineAnalyses = (analyses: {
  keywordAnalysis: { score: number; type?: CrisisType; keywords: string[] };
  sentimentScore: number;
  aiAnalysis: { score: number; reasoning: string };
  patternScore: number;
}): CrisisAnalysis => {
  const totalScore = analyses.keywordAnalysis.score * 0.4 + analyses.sentimentScore * 0.2 + analyses.aiAnalysis.score * 0.3 + analyses.patternScore * 0.1;

  let severity: CrisisSeverity;
  let urgency: 'low' | 'medium' | 'high' | 'critical';
  let recommendedAction: string;

  if (totalScore >= 76) {
    severity = CrisisSeverity.CRITICAL; urgency = 'critical';
    recommendedAction = 'IMMEDIATE: Connect to 988 Suicide & Crisis Lifeline or emergency services. Stay with user.';
  } else if (totalScore >= 51) {
    severity = CrisisSeverity.HIGH; urgency = 'high';
    recommendedAction = 'URGENT: Escalate to human therapist immediately. Provide crisis resources.';
  } else if (totalScore >= 26) {
    severity = CrisisSeverity.MEDIUM; urgency = 'medium';
    recommendedAction = 'Monitor closely. Suggest human therapist consultation. Provide support resources.';
  } else {
    severity = CrisisSeverity.LOW; urgency = 'low';
    recommendedAction = 'Continue conversation. Provide supportive responses.';
  }

  return { isCrisis: totalScore >= 26, severity, type: analyses.keywordAnalysis.type, confidence: totalScore / 100, keywords: analyses.keywordAnalysis.keywords, recommendedAction, urgency };
};

export const detectCrisis = async (message: string, conversationHistory?: string[]): Promise<CrisisAnalysis> => {
  try {
    const normalizedMessage = message.toLowerCase();
    const [keywordAnalysis, sentimentScore, aiAnalysis] = await Promise.all([
      analyzeKeywords(normalizedMessage),
      analyzeSentiment(message),
      analyzeWithAI(message, conversationHistory)
    ]);
    const patternScore = analyzePatterns(normalizedMessage);

    const combined = combineAnalyses({ keywordAnalysis, sentimentScore, aiAnalysis, patternScore });
    if (combined.isCrisis) {
      logger.warn('Crisis detected', { severity: combined.severity, type: combined.type, confidence: combined.confidence, message: message.substring(0, 100) });
    }
    return combined;
  } catch (error: any) {
    logger.error('Crisis detection error:', error);
    return { isCrisis: false, severity: CrisisSeverity.LOW, confidence: 0, keywords: [], recommendedAction: 'Continue monitoring', urgency: 'low' };
  }
};

export const getCrisisResources = () => ({
  hotlines: [
    { name: '988 Suicide & Crisis Lifeline', number: '988', description: '24/7 free and confidential support' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: '24/7 crisis support via text' },
    { name: 'SAMHSA National Helpline', number: '1-800-662-4357', description: '24/7 treatment referral' },
    { name: 'Veterans Crisis Line', number: '988 then Press 1', description: 'Support for veterans' },
  ],
  onlineResources: [
    { name: '988 Lifeline Chat', url: 'https://988lifeline.org/chat', description: 'Online chat with crisis counselors' },
    { name: 'NAMI Helpline', url: 'https://www.nami.org/help', description: 'Mental health information' },
  ],
});

export const generateCrisisMessage = (severity: CrisisSeverity): string => {
  const resources = getCrisisResources();
  if (severity === CrisisSeverity.CRITICAL) {
    return `I'm very concerned about what you've shared. Your safety is the top priority.\n\n🚨 **IMMEDIATE HELP AVAILABLE:**\n• Call 988 (Suicide & Crisis Lifeline)\n• Text HOME to 741741\n• Call 911 if in immediate danger\n• Go to nearest ER\n\nYou don't have to face this alone. Trained professionals are ready to help now.`;
  }
  if (severity === CrisisSeverity.HIGH) {
    return `I hear that you're going through a really difficult time. I want to make sure you get support.\n\n**Crisis Support Available:**\n• 988 Suicide & Crisis Lifeline: Call/text 988\n• Crisis Text Line: Text HOME to 741741\n\nI'd also like to connect you with one of our licensed therapists. Would that be helpful?`;
  }
  if (severity === CrisisSeverity.MEDIUM) {
    return `Thank you for sharing. It takes courage to talk about difficult feelings.\n\nI think it would be helpful to speak with a licensed therapist who can provide more comprehensive support.\n\n**Resources:**\n• Book a session on Terapitika\n• 988 Lifeline\n• Crisis Text Line: Text HOME to 741741\n\nWould you like me to help you schedule a session?`;
  }
  return '';
};