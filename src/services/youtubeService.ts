import { Innertube, UniversalCache, Log } from 'youtubei.js';
import { VideoMetadata, VideoFormat } from '@/types/video';

// Silence noisy parser warnings about new/unknown YouTube fields
Log.setLevel(Log.Level.NONE);

let innertubeInstance: Innertube | null = null;

async function getInnertube(): Promise<Innertube> {
  if (innertubeInstance) return innertubeInstance;
  innertubeInstance = await Innertube.create({
    cache: new UniversalCache(false),
    generate_session_locally: true,
  });
  return innertubeInstance;
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    /youtube\.com\/watch\?.*v=([^"&?/\s]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function qualityLabel(itag: number, height?: number, fps?: number, isAudio = false): string {
  if (isAudio) return 'audio';
  if (height) return fps && fps > 30 ? `${height}p${fps}` : `${height}p`;
  return `itag-${itag}`;
}

export class YouTubeService {
  static async getInfo(url: string): Promise<VideoMetadata> {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      throw new Error('No se pudo extraer el ID del video de YouTube.');
    }

    const yt = await getInnertube();

    // Try multiple clients in order — InnerTube clients have varying success
    // with different videos and don't trip the bot-check the way yt-dlp does.
    const clients: Array<'IOS' | 'WEB' | 'ANDROID' | 'TV' | 'MWEB'> = [
      'IOS',
      'MWEB',
      'WEB',
      'ANDROID',
      'TV',
    ];

    let info: any = null;
    let lastError: any = null;
    for (const client of clients) {
      try {
        info = await yt.getInfo(videoId, { client });
        if (info?.streaming_data) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!info || !info.streaming_data) {
      throw lastError || new Error('No se pudo obtener la información del video.');
    }

    const basic = info.basic_info || {};
    const streaming = info.streaming_data;

    const allFormats = [
      ...(streaming.formats || []),
      ...(streaming.adaptive_formats || []),
    ];

    const formats: VideoFormat[] = allFormats.map((f: any) => {
      const hasVideo = !!f.width || (f.mime_type || '').startsWith('video/');
      const hasAudio = (f.mime_type || '').startsWith('audio/') || !!f.audio_quality;
      const isAudioOnly = hasAudio && !hasVideo;
      return {
        formatId: String(f.itag),
        extension: ((f.mime_type || '').match(/\/(\w+)/)?.[1]) || 'mp4',
        quality: qualityLabel(f.itag, f.height, f.fps, isAudioOnly),
        url: f.url,
        filesize: f.content_length ? Number(f.content_length) : undefined,
        width: f.width,
        height: f.height,
        hasVideo,
        hasAudio: hasAudio || (hasVideo && !f.has_audio === false),
      };
    });

    // Sort: video first, by height desc; then audio
    formats.sort((a, b) => {
      if (a.hasVideo !== b.hasVideo) return a.hasVideo ? -1 : 1;
      return (b.height || 0) - (a.height || 0);
    });

    // Dedup by quality + extension + audio flag
    const seen = new Set<string>();
    const uniqueFormats = formats.filter(f => {
      const k = `${f.quality}-${f.extension}-${f.hasAudio}-${f.hasVideo}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    // Add synthetic MP3 conversion option
    if (uniqueFormats.some(f => f.hasAudio)) {
      uniqueFormats.push({
        formatId: 'bestaudio-mp3',
        extension: 'mp3',
        quality: '320kbps (Convert)',
        url,
        hasVideo: false,
        hasAudio: true,
      });
    }

    return {
      id: videoId,
      title: basic.title || '',
      thumbnail: basic.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      duration: basic.duration || 0,
      author: basic.author || basic.channel?.name || '',
      views: basic.view_count || 0,
      description: basic.short_description || '',
      formats: uniqueFormats,
      platform: 'youtube',
    };
  }

  /**
   * Returns a NodeJS readable stream of the audio for a given YouTube URL.
   * Used by the download route to pipe through ffmpeg for MP3 conversion.
   */
  static async getAudioStream(url: string): Promise<NodeJS.ReadableStream> {
    const videoId = extractYouTubeId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');
    const yt = await getInnertube();
    const stream = await yt.download(videoId, {
      type: 'audio',
      quality: 'best',
      client: 'IOS',
    });
    // youtubei.js returns a Web ReadableStream; convert to Node stream
    const { Readable } = await import('stream');
    return Readable.fromWeb(stream as any);
  }
}
