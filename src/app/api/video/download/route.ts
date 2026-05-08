import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'video.mp4';

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const headers = new Headers();
    const contentType = response.headers['content-type'];
    const contentLength = response.headers['content-length'];

    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    if (contentType) {
      headers.set('Content-Type', String(contentType));
    } else {
      headers.set('Content-Type', 'application/octet-stream');
    }

    if (contentLength) {
      headers.set('Content-Length', String(contentLength));
    }

    // @ts-ignore - response.data is a readable stream in Node, but Next.js expects a BodyInit
    return new NextResponse(response.data, {
      headers,
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to stream download' }, { status: 500 });
  }
}
