export type VideoFormat = {
  formatId: string;
  extension: string;
  quality: string;
  url?: string;
  filesize?: number;
  width?: number;
  height?: number;
  hasVideo: boolean;
  hasAudio: boolean;
};

export type VideoMetadata = {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  views: number;
  description: string;
  formats: VideoFormat[];
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'vimeo';
};

export type DownloadRequest = {
  url: string;
  formatId: string;
  quality: string;
  type: 'video' | 'audio';
};
