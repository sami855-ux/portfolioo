/**
 * Helper to process and normalize image URLs for next/image rendering.
 * Automatically converts Google Drive share links to direct CDN view links.
 */
export function getValidImageUrl(url: string | undefined | null, fallback: string): string {
  if (!url || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim();

  // Convert Google Drive view URLs (e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
  const googleDriveRegex = /drive\.google\.com\/file\/d\/([^\/]+)/;
  const match = trimmed.match(googleDriveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  // Convert Google Drive open/uc URLs (e.g., https://drive.google.com/open?id=FILE_ID or https://drive.google.com/uc?id=FILE_ID)
  const googleDriveIdParam = /drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/;
  const paramMatch = trimmed.match(googleDriveIdParam);
  if (paramMatch && paramMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${paramMatch[1]}`;
  }

  // Fix Cloudinary PDF/DOC links served under /image/upload/
  if (trimmed.includes('cloudinary.com') && (trimmed.endsWith('.pdf') || trimmed.endsWith('.doc') || trimmed.endsWith('.docx'))) {
    return trimmed.replace('/image/upload/', '/raw/upload/');
  }

  return trimmed;
}

/**
 * Helper to process and normalize document/resume URLs (PDF, DOCX).
 * Converts Cloudinary /image/upload/ to /raw/upload/ to avoid 401 Unauthorized errors.
 */
export function getValidFileUrl(url: string | undefined | null): string {
  if (!url || !url.trim()) return '';

  let trimmed = url.trim();

  // Convert Cloudinary URLs for inline browser viewing (prevents auto-downloading)
  if (trimmed.includes('cloudinary.com')) {
    if (trimmed.endsWith('.pdf') || trimmed.endsWith('.doc') || trimmed.endsWith('.docx') || trimmed.includes('/resume/')) {
      trimmed = trimmed.replace('/image/upload/', '/raw/upload/');
    }
    if (!trimmed.includes('fl_inline')) {
      trimmed = trimmed.replace('/upload/', '/upload/fl_inline/');
    }
  }

  return trimmed;
}

