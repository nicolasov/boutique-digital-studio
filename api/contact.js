const fallbackFormspreeEndpoint = 'https://formspree.io/f/mnjrwddb';

const getFormspreeEndpoint = () => {
  const endpoint = process.env.FORMSPREE_ENDPOINT;
  return endpoint?.trim() || fallbackFormspreeEndpoint;
};

const readJsonBody = async (request) => {
  if (request.body && typeof request.body === 'object') return request.body;

  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
};

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

const buildFormspreePayload = (payload) => ({
  _subject: 'Nueva consulta desde la web Boutique Digital Studio',
  _replyto: cleanText(payload.email),
  nombre: cleanText(payload.name),
  email: cleanText(payload.email),
  whatsapp: cleanText(payload.whatsapp) || 'No informado',
  mensaje: cleanText(payload.message),
  pagina_actual: cleanText(payload.current_page),
  fecha_hora: cleanText(payload.timestamp),
  dispositivo_user_agent: cleanText(payload.user_agent),
});

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const endpoint = getFormspreeEndpoint();
  if (!endpoint) {
    return response.status(500).json({ ok: false, error: 'Missing Formspree endpoint' });
  }

  try {
    const payload = await readJsonBody(request);

    if (payload._gotcha) {
      return response.status(200).json({ ok: true });
    }

    const formspreePayload = buildFormspreePayload(payload);

    const formspreeResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Referer:
          request.headers.referer ||
          request.headers.origin ||
          'https://boutique-digital-studio.vercel.app/',
      },
      body: JSON.stringify(formspreePayload),
    });

    const body = await formspreeResponse.text();
    response.status(formspreeResponse.status);
    response.setHeader(
      'Content-Type',
      formspreeResponse.headers.get('content-type') || 'application/json'
    );
    return response.send(body);
  } catch (error) {
    console.error('Formspree proxy failed', error);
    return response.status(502).json({ ok: false, error: 'Contact provider unavailable' });
  }
}
