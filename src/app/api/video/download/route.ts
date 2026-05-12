import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { spawn } from 'child_process';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'video.mp4';
  const isMp3 = filename.toLowerCase().endsWith('.mp3');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  if (isMp3) {
    try {
      // Stream directly from yt-dlp for MP3 conversion
      const ytArgs = [
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '--no-playlist',
        '--no-warnings',
      ];
      
      const fs = require('fs');
      if (fs.existsSync('/etc/secrets/cookies.txt')) {
        ytArgs.push('--cookies', '/etc/secrets/cookies.txt');
      } else if (fs.existsSync('./cookies.txt')) {
        ytArgs.push('--cookies', './cookies.txt');
      }
      
      ytArgs.push('-o', '-', url);

      const ytProcess = spawn('yt-dlp', ytArgs);

      const stream = new ReadableStream({
        start(controller) {
          ytProcess.stdout.on('data', (chunk) => controller.enqueue(chunk));
          ytProcess.stdout.on('end', () => controller.close());
          ytProcess.stdout.on('error', (err) => controller.error(err));
          ytProcess.on('close', (code) => {
            if (code !== 0) console.error(`yt-dlp process exited with code ${code}`);
          });
        },
        cancel() {
          ytProcess.kill();
        }
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        }
      });
    } catch (error: any) {
      console.error('MP3 extraction error:', error);
      return NextResponse.json({ error: 'Failed to extract MP3' }, { status: 500 });
    }
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

    // @ts-ignore - response.data is a readable stream in Node
    return new NextResponse(response.data, {
      headers,
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to stream download' }, { status: 500 });
  }
}
