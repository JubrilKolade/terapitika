import { SupportTicket, SupportMessage, User } from '../models';
import { TicketStatus, ISupportTicket } from '../types';
import logger from '../utils/logger';

export const createTicket = async (userId: string, data: {
    subject: string;
    description: string;
    category?: string;
    priority?: string;
}): Promise<ISupportTicket> => {
    const ticket = await SupportTicket.create({
        user_id: userId,
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority || 'medium',
        status: TicketStatus.OPEN,
    });
    logger.info(`Support ticket created: ${ticket.id}`);
    return ticket.toJSON() as ISupportTicket;
};

export const getTicketById = async (ticketId: string): Promise<ISupportTicket | null> => {
    const ticket = await SupportTicket.findByPk(ticketId, {
        include: [
            { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] },
            { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] },
            { model: SupportMessage, as: 'messages', include: [{ model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name'] }] },
        ],
    });
    return ticket ? ticket.toJSON() as ISupportTicket : null;
};

export const getUserTickets = async (userId: string, status?: TicketStatus, page = 1, limit = 20): Promise<{ tickets: ISupportTicket[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = { user_id: userId };
    if (status) where.status = status;

    const { count, rows } = await SupportTicket.findAndCountAll({
        where, limit, offset,
        order: [['created_at', 'DESC']],
    });
    return { tickets: rows.map(t => t.toJSON() as ISupportTicket), total: count };
};

export const getAllTickets = async (status?: TicketStatus, page = 1, limit = 20): Promise<{ tickets: ISupportTicket[]; total: number }> => {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const { count, rows } = await SupportTicket.findAndCountAll({
        where, limit, offset,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }],
    });
    return { tickets: rows.map(t => t.toJSON() as ISupportTicket), total: count };
};

export const addMessage = async (ticketId: string, senderId: string, message: string, isInternal = false): Promise<any> => {
    const ticket = await SupportTicket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const msg = await SupportMessage.create({ ticket_id: ticketId, sender_id: senderId, message, is_internal: isInternal });

    if (ticket.status === TicketStatus.OPEN) {
        ticket.status = TicketStatus.IN_PROGRESS;
        await ticket.save();
    }

    return msg.toJSON();
};

export const updateTicket = async (ticketId: string, updates: Partial<{ status: TicketStatus; priority: string; assigned_to: string }>): Promise<ISupportTicket> => {
    const ticket = await SupportTicket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    await ticket.update(updates);
    return ticket.toJSON() as ISupportTicket;
};

export const resolveTicket = async (ticketId: string, notes: string): Promise<ISupportTicket> => {
    const ticket = await SupportTicket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    await ticket.resolve(notes);
    return ticket.toJSON() as ISupportTicket;
};

export const closeTicket = async (ticketId: string): Promise<ISupportTicket> => {
    const ticket = await SupportTicket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    await ticket.close();
    return ticket.toJSON() as ISupportTicket;
};
