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
    
    // Distinguish between user errors and internal errors
    const isUserError = error.message.includes('enlace') || 
                       error.message.includes('encontrado') || 
                       error.message.includes('válido') ||
                       error.message.includes('restricción');

    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' }, 
      { status: isUserError ? 400 : 500 }
    );
  }
}
