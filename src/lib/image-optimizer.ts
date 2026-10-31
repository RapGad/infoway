/**
 * Client-Side Image Optimizer
 * 
 * Automatically scales down large camera photos (e.g. 4000x3000 from mobile phones)
 * to a web-optimized 1200px max dimension and converts to modern WebP format
 * before uploading to Cloudflare R2.
 * 
 * This drastically cuts upload time on mobile hotspot Wi-Fi networks and reduces
 * file size by ~85-90% with zero noticeable loss in visual quality.
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg';
}

export async function optimizeImageForWeb(
  file: File,
  options: OptimizeOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'image/webp',
  } = options;

  // Don't process non-image files or SVGs
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve(file);
        return;
      }
      img.src = e.target.result as string;
    };

    reader.onerror = () => resolve(file); // graceful fallback to original file

    img.onload = () => {
      let { width, height } = img;

      // Scale dimensions down if larger than max
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const extension = format === 'image/webp' ? 'webp' : 'jpg';
          const optimizedFile = new File([blob], `${originalName}.${extension}`, {
            type: format,
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        },
        format,
        quality
      );
    };

    img.onerror = () => resolve(file);

    reader.readAsDataURL(file);
  });
}
