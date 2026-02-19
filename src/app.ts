import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import authRoutes from './routes/auth.js';
import candidateRoutes from './routes/candidate.js';
import jobRoutes from './routes/job.js';
import applicationRoutes from './routes/application.js';
import adminRoutes from './routes/admin.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(
  pinoHttp({
    redact: ['req.headers.authorization', 'req.body.password', 'req.body.phone', 'req.body.resumeRaw'],
  })
);

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => {
  res.type('html').send('<h1>Construction Career Platform API</h1><p>Use /api/* endpoints</p>');
});

app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
