import crypto from 'node:crypto';
import { env } from '../config/env.js';

const key = Buffer.from(env.piiKey, 'utf8').subarray(0, 32);

export function encryptPII(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function resumeDigestAndKeywords(resumeRaw: string) {
  const digest = crypto.createHash('sha256').update(resumeRaw).digest('hex');
  const keywords = [...new Set(resumeRaw.toLowerCase().match(/[a-zA-Z가-힣]{3,}/g) || [])]
    .slice(0, 20)
    .join(',');
  return { digest, keywords };
}
