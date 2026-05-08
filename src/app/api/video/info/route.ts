import { NextRequest, NextResponse } from 'next/server';
import { VideoService } from '@/services/videoService';
import { z } from 'zod';

const schema = z.object({
  url: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = schema.parse(body);

    const info = await VideoService.getInfo(url);
    return NextResponse.json(info);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
