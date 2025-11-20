
import React, { useEffect, useRef, useState } from 'react';

const KeyboardInteraction: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Track pressed state for each key ID
  const [pressedState, setPressedState] = useState<Record<string, boolean>>({
    one: false,
    two: false,
    three: false
  });

  // Configuration for key mappings
  const config = useRef({
    one: { key: 'o', id: 'one' },
    two: { key: 'g', id: 'two' },
    three: { key: 'Enter', id: 'three' }
  });

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      Object.values(config.current).forEach((item: { key: string; id: string }) => {
        if (e.key === item.key) {
          handlePress(item.id);
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      Object.values(config.current).forEach((item: { key: string; id: string }) => {
        if (e.key === item.key) {
          handleRelease(item.id);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { /* Ignore autoplay errors */ });
    }
  };

  const handlePress = (id: string) => {
    setPressedState(prev => {
        if (!prev[id]) playSound();
        return { ...prev, [id]: true };
    });
  };

  const handleRelease = (id: string) => {
    setPressedState(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="keyboard-interaction-container w-full flex justify-center items-center">
      <style>{`
        .keypad {
          position: relative;
          aspect-ratio: 400 / 310;
          display: flex;
          place-items: center;
          width: clamp(280px, 100%, 400px);
          transition-property: translate, transform;
          transition-duration: 0.26s;
          transition-timing-function: ease-out;
          transform-style: preserve-3d;
          --travel: 20;
        }

        .key {
          transform-style: preserve-3d;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          outline: none;
          appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .key[data-pressed='true'],
        .key:active {
          --pressed: 1;
        }

        .key[data-pressed='true'] .key__content,
        .key:active .key__content {
          translate: 0 calc(var(--travel) * 1%);
        }

        .key__content {
          width: 100%;
          display: inline-block;
          height: 100%;
          transition: translate 0.12s ease-out;
          container-type: inline-size;
          position: relative;
        }

        .keypad__single .key__text {
          width: 52%;
          height: 62%;
          translate: 45% -16%;
        }

        .key__text {
          height: 46%;
          width: 86%;
          position: absolute;
          font-size: 12cqi;
          z-index: 21;
          top: 5%;
          left: 0;
          mix-blend-mode: normal;
          color: hsl(0 0% 94%);
          translate: 8% 10%;
          transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
          text-align: left;
          padding: 1ch;
          pointer-events: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
        }

        .keypad__single {
          position: absolute;
          width: 40.5%;
          left: 54%;
          bottom: 36%;
          height: 46%;
          clip-path: polygon(
            0 0,
            54% 0,
            89% 24%,
            100% 70%,
            54% 100%,
            46% 100%,
            0 69%,
            12% 23%,
            47% 0%
          );
          mask: url(https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86) 50% 50% / 100% 100%;
          -webkit-mask: url(https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86) 50% 50% / 100% 100%;
        }

        .keypad__single--left {
          left: 29.3%;
          bottom: 54.2%;
        }

        .keypad__single .key__text {
           font-size: 18cqi;
        }

        .keypad__single img {
          top: 0;
          opacity: 1;
          width: 96%;
          position: absolute;
          left: 50%;
          translate: -50% 1%;
        }

        .key__mask {
          width: 100%;
          height: 100%;
          display: inline-block;
        }

        .keypad__double {
          position: absolute;
          background: transparent;
          width: 64%;
          height: 65%;
          left: 6%;
          bottom: 17.85%;
          clip-path: polygon(
            34% 0,
            93% 44%,
            101% 78%,
            71% 100%,
            66% 100%,
            0 52%,
            0 44%,
            7% 17%,
            30% 0
          );
          mask: url(https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86) 50% 50% / 100% 100%;
          -webkit-mask: url(https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86) 50% 50% / 100% 100%;
        }

        .keypad__double img {
          top: 0;
          opacity: 1;
          width: 99%;
          position: absolute;
          left: 50%;
          translate: -50% 1%;
        }

        .key img {
          filter: hue-rotate(calc(var(--hue, 0) * 1deg))
            saturate(var(--saturate, 1)) brightness(var(--brightness, 1));
        }

        .keypad__base {
          position: absolute;
          bottom: 0;
          width: 100%;
          pointer-events: none;
        }
        
        .keypad img {
          transition: translate 0.12s ease-out;
          width: 100%;
          display: block;
        }
      `}</style>

      <div className="keypad">
        <div className="keypad__base">
          <img src="https://assets.codepen.io/605876/keypad-base.png?format=auto&quality=86" alt="" />
        </div>
        
        {/* Key One (Left) - "ctrl" */}
        <button 
            id="one" 
            className="key keypad__single keypad__single--left"
            data-pressed={pressedState.one}
            onPointerDown={() => handlePress('one')}
            onPointerUp={() => handleRelease('one')}
            onPointerLeave={() => handleRelease('one')}
            style={{
                '--hue': 0,
                '--saturate': 1.4,
                '--brightness': 1.2,
                '--travel': 26
            } as React.CSSProperties}
        >
          <span className="key__mask">
            <span className="key__content">
              <span className="key__text">ctrl</span>
              <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
            </span>
          </span>
        </button>

        {/* Key Two (Right) - "+" */}
        <button 
            id="two" 
            className="key keypad__single"
            data-pressed={pressedState.two}
            onPointerDown={() => handlePress('two')}
            onPointerUp={() => handleRelease('two')}
            onPointerLeave={() => handleRelease('two')}
            style={{
                '--hue': 0,
                '--saturate': 0,
                '--brightness': 1.4,
                '--travel': 26
            } as React.CSSProperties}
        >
          <span className="key__mask">
            <span className="key__content">
              <span className="key__text">+</span>
              <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt="" />
            </span>
          </span>
        </button>

        {/* Key Three (Bottom) - "shift" */}
        <button 
            id="three" 
            className="key keypad__double"
            data-pressed={pressedState.three}
            onPointerDown={() => handlePress('three')}
            onPointerUp={() => handleRelease('three')}
            onPointerLeave={() => handleRelease('three')}
            style={{
                '--hue': 0,
                '--saturate': 0,
                '--brightness': 0.4,
                '--travel': 18
            } as React.CSSProperties}
        >
          <span className="key__mask">
            <span className="key__content">
              <span className="key__text">shift</span>
              <img src="https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86" alt="" />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default KeyboardInteraction;
