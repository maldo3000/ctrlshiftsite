
import React, { useEffect, useRef, useState } from 'react';

const TubesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let timeoutId: ReturnType<typeof setTimeout>;

    const init = async () => {
      if (!canvasRef.current || instanceRef.current) return;

      try {
        setIsLoading(true);
        
        // Small delay to avoid blocking critical rendering
        await new Promise<void>(resolve => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => resolve(), { timeout: 1000 });
          } else {
            timeoutId = setTimeout(resolve, 100);
          }
        });

        // Dynamically import the library from the CDN
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!canvasRef.current || instanceRef.current) return;

        // Initialize the effect
        // 2026 brand palette: soft pink / mint / creamy on pitch black
        instanceRef.current = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#ffe4ff", "#e9ffff", "#fff2e1"],
            lights: {
              intensity: 200,
              colors: ["#ffe4ff", "#e9ffff", "#fff2e1", "#e6e7e8"]
            }
          }
        });

        setIsLoading(false);

        // Seed the cursor effect with a centered pointer position — until the
        // first real mousemove the library computes NaN geometry and logs a
        // THREE.js error every frame, which is expensive enough to cause jank.
        canvasRef.current.dispatchEvent(new PointerEvent('pointermove', {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
          bubbles: true
        }));
        window.dispatchEvent(new PointerEvent('pointermove', {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2
        }));

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
        setIsLoading(false);
        setHasError(true);
      }
    };

    init();

    return () => {
      if (cleanup) cleanup();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Loading fallback - gradient background */}
      {isLoading && (
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={{ 
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
            animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
      
      {/* Error fallback - simple gradient */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-pink-900/30"
        />
      )}
      
      {/* Canvas - only show when loaded */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoading || hasError ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          pointerEvents: 'none' 
        }} 
      />
    </div>
  );
};

export default TubesBackground;
