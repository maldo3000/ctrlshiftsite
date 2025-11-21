
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Minus, Maximize2, Youtube, Twitter, Instagram, Terminal, Folder, ExternalLink, Palette, Eraser, Trash2, MousePointer2 } from 'lucide-react';

interface RetroDesktopProps {
  onLaunch: () => void;
}

const RetroDesktop: React.FC<RetroDesktopProps> = ({ onLaunch }) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState('');
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();
  const paintDragControls = useDragControls();
  
  // Window State
  const [activeWindow, setActiveWindow] = useState<'main' | 'paint'>('main');
  const [zIndices, setZIndices] = useState({ main: 20, paint: 10 });

  // Main App Window State
  const [windowSize, setWindowSize] = useState({ width: 400, height: 200 });
  const [isMaximized, setIsMaximized] = useState(false);

  // Paint App Window State
  const [isPaintOpen, setIsPaintOpen] = useState(false);
  const [paintWindowSize, setPaintWindowSize] = useState({ width: 600, height: 450 });
  const [isPaintMaximized, setIsPaintMaximized] = useState(false);

  // Paint Logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser'>('brush');

  // Icon positions - initialized once to prevent rearrangement on re-renders
  const [iconPositions] = useState(() => ({
    youtube: { top: Math.random() * 200 + 60, left: Math.random() * 100 + 20 },
    twitter: { top: Math.random() * 200 + 60, left: Math.random() * 100 + 20 },
    instagram: { top: Math.random() * 200 + 60, left: Math.random() * 100 + 20 },
    paint: { top: Math.random() * 200 + 60, left: Math.random() * 100 + 20 },
    documents: { top: window.innerHeight / 2, left: window.innerWidth - 120 }
  }));

  // Constants
  const COLORS = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Paint Canvas
  useEffect(() => {
    if (isPaintOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      // Set actual canvas size (internal resolution)
      canvas.width = 800;
      canvas.height = 600;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Initialize context settings immediately
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.lineWidth = currentTool === 'eraser' ? 20 : 3;
        
        contextRef.current = ctx;
      }
    } else if (!isPaintOpen) {
      // Reset context ref when closed so it re-initializes correctly on next open
      contextRef.current = null;
      setIsDrawing(false);
    }
  }, [isPaintOpen]);

  // Update Paint Context settings
  useEffect(() => {
    if(contextRef.current) {
       contextRef.current.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
       contextRef.current.lineWidth = currentTool === 'eraser' ? 20 : 3;
    }
  }, [currentColor, currentTool, isPaintOpen]);

  const handleWindowClick = (window: 'main' | 'paint') => {
    setActiveWindow(window);
    setZIndices({
        main: window === 'main' ? 30 : 20,
        paint: window === 'paint' ? 30 : 20
    });
  };

  const handleNavClick = (id: string) => {
    setIsStartOpen(false);
    onLaunch();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  };

  // Drawing Handlers with scaling support
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
     if (!canvasRef.current) return { x: 0, y: 0 };
     const canvas = canvasRef.current;
     const rect = canvas.getBoundingClientRect();
     // Calculate scale in case canvas is resized via CSS/Flexbox
     const scaleX = canvas.width / rect.width;
     const scaleY = canvas.height / rect.height;
     return {
         x: (e.clientX - rect.left) * scaleX,
         y: (e.clientY - rect.top) * scaleY
     };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    contextRef.current?.lineTo(x, y);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
      if(canvasRef.current && contextRef.current) {
          contextRef.current.fillStyle = "#ffffff";
          contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
  };

  const DesktopIcon = ({ icon: Icon, label, color = "text-blue-600", onClick, position }: any) => (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className="flex flex-col items-center gap-1 w-24 p-2 cursor-pointer group absolute text-center"
      style={{ 
        top: position?.top || 60, 
        left: position?.left || 20 
      }}
      onDoubleClick={onClick}
      onTouchStart={onClick} // For mobile friendliness
    >
      <div className="w-10 h-10 bg-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] flex items-center justify-center group-hover:bg-blue-800 transition-colors relative">
        <Icon className={`w-6 h-6 ${color} group-hover:text-white`} />
        {/* Selection overlay */}
        <div className="absolute inset-0 bg-blue-800 opacity-0 group-hover:opacity-20 mix-blend-overlay"></div>
      </div>
      <span className="text-white text-xs font-bold bg-blue-900/50 px-1 leading-tight mt-1 border border-transparent group-hover:border-white/50 group-hover:bg-blue-800">
        {label}
      </span>
    </motion.div>
  );

  // Classic Windows 95/98 Border Styles
  const windowBorder = "border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#000000] border-b-[#000000]";
  const buttonBorder = "border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000]";
  const insetBorder = "border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff]";
  const pressedButtonBorder = "border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#000000] border-l-[#000000] border-r-[#ffffff] border-b-[#ffffff]";

  return (
    <div className="fixed inset-0 z-50 bg-[#008080] overflow-hidden font-sans select-none" ref={constraintsRef}>
      
      {/* Desktop Icons Layer */}
      <div className="absolute inset-0 p-10 z-0 pointer-events-auto">
         <DesktopIcon 
            icon={Youtube} 
            label="YouTube.exe" 
            color="text-red-600" 
            position={iconPositions.youtube}
            onClick={() => window.open('https://www.youtube.com/@CTRLSHIFT-COMMUNITY', '_blank')} 
         />
         <DesktopIcon 
            icon={Twitter} 
            label="X_Client.lnk" 
            color="text-black" 
            position={iconPositions.twitter}
            onClick={() => window.open('https://x.com/ctrlshift_ai', '_blank')} 
         />
         <DesktopIcon 
            icon={Instagram} 
            label="Insta_Bot.bat" 
            color="text-pink-600" 
            position={iconPositions.instagram}
            onClick={() => window.open('https://www.instagram.com/ctrlshift_ai/', '_blank')} 
         />
         
         <DesktopIcon 
            icon={Palette} 
            label="Paint.exe" 
            color="text-orange-600" 
            position={iconPositions.paint}
            onClick={() => {
                setIsPaintOpen(true);
                handleWindowClick('paint');
            }} 
         />

         <motion.div
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            whileDrag={{ scale: 1.1, zIndex: 50 }}
            className="absolute flex flex-col items-center gap-1 w-24 cursor-pointer group"
            style={{ 
              top: iconPositions.documents.top, 
              left: iconPositions.documents.left 
            }}
         >
             <div className="w-10 h-10 flex items-center justify-center">
                 <Folder className="w-10 h-10 text-yellow-500 fill-yellow-500 drop-shadow-md" />
             </div>
             <span className="text-white text-xs font-bold bg-blue-900/50 px-1 mt-1 border border-transparent group-hover:border-white/50 group-hover:bg-blue-800">My Documents</span>
         </motion.div>
      </div>

      {/* === PAINT WINDOW === */}
      {isPaintOpen && (
          <motion.div 
            drag
            dragListener={false}
            dragControls={paintDragControls}
            dragMomentum={false}
            dragConstraints={constraintsRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            style={{ 
                width: paintWindowSize.width, 
                height: paintWindowSize.height,
                zIndex: zIndices.paint
            }}
            onPointerDown={() => handleWindowClick('paint')}
            className={`absolute top-10 left-10 pointer-events-auto bg-[#c0c0c0] ${windowBorder} shadow-[8px_8px_0px_rgba(0,0,0,0.3)] flex flex-col`}
        >
            {/* Paint Title Bar */}
            <div 
                onPointerDown={(e) => paintDragControls.start(e)}
                className={`bg-gradient-to-r ${activeWindow === 'paint' ? 'from-[#000080] to-[#1084d0]' : 'from-[#808080] to-[#b0b0b0]'} px-1 py-0.5 flex items-center justify-between cursor-default select-none h-8 flex-shrink-0`}
            >
                <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide px-1">
                    <Palette size={14} />
                    <span>untitled - Paint</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className={`w-5 h-5 bg-[#c0c0c0] ${buttonBorder} flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:outline-none`}>
                        <Minus size={10} strokeWidth={3} className="text-black"/>
                    </button>
                    <button 
                        onClick={() => {
                            if(isPaintMaximized) {
                                setPaintWindowSize({ width: 600, height: 450 });
                                setIsPaintMaximized(false);
                            } else {
                                setPaintWindowSize({ width: Math.min(1000, window.innerWidth * 0.9), height: Math.min(800, window.innerHeight * 0.8) });
                                setIsPaintMaximized(true);
                            }
                        }}
                        className={`w-5 h-5 bg-[#c0c0c0] ${buttonBorder} flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:outline-none`}
                    >
                        <Maximize2 size={10} strokeWidth={3} className="text-black"/>
                    </button>
                    <button 
                        onClick={() => setIsPaintOpen(false)}
                        className={`w-5 h-5 bg-[#c0c0c0] ${buttonBorder} flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white ml-1 focus:outline-none`}
                    >
                        <X size={12} strokeWidth={3} className="text-black"/>
                    </button>
                </div>
            </div>

            {/* Menu Bar - Fixed layout */}
            <div className="flex gap-4 px-2 py-1 text-sm text-black border-b border-[#808080] mb-1 select-none cursor-default">
                <div><span className="underline">F</span>ile</div>
                <div><span className="underline">E</span>dit</div>
                <div><span className="underline">V</span>iew</div>
                <div><span className="underline">I</span>mage</div>
                <div><span className="underline">O</span>ptions</div>
                <div><span className="underline">H</span>elp</div>
            </div>

            {/* Paint Content */}
            <div className="flex flex-1 relative overflow-hidden p-1 gap-1">
                {/* Tool Box */}
                <div className="flex flex-col gap-1">
                    <div className={`w-12 bg-[#c0c0c0] flex flex-col items-center py-1 gap-1 ${buttonBorder}`}>
                        <button 
                            onClick={() => setCurrentTool('brush')}
                            className={`w-8 h-8 flex items-center justify-center ${currentTool === 'brush' ? pressedButtonBorder + ' bg-[#e0e0e0]' : buttonBorder}`}
                        >
                            <MousePointer2 size={16} className="text-black rotate-[-45deg]" />
                        </button>
                        <button 
                            onClick={() => setCurrentTool('eraser')}
                            className={`w-8 h-8 flex items-center justify-center ${currentTool === 'eraser' ? pressedButtonBorder + ' bg-[#e0e0e0]' : buttonBorder}`}
                        >
                            <Eraser size={16} className="text-black" />
                        </button>
                         <button 
                            onClick={clearCanvas}
                            className={`w-8 h-8 flex items-center justify-center ${buttonBorder}`}
                            title="Clear Canvas"
                        >
                            <Trash2 size={16} className="text-red-600" />
                        </button>
                    </div>
                    
                    {/* Current Tool Options (Placeholder style) */}
                     <div className={`w-12 h-16 bg-[#c0c0c0] ${insetBorder} mt-1 flex flex-col items-center justify-center gap-2`}>
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                     </div>
                </div>

                {/* Canvas Container */}
                <div className={`flex-1 bg-[#808080] p-1 overflow-auto relative ${insetBorder} flex items-start justify-start`}>
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="bg-white cursor-crosshair shadow-md block"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>
            </div>

            {/* Footer / Palette */}
            <div className="h-12 bg-[#c0c0c0] p-1 flex items-center gap-2 border-t border-[#ffffff]">
                <div className={`w-8 h-8 bg-white ${insetBorder} flex items-center justify-center`}>
                     <div className="w-5 h-5 border border-black" style={{ backgroundColor: currentColor }}></div>
                </div>
                <div className="flex-1 flex flex-wrap gap-0.5">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => {
                                setCurrentColor(c);
                                if (currentTool === 'eraser') setCurrentTool('brush');
                            }}
                            className={`w-5 h-5 border border-gray-600 ${currentColor === c ? 'ring-1 ring-black ring-offset-1' : ''}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
             
            {/* Resize Handle */}
            <motion.div 
                drag
                dragMomentum={false}
                onDrag={(e, info) => {
                    setPaintWindowSize(prev => ({
                        width: Math.max(400, prev.width + info.delta.x),
                        height: Math.max(300, prev.height + info.delta.y)
                    }));
                }}
                className="absolute bottom-0.5 right-0.5 w-4 h-4 cursor-se-resize flex items-end justify-end z-50"
            >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M12 12H8L12 8V12Z" fill="#808080"/>
                        <path d="M12 8H11L12 7V8Z" fill="#ffffff"/>
                        <path d="M12 7H7L12 2V7Z" fill="#808080"/>
                        <path d="M12 3H11L12 2V3Z" fill="#ffffff"/>
                        <path d="M8 12H7L8 11V12Z" fill="#ffffff"/>
                    </svg>
            </motion.div>
        </motion.div>
      )}


      {/* === MAIN CTRL+SHIFT WINDOW === */}
      <motion.div 
            drag
            dragListener={false} // Only drag from the header
            dragControls={dragControls}
            dragMomentum={false}
            dragConstraints={constraintsRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onPointerDown={() => handleWindowClick('main')}
            style={{ 
                width: windowSize.width, 
                height: windowSize.height,
                zIndex: zIndices.main 
            }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-[#c0c0c0] ${windowBorder} shadow-[8px_8px_0px_rgba(0,0,0,0.3)] flex flex-col relative`}
        >
            {/* Title Bar */}
            <div 
                onPointerDown={(e) => dragControls.start(e)}
                className={`bg-gradient-to-r ${activeWindow === 'main' ? 'from-[#000080] to-[#1084d0]' : 'from-[#808080] to-[#b0b0b0]'} px-1 py-0.5 flex items-center justify-between cursor-default select-none h-8 flex-shrink-0`}
            >
                <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide px-1">
                    <Terminal size={14} />
                    <span>CTRL+SHIFT.exe</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className={`w-5 h-5 bg-[#c0c0c0] ${buttonBorder} flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:outline-none`}>
                        <Minus size={10} strokeWidth={3} className="text-black"/>
                    </button>
                    <button 
                        onClick={() => {
                            if(isMaximized) {
                                setWindowSize({ width: 400, height: 200 });
                                setIsMaximized(false);
                            } else {
                                setWindowSize({ width: Math.min(800, window.innerWidth * 0.8), height: Math.min(600, window.innerHeight * 0.8) });
                                setIsMaximized(true);
                            }
                        }}
                        className={`w-5 h-5 bg-[#c0c0c0] ${buttonBorder} flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:outline-none`}
                    >
                        <Maximize2 size={10} strokeWidth={3} className="text-black"/>
                    </button>
                    <button 
                        onClick={onLaunch}
                        className={`w-5 h-5 bg-[#c0c0c0] ${buttonBorder} flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white ml-1 focus:outline-none`}
                    >
                        <X size={12} strokeWidth={3} className="text-black"/>
                    </button>
                </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 p-3 flex flex-col relative overflow-hidden">
                
                <div className="flex gap-4 items-start flex-1 mt-2">
                     {/* Warning Icon */}
                     <div className="flex-shrink-0">
                         <div className="w-10 h-10 relative">
                             <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 drop-shadow-sm">
                                 <path d="M12 2L1 22H23L12 2Z" fill="#FFCC00" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
                             </svg>
                             <span className="absolute top-[10px] left-1/2 -translate-x-1/2 font-serif font-bold text-lg text-black">!</span>
                         </div>
                     </div>
                     
                     {/* Text Content */}
                     <div className="text-black text-[13px] leading-5 font-sans pt-0.5">
                         <p className="mb-3 font-medium">Environment checks complete.</p>
                         <p className="mb-3">
                             You’re about to enter a space built for exploration, prototyping, and unexpected connections.
                         </p>
                         <p>Do you wish to proceed?</p>
                     </div>
                </div>
                
                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-2 mb-1">
                     <button 
                        onClick={onLaunch}
                        className={`min-w-[75px] px-4 py-1 bg-[#c0c0c0] ${buttonBorder} text-black text-sm font-medium active:border-t-black active:border-l-black active:border-b-white active:border-r-white focus:outline-none focus:ring-1 focus:ring-black focus:ring-offset-1 focus:ring-offset-[#c0c0c0] active:bg-[#b0b0b0]`}
                    >
                        <span className="border border-black border-dotted px-1 inline-block w-full text-center">Launch</span>
                     </button>
                </div>

                {/* Resize Handle */}
                <motion.div 
                    drag
                    dragMomentum={false}
                    onDrag={(e, info) => {
                        setWindowSize(prev => ({
                            width: Math.max(350, prev.width + info.delta.x),
                            height: Math.max(180, prev.height + info.delta.y)
                        }));
                    }}
                    className="absolute bottom-0.5 right-0.5 w-4 h-4 cursor-se-resize flex items-end justify-end z-50"
                >
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                         <path d="M12 12H8L12 8V12Z" fill="#808080"/>
                         <path d="M12 8H11L12 7V8Z" fill="#ffffff"/>
                         <path d="M12 7H7L12 2V7Z" fill="#808080"/>
                         <path d="M12 3H11L12 2V3Z" fill="#ffffff"/>
                         <path d="M8 12H7L8 11V12Z" fill="#ffffff"/>
                     </svg>
                </motion.div>
            </div>
      </motion.div>

      {/* Taskbar */}
      <div className={`absolute top-0 left-0 right-0 h-10 bg-[#c0c0c0] border-b-2 border-white shadow-md z-50 flex items-center px-1 justify-between ${windowBorder} border-b-black border-r-black pointer-events-auto`}>
        
        <div className="flex items-center gap-2 h-full py-1">
            <button 
                onClick={() => setIsStartOpen(!isStartOpen)}
                className={`h-full px-2 flex items-center gap-1 font-bold ${isStartOpen ? pressedButtonBorder + ' bg-[#b0b0b0]' : buttonBorder} active:bg-[#b0b0b0] focus:outline-none`}
            >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5 flex-shrink-0">
                    <div className="bg-[#000080]"></div>
                    <div className="bg-[#008000]"></div>
                    <div className="bg-[#ff0000]"></div>
                    <div className="bg-[#ffff00]"></div>
                </div>
                <span className="text-sm text-black">Start</span>
            </button>
            
            <div className="h-full w-px bg-gray-500 mx-1"></div>
            <div className="h-full w-px bg-white mx-1"></div>

            {/* Taskbar Items */}
            {isPaintOpen && (
                <div 
                    onClick={() => {
                        if (activeWindow === 'paint') {
                             // Minimize logic could go here, for now just focus
                             handleWindowClick('paint');
                        } else {
                             handleWindowClick('paint');
                        }
                    }}
                    className={`h-full px-2 flex items-center gap-1 text-sm cursor-pointer ${activeWindow === 'paint' ? insetBorder + ' bg-[#eeeeee]' : windowBorder} w-32 truncate`}
                >
                    <Palette size={14} className="text-black"/>
                    <span className="text-black truncate">untitled - Paint</span>
                </div>
            )}
            <div 
                    onClick={() => handleWindowClick('main')}
                    className={`h-full px-2 flex items-center gap-1 text-sm cursor-pointer ${activeWindow === 'main' ? insetBorder + ' bg-[#eeeeee]' : windowBorder} w-32 truncate ml-1`}
                >
                    <Terminal size={14} className="text-black"/>
                    <span className="text-black truncate">CTRL+SHIFT.exe</span>
            </div>
        </div>

        {/* Clock */}
        <div className={`h-full px-4 flex items-center gap-2 text-sm font-mono ${insetBorder} bg-[#c0c0c0] my-1 mr-1 text-black`}>
            <span>🔊</span>
            <span>{time}</span>
        </div>

        {/* Start Menu Dropdown */}
        <AnimatePresence>
            {isStartOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-10 left-0 w-64 bg-[#c0c0c0] ${windowBorder} shadow-xl flex z-50`}
                >
                    <div className="w-8 bg-[#000080] text-white flex items-end justify-center pb-4 relative">
                        <span className="transform -rotate-90 whitespace-nowrap font-bold text-xl tracking-widest absolute bottom-12">CTRL+SHIFT</span>
                    </div>
                    <div className="flex-1 py-1">
                        {[
                           { id: 'who-we-are', label: 'About', icon: <Terminal size={16}/> },
                           { id: 'audience', label: 'Audience', icon: <Folder size={16}/> },
                           { id: 'events', label: 'Event Format', icon: <ExternalLink size={16}/> },
                           { id: 'expansion', label: 'Expansion', icon: <Maximize2 size={16}/> },
                           { id: 'contact', label: 'Contact', icon: <Terminal size={16}/> },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className="w-full text-left px-4 py-3 hover:bg-[#000080] hover:text-white flex items-center gap-3 text-sm group focus:outline-none"
                            >
                                <span className="text-black group-hover:text-white">{item.icon}</span>
                                <span className="font-bold text-black group-hover:text-white">{item.label}</span>
                            </button>
                        ))}
                        
                        <button
                            onClick={() => {
                                setIsStartOpen(false);
                                setIsPaintOpen(true);
                                handleWindowClick('paint');
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-[#000080] hover:text-white flex items-center gap-3 text-sm group focus:outline-none"
                        >
                             <span className="text-black group-hover:text-white"><Palette size={16} /></span>
                             <span className="font-bold text-black group-hover:text-white">Paint</span>
                        </button>

                        <div className="border-t border-gray-500 border-b border-white my-1"></div>
                        <button onClick={onLaunch} className="w-full text-left px-4 py-3 hover:bg-[#000080] hover:text-white flex items-center gap-3 text-sm group focus:outline-none">
                             <span className="font-bold ml-7 text-black group-hover:text-white">Shut Down...</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RetroDesktop;
