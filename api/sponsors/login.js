import { requireMethod, setSponsorCookie, validatePassword } from './_auth.js';

export default function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) {
    return;
  }

  const result = validatePassword(request, response);
  if (!result.ok) {
    return;
  }

  setSponsorCookie(response);
  response.status(200).json({ ok: true });
}
