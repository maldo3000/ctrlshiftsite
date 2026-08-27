// Returns the sanitized guest list for a raffle-enabled Luma event.
// Requires LUMA_API_KEY (Luma calendar API key) in the environment.
// Only events listed here can be queried — the id never comes from the client raw.
const RAFFLE_EVENTS = {
  'vol-13': 'evt-nn0bZWCEARpuKBL'
};

const LUMA_API_BASE = 'https://public-api.luma.com/v1';
const PAGE_LIMIT = 100;
const MAX_PAGES = 40;

async function fetchAllGuests(eventApiId, apiKey) {
  const guests = [];
  let cursor = null;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(`${LUMA_API_BASE}/event/get-guests`);
    url.searchParams.set('event_api_id', eventApiId);
    url.searchParams.set('pagination_limit', String(PAGE_LIMIT));
    if (cursor) {
      url.searchParams.set('pagination_cursor', cursor);
    }

    const lumaResponse = await fetch(url, {
      headers: { accept: 'application/json', 'x-luma-api-key': apiKey }
    });

    if (!lumaResponse.ok) {
      const detail = await lumaResponse.text().catch(() => '');
      const error = new Error(`Luma API responded ${lumaResponse.status}: ${detail.slice(0, 200)}`);
      error.status = lumaResponse.status;
      throw error;
    }

    const payload = await lumaResponse.json();
    const entries = Array.isArray(payload.entries) ? payload.entries : [];

    for (const entry of entries) {
      const guest = entry.guest ?? entry;
      if (!guest || guest.approval_status !== 'approved') {
        continue;
      }
      guests.push({
        id: guest.api_id,
        name: guest.name || guest.user_name || 'Guest',
        checked_in: Boolean(guest.checked_in_at)
      });
    }

    if (!payload.has_more || !payload.next_cursor) {
      break;
    }
    cursor = payload.next_cursor;
  }

  return guests;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ error: `Method ${request.method} not allowed` });
    return;
  }

  const eventSlug = typeof request.query?.event === 'string' ? request.query.event : 'vol-13';
  const eventApiId = RAFFLE_EVENTS[eventSlug];
  if (!eventApiId) {
    response.status(404).json({ error: `Unknown raffle event "${eventSlug}"` });
    return;
  }

  const apiKey = process.env.LUMA_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: 'LUMA_API_KEY is not configured' });
    return;
  }

  try {
    const guests = await fetchAllGuests(eventApiId, apiKey);
    response.setHeader('Cache-Control', 'no-store');
    response.status(200).json({
      event: eventSlug,
      event_api_id: eventApiId,
      count: guests.length,
      guests
    });
  } catch (error) {
    response.status(502).json({ error: error.message || 'Failed to fetch guests from Luma' });
  }
}
