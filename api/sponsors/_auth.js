import crypto from 'node:crypto';

const COOKIE_NAME = 'sponsor_auth';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function parseCookies(cookieHeader) {
  if (!cookieHeader) {
    return {};
  }

  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [name, ...rest] = item.split('=');
        return [decodeURIComponent(name), decodeURIComponent(rest.join('='))];
      })
  );
}

function getRequestBody(request) {
  const body = request.body;
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function secureCompare(input, expected) {
  const a = Buffer.from(String(input));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function isSponsorAuthenticated(request) {
  const cookies = parseCookies(request.headers?.cookie);
  return cookies[COOKIE_NAME] === '1';
}

export function requireMethod(request, response, method) {
  if (request.method === method) {
    return true;
  }
  response.setHeader('Allow', method);
  response.status(405).json({ error: `Method ${request.method} not allowed` });
  return false;
}

export function validatePassword(request, response) {
  const configuredPassword = process.env.SPONSOR_PORTAL_PASSWORD;
  if (!configuredPassword) {
    response.status(500).json({ error: 'SPONSOR_PORTAL_PASSWORD is not configured' });
    return { ok: false };
  }

  const { password = '' } = getRequestBody(request);
  if (!secureCompare(password, configuredPassword)) {
    response.status(401).json({ error: 'Invalid password' });
    return { ok: false };
  }

  return { ok: true };
}

export function setSponsorCookie(response) {
  const cookie = [
    `${COOKIE_NAME}=1`,
    'Path=/',
    `Max-Age=${COOKIE_MAX_AGE}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax'
  ].join('; ');

  response.setHeader('Set-Cookie', cookie);
}

export function clearSponsorCookie(response) {
  const cookie = [`${COOKIE_NAME}=`, 'Path=/', 'Expires=Thu, 01 Jan 1970 00:00:00 GMT', 'HttpOnly', 'Secure', 'SameSite=Lax'].join('; ');
  response.setHeader('Set-Cookie', cookie);
}
