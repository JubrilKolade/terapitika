import { Response } from 'express';
import { Review, Therapist } from '../models';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/helpers';
import { asyncHandler } from '../middlewares/error.middleware';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { therapistId, sessionId, rating, reviewText, isAnonymous } = req.body;
    const review = await Review.create({
        client_id: req.user.id, therapist_id: therapistId, session_id: sessionId,
        rating, review_text: reviewText, is_anonymous: isAnonymous || false,
    });

    const therapist = await Therapist.findByPk(therapistId);
    if (therapist) {
        const totalRating = therapist.rating_average * therapist.rating_count + rating;
        therapist.rating_count += 1;
        therapist.rating_average = totalRating / therapist.rating_count;
        await therapist.save();
    }

    return sendSuccess(res, review.toJSON(), 'Review created', 201);
});

export const getTherapistReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
        where: { therapist_id: id, is_published: true },
        order: [['created_at', 'DESC']],
        limit, offset,
    });

    return sendSuccess(res, { reviews: rows.map(r => r.toJSON()), total: count });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    const review = await Review.findOne({ where: { id, client_id: req.user.id } });
    if (!review) return sendError(res, 'Review not found', 404);
    const { rating, reviewText } = req.body;
    if (rating) review.rating = rating;
    if (reviewText) review.review_text = reviewText;
    await review.save();
    return sendSuccess(res, review.toJSON());
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    const count = await Review.destroy({ where: { id, client_id: req.user.id } });
    if (!count) return sendError(res, 'Review not found', 404);
    return sendSuccess(res, null, 'Review deleted');
});

export const respond = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401);
    const { id } = req.params as { id: string };
    const { response } = req.body;
    const review = await Review.findByPk(id);
    if (!review) return sendError(res, 'Review not found', 404);
    review.therapist_response = response;
    review.responded_at = new Date();
    await review.save();
    return sendSuccess(res, review.toJSON());
});
