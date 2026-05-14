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
      return NextResponse.json({ error: 'El enlace proporcionado no es una URL válida.' }, { status: 400 });
    }

    // Log full error to server for diagnostics
    console.error('[api/video/info] error:', error?.stack || error?.message || error);

    const message: string = error?.message || 'Error interno del servidor';

    // Distinguish between user errors and internal errors
    const isUserError = message.includes('enlace') ||
                       message.includes('encontrado') ||
                       message.includes('válido') ||
                       message.includes('restricción');

    return NextResponse.json(
      { error: message, detail: process.env.NODE_ENV !== 'production' ? error?.stack : undefined },
      { status: isUserError ? 400 : 500 }
    );
  }
}
