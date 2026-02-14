import { User } from '../models';
import { UserRole, AuthProvider, IUser } from '../types';
import { generateToken } from '../utils/encryption';
import { generateTokenPair } from '../config/jwt';
import { sessionHelpers } from '../config/redis';
import {
  isValidEmail,
  isValidPassword,
  isAdult
} from '../utils/validation';
import logger from '../utils/logger';
import { comparePassword } from '../utils/encryption';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  role?: UserRole;
}

interface LoginData {
  email: string;
  password: string;
}

interface OAuthData {
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  provider: AuthProvider;
  oauthId: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
}> => {
  if (!isValidEmail(data.email)) throw new Error('Invalid email address');
  const passwordValidation = isValidPassword(data.password);
  if (!passwordValidation.valid) throw new Error(passwordValidation.errors.join(', '));
  if (data.dateOfBirth && !isAdult(data.dateOfBirth)) throw new Error('You must be 18 years or older to register');

  const existingUser = await User.findOne({ where: { email: data.email.toLowerCase() } });
  if (existingUser) throw new Error('User with this email already exists');

  const user = await User.create({
    email: data.email.toLowerCase(),
    password_hash: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
    date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    phone: data.phone,
    role: data.role || UserRole.CLIENT,
    auth_provider: AuthProvider.LOCAL,
    is_verified: false,
    is_active: true,
  });

  const { accessToken, refreshToken } = generateTokenPair(user.id, user.email, user.role);
  await sessionHelpers.setRefreshToken(user.id, refreshToken);
  await user.updateLastLogin();

  logger.info(`User registered: ${user.email}`);
  return { user: user.toJSON() as IUser, accessToken, refreshToken };
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
}> => {
  const user = await User.findOne({ where: { email: data.email.toLowerCase(), is_active: true } });
  if (!user) throw new Error('Invalid email or password');
  if (!user.password_hash) throw new Error('Please login with your social account');

  const isPasswordValid = await comparePassword(data.password, user.password_hash);
  if (!isPasswordValid) throw new Error('Invalid email or password');

  const { accessToken, refreshToken } = generateTokenPair(user.id, user.email, user.role);
  await sessionHelpers.setRefreshToken(user.id, refreshToken);
  await user.updateLastLogin();

  logger.info(`User logged in: ${user.email}`);
  return { user: user.toJSON() as IUser, accessToken, refreshToken };
};

/**
 * OAuth login/register
 */
export const oauthLogin = async (data: OAuthData): Promise<{
  user: IUser;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}> => {
  let user = await User.findOne({ where: { auth_provider: data.provider, oauth_id: data.oauthId } });
  let isNewUser = false;

  if (!user) {
    const existingEmail = await User.findOne({ where: { email: data.email.toLowerCase() } });
    if (existingEmail) throw new Error('Email already registered with different login method');

    user = await User.create({
      email: data.email.toLowerCase(),
      first_name: data.firstName,
      last_name: data.lastName,
      profile_picture_url: data.profilePictureUrl,
      auth_provider: data.provider,
      oauth_id: data.oauthId,
      role: UserRole.CLIENT,
      is_verified: true,
      is_active: true,
    });
    isNewUser = true;
    logger.info(`New OAuth user created: ${user.email}`);
  } else if (!user.is_active) {
    throw new Error('Account is deactivated');
  }

  const { accessToken, refreshToken } = generateTokenPair(user.id, user.email, user.role);
  await sessionHelpers.setRefreshToken(user.id, refreshToken);
  await user.updateLastLogin();

  logger.info(`OAuth user logged in: ${user.email}`);
  return { user: user.toJSON() as IUser, accessToken, refreshToken, isNewUser };
};

/**
 * Logout user
 */
export const logout = async (userId: string): Promise<void> => {
  await sessionHelpers.deleteRefreshToken(userId);
  logger.info(`User logged out: ${userId}`);
};

/**
 * Refresh access token
 */
export const refreshToken = async (userId: string, refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const isValid = await sessionHelpers.verifyRefreshToken(userId, refreshToken);
  if (!isValid) throw new Error('Invalid refresh token');

  const user = await User.findByPk(userId);
  if (!user || !user.is_active) throw new Error('User not found or inactive');

  const tokens = generateTokenPair(user.id, user.email, user.role);
  await sessionHelpers.setRefreshToken(user.id, tokens.refreshToken);
  return tokens;
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<string> => {
  const user = await User.findOne({ where: { email: email.toLowerCase(), is_active: true, auth_provider: AuthProvider.LOCAL } });
  if (!user) return 'If an account exists, a password reset email has been sent';

  const resetToken = generateToken(32);
  await sessionHelpers.setSession(`password_reset:${user.id}`, { token: resetToken, email: user.email }, 3600);
  logger.info(`Password reset requested: ${user.email}`);
  return resetToken;
};

/**
 * Reset password
 */
export const resetPassword = async (userId: string, token: string, newPassword: string): Promise<void> => {
  const passwordValidation = isValidPassword(newPassword);
  if (!passwordValidation.valid) throw new Error(passwordValidation.errors.join(', '));

  const resetData = await sessionHelpers.getSession(`password_reset:${userId}`);
  if (!resetData || resetData.token !== token) throw new Error('Invalid or expired reset token');

  const user = await User.findByPk(userId);
  if (!user || !user.is_active) throw new Error('User not found or inactive');

  user.password_hash = newPassword;
  await user.save();
  await sessionHelpers.deleteSession(`password_reset:${userId}`);
  await sessionHelpers.deleteRefreshToken(userId);
  logger.info(`Password reset completed: ${user.email}`);
};

/**
 * Change password
 */
export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await User.findByPk(userId);
  if (!user || !user.is_active) throw new Error('User not found or inactive');
  if (!user.password_hash) throw new Error('Cannot change password for OAuth accounts');

  const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
  if (!isPasswordValid) throw new Error('Current password is incorrect');

  const passwordValidation = isValidPassword(newPassword);
  if (!passwordValidation.valid) throw new Error(passwordValidation.errors.join(', '));

  user.password_hash = newPassword;
  await user.save();
  logger.info(`Password changed: ${user.email}`);
};

/**
 * Verify email
 */
export const verifyEmail = async (userId: string, token: string): Promise<void> => {
  const verifyData = await sessionHelpers.getSession(`email_verify:${userId}`);
  if (!verifyData || verifyData.token !== token) throw new Error('Invalid or expired verification token');

  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  user.is_verified = true;
  await user.save();
  await sessionHelpers.deleteSession(`email_verify:${userId}`);
  logger.info(`Email verified: ${user.email}`);
};

/**
 * Send email verification
 */
export const sendEmailVerification = async (userId: string): Promise<string> => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  if (user.is_verified) throw new Error('Email already verified');

  const verifyToken = generateToken(32);
  await sessionHelpers.setSession(`email_verify:${userId}`, { token: verifyToken, email: user.email }, 86400);
  logger.info(`Email verification sent: ${user.email}`);
  return verifyToken;
};