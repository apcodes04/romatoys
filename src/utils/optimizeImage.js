/**
 * Optimizes a Cloudinary image URL by injecting f_auto and q_auto parameters.
 * If the URL is not a Cloudinary URL, it returns it unchanged.
 */
export const optimizeImageUrl = (url) => {
  if (!url) return url;
  
  // Only optimize Cloudinary URLs
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // If it already has optimization params, return as is
    if (url.includes('f_auto') || url.includes('q_auto')) {
      return url;
    }
    
    // Inject f_auto,q_auto right after /upload/
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
  }
  
  return url;
};
