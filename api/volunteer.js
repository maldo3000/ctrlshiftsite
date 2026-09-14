const INTEREST_OPTIONS = new Set([
  'Events',
  'Community',
  'Content & social',
  'Design',
  'Photo & video',
  'Partnerships',
  'Operations',
  'Other'
]);

const AVAILABILITY_OPTIONS = new Set([
  'A few hours per month',
  'A few hours per week',
  'Event days only',
  'It depends'
]);

function text(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = request.body ?? {};

  // Quietly accept bot-filled honeypot submissions without forwarding them.
  if (text(body.website, 200)) {
    response.status(200).json({ ok: true });
    return;
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    fullName: text(body.fullName, 100),
    email: text(body.email, 200).toLowerCase(),
    whatsapp: text(body.whatsapp, 40),
    city: text(body.city, 100),
    interests: Array.isArray(body.interests)
      ? body.interests.filter((item) => INTEREST_OPTIONS.has(item))
      : [],
    availability: text(body.availability, 100),
    anythingElse: text(body.anythingElse, 1500),
    consent: body.consent === true,
    source: 'ctrlshift.community/volunteer'
  };

  if (!payload.fullName || !isValidEmail(payload.email) || !payload.whatsapp) {
    response.status(400).json({ error: 'Please complete your name, email and WhatsApp number.' });
    return;
  }

  if (payload.interests.length === 0) {
    response.status(400).json({ error: 'Please choose at least one area where you would like to help.' });
    return;
  }

  if (!AVAILABILITY_OPTIONS.has(payload.availability)) {
    response.status(400).json({ error: 'Please choose your availability.' });
    return;
  }

  if (!payload.consent) {
    response.status(400).json({ error: 'Please confirm that we can contact you.' });
    return;
  }

  const scriptUrl = process.env.VOLUNTEER_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.error('VOLUNTEER_GOOGLE_SCRIPT_URL is not configured');
    response.status(503).json({ error: 'The volunteer form is not connected yet. Please try again soon.' });
    return;
  }

  try {
    const scriptResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    const result = await scriptResponse.json().catch(() => null);
    if (!scriptResponse.ok || result?.ok !== true) {
      throw new Error(result?.error || `Google Apps Script returned ${scriptResponse.status}`);
    }

    response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Volunteer form forwarding failed', error);
    response.status(502).json({ error: 'We could not send your form. Please try again.' });
  }
}
