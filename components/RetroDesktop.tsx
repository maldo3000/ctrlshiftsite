import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Minus, Maximize2, Youtube, Twitter, Instagram, Terminal, Folder, ExternalLink } from 'lucide-react';

interface RetroDesktopProps {
  onLaunch: () => void;
}

const RetroDesktop: React.FC<RetroDesktopProps> = ({ onLaunch }) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState('');
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();
  
  // Window state
  const [windowSize, setWindowSize] = useState({ width: 400, height: 200 });
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (id: string) => {
    setIsStartOpen(false);
    onLaunch();
    // Increased delay to match the new longer portal animation in App.tsx
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  };

  const DesktopIcon = ({ icon: Icon, label, color = "text-blue-600", onClick }: any) => (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      className="flex flex-col items-center gap-1 w-24 p-2 cursor-pointer group absolute text-center"
      style={{ 
        top: Math.random() * 200 + 60, 
        left: Math.random() * 100 + 20 
      }}
      onDoubleClick={onClick}
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
  
  return (
    <div className="fixed inset-0 z-50 bg-[#008080] overflow-hidden font-sans select-none" ref={constraintsRef}>
      
      {/* Desktop Icons Layer */}
      <div className="absolute inset-0 p-10 z-0 pointer-events-auto">
         <DesktopIcon 
            icon={Youtube} 
            label="YouTube.exe" 
            color="text-red-600" 
            onClick={() => window.open('#', '_blank')} 
         />
         <DesktopIcon 
            icon={Twitter} 
            label="X_Client.lnk" 
            color="text-black" 
            onClick={() => window.open('#', '_blank')} 
         />
         <DesktopIcon 
            icon={Instagram} 
            label="Insta_Bot.bat" 
            color="text-pink-600" 
            onClick={() => window.open('#', '_blank')} 
         />
         
         <motion.div
            drag
            dragConstraints={constraintsRef}
            className="absolute top-1/2 right-20 flex flex-col items-center gap-1 w-24 cursor-pointer group"
         >
             <div className="w-10 h-10 flex items-center justify-center">
                 <Folder className="w-10 h-10 text-yellow-500 fill-yellow-500 drop-shadow-md" />
             </div>
             <span className="text-white text-xs font-bold bg-blue-900/50 px-1 mt-1 border border-transparent group-hover:border-white/50 group-hover:bg-blue-800">My Documents</span>
         </motion.div>
      </div>

      {/* Main Center Window (Draggable & Resizable) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <motion.div 
            drag
            dragListener={false} // Only drag from the header
            dragControls={dragControls}
            dragMomentum={false}
            dragConstraints={constraintsRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ width: windowSize.width, height: windowSize.height }}
            className={`pointer-events-auto bg-[#c0c0c0] ${windowBorder} shadow-[8px_8px_0px_rgba(0,0,0,0.3)] flex flex-col relative`}
        >
            {/* Title Bar */}
            <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="bg-[#000080] px-1 py-0.5 flex items-center justify-between cursor-default select-none h-8 flex-shrink-0"
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
      </div>

      {/* Taskbar (Top as requested) */}
      <div className={`absolute top-0 left-0 right-0 h-10 bg-[#c0c0c0] border-b-2 border-white shadow-md z-50 flex items-center px-1 justify-between ${windowBorder} border-b-black border-r-black pointer-events-auto`}>
        
        <div className="flex items-center gap-2 h-full py-1">
            <button 
                onClick={() => setIsStartOpen(!isStartOpen)}
                className={`h-full px-2 flex items-center gap-1 font-bold ${isStartOpen ? insetBorder + ' bg-[#b0b0b0]' : windowBorder} active:bg-[#b0b0b0] focus:outline-none`}
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Windows_logo_and_wordmark_-_1995-2001.svg/512px-Windows_logo_and_wordmark_-_1995-2001.svg.png" alt="Win" className="w-5 h-auto opacity-80" />
                <span className="ml-1 text-sm text-black">Start</span>
            </button>
            
            <div className="h-full w-px bg-gray-500 mx-1"></div>
            <div className="h-full w-px bg-white mx-1"></div>
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