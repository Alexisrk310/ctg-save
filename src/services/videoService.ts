import { create as createYoutubeDl } from 'youtube-dl-exec';
import { VideoMetadata, VideoFormat } from '@/types/video';
import { detectPlatform } from '@/utils/platform';
import fs from 'fs';

const BINARY_PATH = '/usr/local/bin/yt-dlp';
const youtubedl = fs.existsSync(BINARY_PATH) 
  ? createYoutubeDl(BINARY_PATH) 
  : createYoutubeDl('yt-dlp'); // Fallback to PATH or default

export class VideoService {
  static async getInfo(url: string): Promise<VideoMetadata> {
    try {
      const platform = detectPlatform(url);
      
      const options: any = {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        addHeader: [
          'referer:youtube.com',
          'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ],
      };

      if (fs.existsSync('./cookies.txt')) {
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
      
      throw new Error('No se pudo obtener la información del video. Inténtalo de nuevo más tarde.');
    }
  }
}
