import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export type AuthPayload = { sub: string; role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE' };

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);
export const signToken = (payload: AuthPayload) => jwt.sign(payload, env.jwtSecret, { expiresIn: '12h' });
export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as AuthPayload;
