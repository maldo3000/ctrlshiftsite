import React, { useEffect, useRef } from 'react';

const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += 0.002;
      if (!ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Create a complex gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#050505'); // Deep black
      gradient.addColorStop(0.5, '#0a0a0a');
      gradient.addColorStop(1, '#050505');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw moving "blobs" to simulate the liquid effect
      // Using composite operations to blend them softly
      ctx.globalCompositeOperation = 'screen';
      
      const blobs = [
        { x: width * 0.2, y: height * 0.3, r: width * 0.4, color: 'rgba(60, 20, 60, 0.15)', speed: 1.1 }, // Purple-ish
        { x: width * 0.8, y: height * 0.7, r: width * 0.45, color: 'rgba(20, 60, 60, 0.15)', speed: 0.8 }, // Teal-ish
        { x: width * 0.5, y: height * 0.5, r: width * 0.3, color: 'rgba(40, 40, 80, 0.1)', speed: 1.5 }, // Blue-ish
      ];

      blobs.forEach(blob => {
        const moveX = Math.sin(time * blob.speed) * 100;
        const moveY = Math.cos(time * blob.speed * 1.2) * 100;
        
        const grad = ctx.createRadialGradient(
          blob.x + moveX, blob.y + moveY, 0,
          blob.x + moveX, blob.y + moveY, blob.r
        );
        
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x + moveX, blob.y + moveY, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Subtle noise overlay (simulated)
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      for(let i=0; i<100; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const s = Math.random() * 2;
          ctx.fillRect(x, y, s, s);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-80"
    />
  );
};

export default FluidBackground;