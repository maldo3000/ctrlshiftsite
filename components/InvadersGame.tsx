import React, { useEffect, useRef } from 'react';

// A tiny Space Invaders for the /launch retro desktop. Everything runs on one
// canvas in a fixed logical resolution, scaled up with crisp pixels.

export const GAME_WIDTH = 240;
export const GAME_HEIGHT = 210;
const SCALE = 3;

const PLAYER_W = 13;
const PLAYER_H = 8;
const PLAYER_MAX_Y = GAME_HEIGHT - 26;
const PLAYER_MIN_Y = GAME_HEIGHT - 70;
const GROUND_Y = GAME_HEIGHT - 14;
const MARGIN = 6;

const HI_SCORE_KEY = 'ctrlshift-invaders-hi';

type Sprite = string[];
type InvaderType = 'squid' | 'crab' | 'octo';

const SPRITES: Record<InvaderType, [Sprite, Sprite]> = {
  squid: [
    ['...XX...', '..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '..X..X..', '.X.XX.X.', 'X.X..X.X'],
    ['...XX...', '..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '.X.XX.X.', 'X......X', '.X....X.'],
  ],
  crab: [
    ['..X.....X..', '...X...X...', '..XXXXXXX..', '.XX.XXX.XX.', 'XXXXXXXXXXX', 'X.XXXXXXX.X', 'X.X.....X.X', '...XX.XX...'],
    ['..X.....X..', 'X..X...X..X', 'X.XXXXXXX.X', 'XXX.XXX.XXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..X.....X..', '.X.......X.'],
  ],
  octo: [
    ['....XXXX....', '.XXXXXXXXXX.', 'XXXXXXXXXXXX', 'XXX..XX..XXX', 'XXXXXXXXXXXX', '...XX..XX...', '..XX.XX.XX..', 'XX........XX'],
    ['....XXXX....', '.XXXXXXXXXX.', 'XXXXXXXXXXXX', 'XXX..XX..XXX', 'XXXXXXXXXXXX', '..XXX..XXX..', '.XX..XX..XX.', '..XX....XX..'],
  ],
};

const PLAYER_SPRITE: Sprite = [
  '......X......', '.....XXX.....', '.....XXX.....', '.XXXXXXXXXXX.',
  'XXXXXXXXXXXXX', 'XXXXXXXXXXXXX', 'XXXXXXXXXXXXX', 'XXXXXXXXXXXXX',
];

const EXPLOSION_SPRITE: Sprite = [
  '.X...X...X.', '..X..X..X..', '...X...X...', 'XX.......XX', '...X...X...', '..X..X..X..', '.X...X...X.',
];

const POINTS: Record<InvaderType, number> = { squid: 30, crab: 20, octo: 10 };
const COLORS = ['#ff5cf0', '#c084fc', '#a78bfa', '#67e8f9', '#e9ffff'];
const COLS = 8;
const CELL_W = 18;
const CELL_H = 14;

interface Invader { x: number; y: number; type: InvaderType; color: string; alive: boolean }
interface Shot { x: number; y: number }
interface Burst { x: number; y: number; t: number; color: string }

interface GameState {
  score: number;
  lives: number;
  wave: number;
  px: number;
  py: number;
  invaders: Invader[];
  shots: Shot[];
  enemyShots: Shot[];
  bursts: Burst[];
  dir: 1 | -1;
  stepTimer: number;
  frame: 0 | 1;
  fireCooldown: number;
  enemyFireTimer: number;
  invulnerable: number;
  banner: { text: string; t: number } | null;
  over: boolean;
  overFor: number;
}

const spriteWidth = (type: InvaderType) => SPRITES[type][0][0].length;

const shuffle = <T,>(items: T[]) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Each wave shuffles which invader type and colour lands on which row.
const spawnWave = (wave: number): Invader[] => {
  const rowTypes = shuffle<InvaderType>(['squid', 'crab', 'crab', 'octo', 'octo']);
  const rowColors = shuffle(COLORS);
  const startX = (GAME_WIDTH - (COLS - 1) * CELL_W - 12) / 2;
  const startY = 26 + Math.min(wave - 1, 4) * 6;
  const invaders: Invader[] = [];
  rowTypes.forEach((type, row) => {
    for (let col = 0; col < COLS; col++) {
      invaders.push({
        x: startX + col * CELL_W + (12 - spriteWidth(type)) / 2,
        y: startY + row * CELL_H,
        type,
        color: rowColors[row],
        alive: true,
      });
    }
  });
  return invaders;
};

const newGame = (): GameState => ({
  score: 0,
  lives: 3,
  wave: 1,
  px: (GAME_WIDTH - PLAYER_W) / 2,
  py: PLAYER_MAX_Y,
  invaders: spawnWave(1),
  shots: [],
  enemyShots: [],
  bursts: [],
  dir: 1,
  stepTimer: 0,
  frame: 0,
  fireCooldown: 0,
  enemyFireTimer: 1.5,
  invulnerable: 0,
  banner: { text: 'WAVE 1', t: 1.2 },
  over: false,
  overFor: 0,
});

const readHiScore = () => {
  try {
    return Number(localStorage.getItem(HI_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeHiScore = (score: number) => {
  try {
    localStorage.setItem(HI_SCORE_KEY, String(score));
  } catch {
    /* storage unavailable: hi score just won't persist */
  }
};

const KEYMAP: Record<string, keyof Input> = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  Space: 'fire',
};

interface Input { left: boolean; right: boolean; up: boolean; down: boolean; fire: boolean }

interface InvadersGameProps {
  // Only the focused, visible window plays and listens to the keyboard.
  active: boolean;
  touchControls?: boolean;
}

const InvadersGame: React.FC<InvadersGameProps> = ({ active, touchControls = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const input = useRef<Input>({ left: false, right: false, up: false, down: false, fire: false });
  // A tap can press and release between two frames; queue it so it still fires.
  const fireQueued = useRef(false);

  useEffect(() => {
    activeRef.current = active;
    if (!active) input.current = { left: false, right: false, up: false, down: false, fire: false };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const action = KEYMAP[e.code];
      if (!action || !activeRef.current) return;
      e.preventDefault();
      input.current[action] = e.type === 'keydown';
      if (action === 'fire' && e.type === 'keydown' && !e.repeat) fireQueued.current = true;
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.width = GAME_WIDTH * SCALE;
    canvas.height = GAME_HEIGHT * SCALE;

    let state = newGame();
    let hiScore = readHiScore();
    let fireHeldSinceOver = true;
    let raf = 0;
    let last = performance.now();
    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * GAME_WIDTH,
      y: Math.random() * GROUND_Y,
      phase: Math.random() * Math.PI * 2,
    }));

    const drawSprite = (sprite: Sprite, x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      for (let row = 0; row < sprite.length; row++) {
        const line = sprite[row];
        for (let col = 0; col < line.length; col++) {
          if (line[col] === 'X') ctx.fillRect(Math.round(x) + col, Math.round(y) + row, 1, 1);
        }
      }
    };

    const text = (value: string, x: number, y: number, align: CanvasTextAlign = 'left', color = '#ffffff', size = 7) => {
      ctx.font = `bold ${size}px "Courier New", monospace`;
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.fillText(value, x, y);
    };

    const endGame = () => {
      state.over = true;
      state.overFor = 0;
      fireHeldSinceOver = input.current.fire;
      if (state.score > hiScore) {
        hiScore = state.score;
        writeHiScore(hiScore);
      }
    };

    const update = (dt: number) => {
      const keys = input.current;
      const firePressed = keys.fire || fireQueued.current;
      fireQueued.current = false;

      if (state.over) {
        state.overFor += dt;
        if (!keys.fire) fireHeldSinceOver = false;
        if (firePressed && !fireHeldSinceOver && state.overFor > 0.6) {
          state = newGame();
          fireHeldSinceOver = true;
        }
        return;
      }

      // Player
      const speed = 110;
      if (keys.left) state.px -= speed * dt;
      if (keys.right) state.px += speed * dt;
      if (keys.up) state.py -= speed * 0.6 * dt;
      if (keys.down) state.py += speed * 0.6 * dt;
      state.px = Math.max(MARGIN, Math.min(GAME_WIDTH - MARGIN - PLAYER_W, state.px));
      state.py = Math.max(PLAYER_MIN_Y, Math.min(PLAYER_MAX_Y, state.py));

      state.fireCooldown -= dt;
      if (firePressed && state.fireCooldown <= 0 && state.shots.length < 2) {
        state.shots.push({ x: state.px + 6, y: state.py - 3 });
        state.fireCooldown = 0.32;
      }

      state.invulnerable = Math.max(0, state.invulnerable - dt);
      state.bursts = state.bursts.filter(b => (b.t -= dt) > 0);
      if (state.banner && (state.banner.t -= dt) <= 0) state.banner = null;

      // Formation marches in steps, faster as it thins out and with each wave.
      const alive = state.invaders.filter(inv => inv.alive);
      const stepInterval = (0.05 + 0.55 * (alive.length / state.invaders.length)) / (1 + (state.wave - 1) * 0.15);
      state.stepTimer += dt;
      if (state.stepTimer >= stepInterval) {
        state.stepTimer = 0;
        state.frame = state.frame === 0 ? 1 : 0;
        const minX = Math.min(...alive.map(inv => inv.x));
        const maxX = Math.max(...alive.map(inv => inv.x + spriteWidth(inv.type)));
        const hitsEdge = state.dir > 0 ? maxX + 3 > GAME_WIDTH - MARGIN : minX - 3 < MARGIN;
        if (hitsEdge) {
          state.dir = state.dir > 0 ? -1 : 1;
          alive.forEach(inv => { inv.y += 6; });
        } else {
          alive.forEach(inv => { inv.x += 3 * state.dir; });
        }
        // Invaders win by reaching the ground line or touching the ship.
        const landed = alive.some(inv =>
          inv.y + 8 >= PLAYER_MAX_Y ||
          (inv.y + 8 >= state.py && inv.x < state.px + PLAYER_W && inv.x + spriteWidth(inv.type) > state.px)
        );
        if (landed) {
          state.lives = 0;
          endGame();
          return;
        }
      }

      // Player shots
      state.shots = state.shots.filter(shot => {
        shot.y -= 210 * dt;
        if (shot.y < 12) return false;
        const hit = alive.find(inv =>
          inv.alive &&
          shot.x >= inv.x && shot.x <= inv.x + spriteWidth(inv.type) &&
          shot.y <= inv.y + 8 && shot.y + 4 >= inv.y
        );
        if (!hit) return true;
        hit.alive = false;
        state.score += POINTS[hit.type] * state.wave;
        state.bursts.push({ x: hit.x, y: hit.y, t: 0.22, color: hit.color });
        return false;
      });

      // Enemy fire from the bottom invader of a random column
      state.enemyFireTimer -= dt;
      if (state.enemyFireTimer <= 0 && !state.banner && state.enemyShots.length < 2 + state.wave) {
        const shooters = alive.filter(inv =>
          inv.alive && !alive.some(o => o.alive && o !== inv && Math.abs(o.x - inv.x) < 6 && o.y > inv.y)
        );
        const shooter = shooters[Math.floor(Math.random() * shooters.length)];
        if (shooter) state.enemyShots.push({ x: shooter.x + spriteWidth(shooter.type) / 2, y: shooter.y + 8 });
        state.enemyFireTimer = (0.8 + Math.random() * 1.1) / (1 + (state.wave - 1) * 0.25);
      }

      const enemyShotSpeed = 80 + state.wave * 8;
      let playerHit = false;
      state.enemyShots = state.enemyShots.filter(shot => {
        shot.y += enemyShotSpeed * dt;
        if (shot.y > GROUND_Y) return false;
        const hitsPlayer =
          state.invulnerable <= 0 &&
          shot.x >= state.px && shot.x <= state.px + PLAYER_W &&
          shot.y + 5 >= state.py && shot.y <= state.py + PLAYER_H;
        if (!hitsPlayer || playerHit) return true;
        playerHit = true;
        state.lives -= 1;
        state.invulnerable = 1.5;
        state.bursts.push({ x: state.px + 1, y: state.py, t: 0.4, color: '#4ade80' });
        return false;
      });
      if (playerHit) state.enemyShots = [];
      if (state.lives <= 0) {
        endGame();
        return;
      }

      if (state.invaders.every(inv => !inv.alive)) {
        state.wave += 1;
        state.invaders = spawnWave(state.wave);
        state.shots = [];
        state.enemyShots = [];
        state.dir = 1;
        state.banner = { text: `WAVE ${state.wave}`, t: 1.2 };
      }
    };

    const draw = (now: number) => {
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.fillStyle = '#05030d';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      stars.forEach(star => {
        ctx.globalAlpha = 0.25 + 0.35 * (Math.sin(now / 600 + star.phase) + 1) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(star.x, star.y, 1, 1);
      });
      ctx.globalAlpha = 1;

      text(`SCORE ${String(state.score).padStart(5, '0')}`, MARGIN, 11);
      text(`HI ${String(Math.max(hiScore, state.score)).padStart(5, '0')}`, GAME_WIDTH - MARGIN, 11, 'right');

      state.invaders.forEach(inv => {
        if (inv.alive) drawSprite(SPRITES[inv.type][state.frame], inv.x, inv.y, inv.color);
      });
      state.bursts.forEach(b => drawSprite(EXPLOSION_SPRITE, b.x, b.y, b.color));

      const blink = state.invulnerable > 0 && Math.floor(now / 100) % 2 === 0;
      if (!state.over && !blink) drawSprite(PLAYER_SPRITE, state.px, state.py, '#4ade80');

      ctx.fillStyle = '#ffffff';
      state.shots.forEach(shot => ctx.fillRect(Math.round(shot.x), Math.round(shot.y), 1, 4));
      ctx.fillStyle = '#fde047';
      state.enemyShots.forEach(shot => {
        const wiggle = Math.floor(shot.y / 3) % 2;
        ctx.fillRect(Math.round(shot.x) + wiggle, Math.round(shot.y), 1, 2);
        ctx.fillRect(Math.round(shot.x) + 1 - wiggle, Math.round(shot.y) + 2, 1, 3);
      });

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 1);
      text(String(Math.max(0, state.lives)), MARGIN, GAME_HEIGHT - 4, 'left', '#4ade80');
      for (let i = 0; i < state.lives - 1; i++) {
        drawSprite(PLAYER_SPRITE, MARGIN + 10 + i * 17, GROUND_Y + 3, '#4ade80');
      }
      text('CTRL+SHIFT', GAME_WIDTH - MARGIN, GAME_HEIGHT - 4, 'right', '#6b21a8', 6);

      const centerX = GAME_WIDTH / 2;
      if (state.banner) text(state.banner.text, centerX, GAME_HEIGHT / 2 + 20, 'center', '#fde047', 9);

      const overlay = (title: string, subtitle: string, color: string) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        text(title, centerX, GAME_HEIGHT / 2 - 4, 'center', color, 14);
        text(subtitle, centerX, GAME_HEIGHT / 2 + 12, 'center', '#ffffff', 7);
      };

      if (state.over) {
        overlay('GAME OVER', touchControls ? 'TAP FIRE TO PLAY AGAIN' : 'PRESS SPACE TO PLAY AGAIN', '#ff5cf0');
      } else if (!activeRef.current) {
        overlay('PAUSED', touchControls ? 'TAP TO KEEP PLAYING' : 'CLICK TO KEEP PLAYING', '#fde047');
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (activeRef.current) update(dt);
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [touchControls]);

  const hold = (action: keyof Input) => ({
    onPointerDown: (e: React.PointerEvent) => {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture is a nicety: releases still arrive via pointerup */
      }
      input.current[action] = true;
      if (action === 'fire') fireQueued.current = true;
    },
    onPointerUp: () => { input.current[action] = false; },
    onPointerCancel: () => { input.current[action] = false; },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const touchButton =
    'h-12 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black text-black font-bold text-sm ' +
    'active:border-t-black active:border-l-black active:border-r-white active:border-b-white active:bg-[#b0b0b0] touch-none select-none';

  return (
    <div className="flex flex-col gap-1">
      <canvas
        ref={canvasRef}
        className="block w-full bg-black"
        style={{ aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`, imageRendering: 'pixelated' }}
        aria-label="CTRL+SHIFT Invaders game"
      />
      {touchControls && (
        <div className="grid grid-cols-3 gap-1">
          <button type="button" className={touchButton} aria-label="Move left" {...hold('left')}>◀</button>
          <button type="button" className={touchButton} {...hold('fire')}>FIRE</button>
          <button type="button" className={touchButton} aria-label="Move right" {...hold('right')}>▶</button>
        </div>
      )}
    </div>
  );
};

export default InvadersGame;
