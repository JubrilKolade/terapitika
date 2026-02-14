import { Response } from 'express';
import * as SupportService from '../services/support.service';
import { AuthRequest, TicketStatus } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';

export const createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { subject, description, category, priority } = req.body;
    const ticket = await SupportService.createTicket(req.user.id, { subject, description, category, priority });
    return sendSuccess(res, ticket, 'Ticket created', 201);
});

export const getTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const page = parseInt(req.query.page as string) || 1;
    const status = req.query.status as TicketStatus | undefined;
    const result = req.user.role === 'admin'
        ? await SupportService.getAllTickets(status, page)
        : await SupportService.getUserTickets(req.user.id, status, page);
    return sendSuccess(res, result);
});

export const getTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const ticket = await SupportService.getTicketById(id);
    if (!ticket) return sendError(res, 'Ticket not found', 404);
    return sendSuccess(res, ticket);
});

export const updateTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const ticket = await SupportService.updateTicket(id, req.body);
    return sendSuccess(res, ticket);
});

export const addMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    const { message, isInternal } = req.body;
    const msg = await SupportService.addMessage(id, req.user.id, message, isInternal);
    return sendSuccess(res, msg, 'Message added', 201);
});

export const closeTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const ticket = await SupportService.closeTicket(id);
    return sendSuccess(res, ticket, 'Ticket closed');
});
