// Midnight at the start of October 22 in Toronto (EDT / UTC-04:00).
const LAUNCH_AT = Date.parse('2026-10-22T00:00:00-04:00');
const PRESALE_URL = 'https://luma.com/asmbly';
const DICE_URL = 'https://dice.fm/event/2wng77-asmbly-a-gathering-for-new-ideas-tech-and-art-19th-nov-demo-room-toronto-tickets';

export default function handler(request, response) {
  // This redirect changes at launch, so neither browsers nor the CDN may cache it.
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('CDN-Cache-Control', 'no-store');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.statusCode = 405;
    response.end();
    return;
  }
  response.setHeader('Location', Date.now() < LAUNCH_AT ? PRESALE_URL : DICE_URL);
  response.statusCode = 307;
  response.end();
}
