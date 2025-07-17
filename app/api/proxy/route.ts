import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new Response('Missing URL', { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': url,
      },
    });

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = res.headers.get('content-disposition') || 'inline';

    return new Response(res.body, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response('Proxy error', { status: 500 });
  }
}
