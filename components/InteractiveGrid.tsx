import React, { useEffect, useRef, useState } from 'react';

const InteractiveGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridInfo, setGridInfo] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const calculateGrid = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      // Size of each grid cell in pixels
      const size = 50; 
      
      const cols = Math.ceil(width / size);
      const rows = Math.ceil(height / size);
      
      setGridInfo({ cols, rows });
    };

    calculateGrid();
    
    // Debounce resize event slightly to prevent excessive calculations
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateGrid, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-0 overflow-hidden pointer-events-none"
    >
      <div 
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${gridInfo.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridInfo.rows}, 1fr)`,
        }}
      >
        {Array.from({ length: gridInfo.cols * gridInfo.rows }).map((_, i) => (
          <div 
            key={i}
            className="border-[0.5px] border-white/[0.02] bg-transparent pointer-events-auto hover:bg-white/[0.15] transition-colors duration-[1500ms] hover:duration-0 ease-out"
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveGrid;