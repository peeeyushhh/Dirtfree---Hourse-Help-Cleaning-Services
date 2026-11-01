import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes any image URL (local asset, UploadThing CDN, or full web URL).
 * Fixes accidental leading slashes on full URLs (/https://...) and provides fallback.
 */
export function getCleanImageUrl(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return '/Images/full-home-clean.jpg';
  let url = raw.trim();
  if (!url) return '/Images/full-home-clean.jpg';

  // Fix accidental double prefix like /https:// or /http://
  if (url.startsWith('/http://') || url.startsWith('/https://')) {
    url = url.substring(1);
  }

  // Direct remote URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Already starting with / for local public assets
  if (url.startsWith('/')) {
    return url;
  }

  return `/${url}`;
}

