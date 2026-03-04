import { clearSponsorCookie, requireMethod } from './_auth.js';

export default function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) {
    return;
  }

  clearSponsorCookie(response);
  response.status(200).json({ ok: true });
}
