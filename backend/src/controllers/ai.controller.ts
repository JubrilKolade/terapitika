import { Response } from 'express';
import { AuthRequest } from '../types';
import * as AIService from '../services/ai.service';
import * as CrisisDetectionService from '../services/crisis.service';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';
import { Session, Message, GuestSession } from '../models';
import { SessionType, SessionStatus, SenderType, ContentType, CrisisSeverity, CommunicationMode } from '../types';
import logger, { logAuditEvent } from '../utils/logger';

/**
 * Start AI chat session
 */
export const startSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Authentication required', 401);
  const session = await Session.create({
    client_id: req.user.id,
    session_type: SessionType.AI_ONLY,
    communication_mode: CommunicationMode.CHAT,
    status: SessionStatus.IN_PROGRESS,
    started_at: new Date(),
  });
  logAuditEvent(req.user.id, 'ai_session_started', 'session', session.id);
  return sendSuccess(res, { sessionId: session.id, message: 'AI chat session started' }, 'Session created', 201);
});

/**
 * Send message to AI
 */
export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Authentication required', 401);
  const { sessionId, message } = req.body;
  if (!message || !message.trim()) return sendError(res, 'Message is required', 400);

  const session = await Session.findOne({ where: { id: sessionId, client_id: req.user.id, session_type: SessionType.AI_ONLY } });
  if (!session) return sendError(res, 'Session not found', 404);
  if (session.status !== SessionStatus.IN_PROGRESS) return sendError(res, 'Session is not active', 400);

  const userMessage = await Message.create({
    session_id: sessionId,
    sender_id: req.user.id,
    sender_type: SenderType.CLIENT,
    content: message,
    content_type: ContentType.TEXT,
    crisis_detected: false,
    ai_flagged: false,
  });

  const crisisAnalysis = await CrisisDetectionService.detectCrisis(message);
  if (crisisAnalysis.isCrisis) {
    userMessage.crisis_detected = true;
    userMessage.crisis_severity = crisisAnalysis.severity;
    userMessage.ai_flagged = true;
    await userMessage.save();
    await session.addCrisisFlag(crisisAnalysis.severity, message.substring(0, 200));

    if (crisisAnalysis.severity === CrisisSeverity.CRITICAL) {
      const crisisMessage = CrisisDetectionService.generateCrisisMessage(crisisAnalysis.severity);
      await Message.create({
        session_id: sessionId,
        sender_type: SenderType.AI,
        content: crisisMessage,
        content_type: ContentType.TEXT,
        crisis_detected: false,
        ai_flagged: false,
      });
      return sendSuccess(res, { response: crisisMessage, crisisDetected: true, severity: crisisAnalysis.severity, resources: CrisisDetectionService.getCrisisResources() });
    }
  }

  const history = await Message.findAll({ where: { session_id: sessionId }, order: [['created_at', 'ASC']], limit: 20 });
  const conversationHistory = history.filter(msg => msg.id !== userMessage.id).map(msg => ({
    role: msg.sender_type === SenderType.AI ? 'assistant' as const : 'user' as const,
    content: msg.content,
  }));

  const aiResponse = await AIService.chat(message, { conversationHistory });
  const sentiment = await AIService.analyzeSentiment(message);
  userMessage.sentiment_score = sentiment.score;
  await userMessage.save();

  const aiMessage = await Message.create({
    session_id: sessionId,
    sender_type: SenderType.AI,
    content: aiResponse.message,
    content_type: ContentType.TEXT,
    crisis_detected: false,
    ai_flagged: false,
  });

  const responseData: any = { response: aiResponse.message, messageId: aiMessage.id, sentiment };
  if (crisisAnalysis.isCrisis) {
    responseData.crisisDetected = true;
    responseData.crisisInfo = { severity: crisisAnalysis.severity, recommendedAction: crisisAnalysis.recommendedAction, resources: CrisisDetectionService.getCrisisResources() };
  }
  return sendSuccess(res, responseData);
});

/**
 * Guest chat
 */
export const guestChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { guestToken, message } = req.body;
  if (!message || !message.trim()) return sendError(res, 'Message is required', 400);

  let guestSession: any;
  if (guestToken) {
    guestSession = await GuestSession.findValidSession(guestToken);
    if (!guestSession) return sendError(res, 'Guest session expired or invalid', 401);
    if (!guestSession.canSendMessage()) return sendError(res, 'Message limit reached. Please sign up to continue.', 403);
  } else {
    guestSession = await GuestSession.createGuestSession(10, 1, req.ip, req.headers['user-agent']);
  }

  const crisisAnalysis = await CrisisDetectionService.detectCrisis(message);
  if (crisisAnalysis.severity === CrisisSeverity.CRITICAL) {
    const crisisMessage = CrisisDetectionService.generateCrisisMessage(crisisAnalysis.severity);
    return sendSuccess(res, { response: crisisMessage, crisisDetected: true, severity: crisisAnalysis.severity, resources: CrisisDetectionService.getCrisisResources(), guestToken: guestSession.session_token, messagesRemaining: guestSession.getRemainingMessages() });
  }

  const aiResponse = await AIService.chat(message, { maxTokens: 512 });
  await guestSession.incrementMessageCount();

  return sendSuccess(res, {
    response: aiResponse.message,
    guestToken: guestSession.session_token,
    messagesRemaining: guestSession.getRemainingMessages(),
    crisisDetected: crisisAnalysis.isCrisis,
    ... (crisisAnalysis.isCrisis && { crisisInfo: { severity: crisisAnalysis.severity, recommendedAction: crisisAnalysis.recommendedAction } }),
  });
});

/**
 * End AI session
 */
export const endSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Authentication required', 401);
  const { sessionId } = req.body;
  const session = await Session.findOne({ where: { id: sessionId, client_id: req.user.id } });
  if (!session) return sendError(res, 'Session not found', 404);

  await session.end();
  const messages = await Message.findAll({ where: { session_id: sessionId }, order: [['created_at', 'ASC']] });
  if (messages.length > 2) {
    const conversationHistory = messages.map(msg => ({
      role: msg.sender_type === SenderType.AI ? 'assistant' as const : 'user' as const,
      content: msg.content,
    }));
    const summary = await AIService.generateSummary(conversationHistory);
    session.ai_summary = summary;
    await session.save();
  }

  logAuditEvent(req.user.id, 'ai_session_ended', 'session', session.id);
  return sendSuccess(res, { sessionId: session.id, duration: session.duration_minutes, summary: session.ai_summary }, 'Session ended');
});

/**
 * Get session history
 */
export const getSessionMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Authentication required', 401);
  const { sessionId } = req.params;
  const session = await Session.findOne({ where: { id: sessionId, client_id: req.user.id } });
  if (!session) return sendError(res, 'Session not found', 404);

  const messages = await Message.findAll({ where: { session_id: sessionId }, order: [['created_at', 'ASC']] });
  return sendSuccess(res, {
    sessionId,
    messages: messages.map(msg => ({
      id: msg.id, senderType: msg.sender_type, content: msg.content, contentType: msg.content_type, crisisDetected: msg.crisis_detected, sentimentScore: msg.sentiment_score, createdAt: msg.created_at,
    })),
  });
});

/**
 * Get coping strategies
 */
export const getCopingStrategies = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { concern, context } = req.body;
  if (!concern) return sendError(res, 'Concern is required', 400);
  const strategies = await AIService.suggestCopingStrategies(concern, context);
  return sendSuccess(res, { strategies });
});