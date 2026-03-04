import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

const ROOT = process.cwd();
const isProduction = process.env.NODE_ENV === 'production';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const COOKIE_NAME = 'sponsor_auth';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function secureCompare(input, expected) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

function isSponsorAuthenticated(request) {
  return request.cookies?.[COOKIE_NAME] === '1';
}

function setSponsorCookie(response) {
  response.cookie(COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/'
  });
}

function clearSponsorCookie(response) {
  response.clearCookie(COOKIE_NAME, {
    path: '/'
  });
}

async function createApp() {
  const app = express();
  let vite;

  app.use(express.json());
  app.use(cookieParser());

  app.post('/api/sponsors/login', (request, response) => {
    const configuredPassword = process.env.SPONSOR_PORTAL_PASSWORD;

    if (!configuredPassword) {
      response.status(500).json({ error: 'SPONSOR_PORTAL_PASSWORD is not configured' });
      return;
    }

    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    const isValid = secureCompare(password, configuredPassword);

    if (!isValid) {
      response.status(401).json({ error: 'Invalid password' });
      return;
    }

    setSponsorCookie(response);
    response.json({ ok: true });
  });

  app.post('/api/sponsors/logout', (_request, response) => {
    clearSponsorCookie(response);
    response.json({ ok: true });
  });

  app.get('/api/sponsors/session', (request, response) => {
    response.json({ authenticated: isSponsorAuthenticated(request) });
  });

  app.use('/sponsors', (request, response, next) => {
    const pathname = request.originalUrl.split('?')[0];
    const authenticated = isSponsorAuthenticated(request);

    if (pathname === '/sponsors/login' || pathname === '/sponsors/login/') {
      if (authenticated) {
        response.redirect('/sponsors');
        return;
      }
      next();
      return;
    }

    if (!authenticated) {
      const wantsHtml = request.accepts(['html', 'json']) === 'html';

      if (wantsHtml) {
        const nextPath = encodeURIComponent(`${pathname}${request.url.includes('?') ? request.url.slice(request.url.indexOf('?')) : ''}`);
        response.redirect(`/sponsors/login?next=${nextPath}`);
        return;
      }

      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    next();
  });

  if (isProduction) {
    app.use(express.static(path.resolve(ROOT, 'dist')));
  } else {
    vite = await createViteServer({
      root: ROOT,
      appType: 'custom',
      server: {
        middlewareMode: true
      }
    });

    app.use(vite.middlewares);
  }

  app.use(async (request, response, next) => {
    try {
      if (isProduction) {
        response.sendFile(path.resolve(ROOT, 'dist', 'index.html'));
        return;
      }

      const templatePath = path.resolve(ROOT, 'index.html');
      const template = await fs.readFile(templatePath, 'utf8');
      const transformed = await vite.transformIndexHtml(request.originalUrl, template);
      response.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
    } catch (error) {
      if (vite) {
        vite.ssrFixStacktrace(error);
      }
      next(error);
    }
  });

  app.listen(port, () => {
    console.log(`CTRL+SHIFT app server running at http://localhost:${port}`);
  });
}

void createApp();
