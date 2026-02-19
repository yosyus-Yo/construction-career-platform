import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'PII_ENCRYPTION_KEY'] as const;
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing env: ${key}`);
}

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET!,
  piiKey: process.env.PII_ENCRYPTION_KEY!,
};
