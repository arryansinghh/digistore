/**
 * Optimizes Unsplash image URLs by appending quality and width parameters.
 * If the URL is not from Unsplash, it returns the original URL.
 */
export function getOptimizedImageUrl(url: string, width: number = 800, quality: number = 80): string {
  if (!url || !url.includes("unsplash.com")) return url;

  // Remove existing width/quality params if they exist to avoid conflicts
  const baseUrl = url.split("?")[0];
  
  // Use 'auto=format' for better compression (WebP/AVIF support)
  // Use 'q' for quality and 'w' for width
  // Use 'fit=crop' to ensure we get exactly the right aspect ratio if needed
  return `${baseUrl}?q=${quality}&w=${width}&auto=format&fit=crop`;
}
