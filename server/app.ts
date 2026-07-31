import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import pgStore from 'connect-pg-simple';
import path from 'path';
import multer from 'multer';
import { Pool } from 'pg';
import { memoriesRouter } from './routes/memories';
import { templatesRouter } from './routes/templates';
import { qrRouter } from './routes/qr';
import { ordersRouter } from './routes/orders';
import { mediaRouter } from './routes/media';
import { uploadRouter } from './routes/upload';
import { settingsRouter } from './routes/settings';
import { logsRouter } from './routes/logs';
import { usersRouter } from './routes/users';
import { musicRouter } from './routes/music';
import { authRouter } from './routes/auth';
import { analyticsRouter } from './routes/analytics';
import { contactRouter } from './routes/contact';
import { newsletterRouter } from './routes/newsletter';

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is required.');
  throw new Error('DATABASE_URL environment variable is required.');
}

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET) {
  if (isProduction) {
    console.error('FATAL: SESSION_SECRET environment variable is required.');
    throw new Error('SESSION_SECRET environment variable is required.');
  }
  console.warn('WARNING: SESSION_SECRET not set. Using a random development secret. Sessions will not persist across server restarts.');
  process.env.SESSION_SECRET = [...Array(64)].map(() => Math.random().toString(36)[2]).join('');
}

if (!process.env.CLIENT_ORIGIN) {
  if (isProduction) {
    console.error('FATAL: CLIENT_ORIGIN environment variable is required (e.g. https://memorygift.com).');
    throw new Error('CLIENT_ORIGIN environment variable is required.');
  }
  console.warn('WARNING: CLIENT_ORIGIN not set. Defaulting to http://localhost:3000 for development.');
  process.env.CLIENT_ORIGIN = 'http://localhost:3000';
}

export const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.set('trust proxy', isProduction ? 1 : 0);

app.use(morgan(isProduction ? 'combined' : 'dev'));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', 'https://images.unsplash.com'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", clientOrigin],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      ...(isProduction ? { upgradeInsecureRequests: [] } : {}),
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  ...(isProduction ? { hsts: { maxAge: 63072000, includeSubDomains: true, preload: true } } : {}),
  frameguard: { action: 'deny' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
}));

app.use(compression());

app.use(cors({
  origin: clientOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

const dbUrl = new URL(process.env.DATABASE_URL);
['channel_binding'].forEach(p => dbUrl.searchParams.delete(p));
const sanitizedDbUrl = dbUrl.toString();

export const pool = new Pool({
  connectionString: sanitizedDbUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const PgStore = pgStore(session);

app.use(session({
  store: new PgStore({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  name: 'mg.sid',
  resave: false,
  saveUninitialized: false,
  proxy: isProduction,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/contact', publicLimiter);
app.use('/api/newsletter/subscribe', publicLimiter);
app.use('/api/memories/slug', publicLimiter);
app.use('/api/memories', (req, res, next) => {
  if (req.path.endsWith('/increment-view')) return publicLimiter(req, res, next);
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/memories', memoriesRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/qr', qrRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/media', mediaRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/users', usersRouter);
app.use('/api/music', musicRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'unhealthy' });
  }
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://memorygift.com/sitemap.xml\n');
});

app.get('/sitemap.xml', async (_req, res) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://memorygift.com/</loc><priority>1.0</priority></url>
</urlset>`);
});

if (isProduction) {
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use('/assets', express.static(path.join(distPath, 'assets'), {
    maxAge: '1y',
    immutable: true,
  }));
  app.use(express.static(distPath, { maxAge: '5m' }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ error: 'Not found' });
      }
    });
  });
}

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  const status = err.status || err.statusCode || (err instanceof multer.MulterError ? 400 : 500);
  const message = err.expose || err instanceof multer.MulterError ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
});
