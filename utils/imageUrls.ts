/**
 * Get the first image URL from image_urls array or fallback to image_url
 * @param imageUrls - Array of image URLs (from image_urls JSON column)
 * @param fallbackImageUrl - Fallback single image URL (from image_url column)
 * @returns First available image URL or empty string
 */
export function getFirstImageUrl(
  imageUrls?: string | string[] | null,
  fallbackImageUrl?: string | null,
): string {
  if (typeof imageUrls === 'string') {
    try {
      const parsed = JSON.parse(imageUrls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0] || '';
      }
    } catch {
      return imageUrls || '';
    }
  }
  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    return imageUrls[0] || '';
  }
  return fallbackImageUrl || '';
}

/**
 * Parse image_urls JSON string to array
 * @param imageUrls - JSON string or array of image URLs
 * @returns Array of image URLs
 */
export function parseImageUrls(imageUrls?: string | string[] | null): string[] {
  if (!imageUrls) return [];

  if (typeof imageUrls === 'string') {
    try {
      const parsed = JSON.parse(imageUrls);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(imageUrls)) {
    return imageUrls.filter(Boolean);
  }
  return [];
}
