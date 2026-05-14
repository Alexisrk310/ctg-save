import { create as createYoutubeDl } from 'youtube-dl-exec';
import { VideoMetadata, VideoFormat } from '@/types/video';
import { detectPlatform } from '@/utils/platform';
import { YouTubeService } from './youtubeService';
import fs from 'fs';

const BINARY_PATH = '/usr/local/bin/yt-dlp';
const youtubedl = fs.existsSync(BINARY_PATH) 
  ? createYoutubeDl(BINARY_PATH) 
  : createYoutubeDl('yt-dlp'); // Fallback to PATH or default

export class VideoService {
  static async getInfo(url: string): Promise<VideoMetadata> {
    const platform = detectPlatform(url);

    // YouTube: use youtubei.js (InnerTube) — no cookies, no bot-check.
    if (platform === 'youtube') {
      try {
        return await YouTubeService.getInfo(url);
      } catch (err: any) {
        console.error('YouTubeService failed, falling back to yt-dlp:', err?.message || err);
        // fall through to yt-dlp fallback below
      }
    }

    try {
      const options: any = {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        // Use alternate YouTube player clients to bypass bot detection.
        // 'tv' and 'ios' clients are less aggressively gated than 'web'.
        extractorArgs: 'youtube:player_client=tv,ios,web_safari;formats=missing_pot',
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
      };

      if (fs.existsSync('/etc/secrets/cookies.txt')) {
        // Copy to a writable location because yt-dlp tries to update the cookies file
        fs.copyFileSync('/etc/secrets/cookies.txt', '/tmp/cookies.txt');
        options.cookies = '/tmp/cookies.txt';
      } else if (fs.existsSync('./cookies.txt')) {
        options.cookies = './cookies.txt';
      }

      const output = await youtubedl(url, options);

      const data = output as any;
      const formats: VideoFormat[] = data.formats
        .filter((f: any) => f.vcodec !== 'none' || f.acodec !== 'none')
        .map((f: any) => ({
          formatId: f.format_id,
          extension: f.ext,
          quality: f.format_note || f.resolution || `${f.height}p` || 'unknown',
          url: f.url,
          filesize: f.filesize || f.filesize_approx,
          width: f.width,
          height: f.height,
          hasVideo: f.vcodec !== 'none',
          hasAudio: f.acodec !== 'none',
        }))
        .sort((a: VideoFormat, b: VideoFormat) => (b.height || 0) - (a.height || 0));

      // Deduplicate formats by quality and extension to keep the list clean
      const uniqueFormats = formats.reduce((acc: VideoFormat[], current) => {
        const key = `${current.quality}-${current.extension}-${current.hasAudio}`;
        const existing = acc.find(f => `${f.quality}-${f.extension}-${f.hasAudio}` === key);
        
        if (!existing) {
          acc.push(current);
        } else if ((current.filesize || 0) > (existing.filesize || 0)) {
          // Keep the one with larger filesize if quality is same
          const index = acc.indexOf(existing);
          acc[index] = current;
        }
        return acc;
      }, []);

      // Add a synthetic MP3 format if there is at least one audio format
      const audioAvailable = uniqueFormats.some(f => f.hasAudio);
      if (audioAvailable) {
        uniqueFormats.push({
          formatId: 'bestaudio-mp3',
          extension: 'mp3',
          quality: '320kbps (Convert)',
          url: url, // Use the original URL for extraction
          hasVideo: false,
          hasAudio: true,
        });
      }

      return {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        author: data.uploader,
        views: data.view_count,
        description: data.description,
        formats: uniqueFormats,
        platform: platform !== 'unknown' ? platform : 'youtube',
      };
    } catch (error: any) {
      console.error('Error fetching video info:', error);
      const message = error.message || '';
      
      if (message.includes('not found') || message.includes('404')) {
        throw new Error('Video no encontrado. Verifica que el enlace sea correcto y público.');
      }
      if (message.includes('invalid url') || message.includes('not a valid URL')) {
        throw new Error('El enlace proporcionado no es válido.');
      }
      if (message.includes('Sign in to confirm your age')) {
        throw new Error('Este video requiere inicio de sesión (restricción de edad) y no puede ser descargado.');
      }
      if (message.includes("Sign in to confirm you") || message.includes('not a bot') || message.includes('bot')) {
        throw new Error('YouTube está bloqueando temporalmente las descargas desde este servidor. Intenta de nuevo más tarde o actualiza el archivo cookies.txt.');
      }
      
      throw new Error('No se pudo obtener la información del video. Inténtalo de nuevo más tarde.');
    }
  }
}
