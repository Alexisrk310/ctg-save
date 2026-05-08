export const detectPlatform = (url: string): 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'vimeo' | 'unknown' => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  if (lowerUrl.includes('tiktok.com')) return 'tiktok';
  if (lowerUrl.includes('instagram.com')) return 'instagram';
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) return 'facebook';
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
  if (lowerUrl.includes('vimeo.com')) return 'vimeo';
  
  return 'unknown';
};
