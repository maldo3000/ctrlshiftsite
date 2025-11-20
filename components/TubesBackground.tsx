
import React, { useEffect, useRef } from 'react';

const TubesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const init = async () => {
      if (!canvasRef.current) return;

      try {
        // Dynamically import the library from the CDN
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (instanceRef.current) return;

        // Initialize the effect
        instanceRef.current = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });

        // Random color generator
        const randomColors = (count: number) => {
          return new Array(count)
            .fill(0)
            .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
        };

        // Click handler to change colors
        const handleClick = () => {
          if (instanceRef.current) {
            const colors = randomColors(3);
            const lightsColors = randomColors(4);
            instanceRef.current.tubes.setColors(colors);
            instanceRef.current.tubes.setLightsColors(lightsColors);
          }
        };

        window.addEventListener('click', handleClick);
        
        cleanup = () => {
          window.removeEventListener('click', handleClick);
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ 
        // We allow pointer events to pass through the canvas itself 
        // so they don't block buttons, but the library tracks mouse movement via window
        pointerEvents: 'none' 
      }} 
    />
  );
};

export default TubesBackground;
