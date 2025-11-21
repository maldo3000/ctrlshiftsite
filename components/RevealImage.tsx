
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface RevealImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-video", "aspect-[4/3]"
  priority?: boolean; // For above-the-fold images (eager loading, no lazy)
  width?: number; // Explicit width to prevent layout shift
  height?: number; // Explicit height to prevent layout shift
}

const RevealImage: React.FC<RevealImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  aspectRatio, 
  priority = false,
  width,
  height,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate WebP version path (fallback to original if WebP doesn't exist)
  const getWebPSrc = (originalSrc: string) => {
    // Only convert if it's a local image (starts with /)
    if (originalSrc.startsWith('/')) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return null;
  };

  const webpSrc = getWebPSrc(src);

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className} ${aspectRatio || ''}`}>
      
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-zinc-800/50 z-10 backdrop-blur-sm"
          >
             <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 z-20">
          <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
          <span className="text-xs font-mono">FAILED TO LOAD</span>
        </div>
      )}

      {/* Optimized Image with WebP support */}
      <picture>
        {webpSrc && (
          <source 
            srcSet={webpSrc} 
            type="image/webp"
            onError={() => {
              // If WebP fails, fallback to original will load
            }}
          />
        )}
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoading ? 0 : 1, 
            scale: isLoading ? 1.05 : 1 
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`w-full h-full object-cover ${hasError ? 'hidden' : 'block'}`}
          {...props}
        />
      </picture>
      
      {/* Scanline Overlay (Optional Aesthetic) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};

export default RevealImage;
