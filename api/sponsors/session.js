import { isSponsorAuthenticated, requireMethod } from './_auth.js';

export default function handler(request, response) {
  if (!requireMethod(request, response, 'GET')) {
    return;
  }

  response.status(200).json({ authenticated: isSponsorAuthenticated(request) });
}
