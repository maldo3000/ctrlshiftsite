import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, RotateCcw, Ticket, Users, X } from 'lucide-react';

// CTRL+SHIFT VOL. XIII @ Stan — live raffle drawer.
// Pulls the approved guest list from Luma via /api/raffle/guests and draws
// winners on stage. Winners persist in localStorage so a refresh mid-event
// doesn't lose them.

const EVENT_SLUG = 'vol-13';
const PRIZE_COUNT = 3;
const STORAGE_KEY = 'ctrlshift-raffle-vol-13-winners';

// Vol XIII poster palette: cream ground, ink type, salmon-pink numerals,
// Stan purple accent.
const INK = '#161412';
const CREAM = '#EFE9DE';
const PINK = '#E89AAC';
const PURPLE = '#6A4DF4';

interface Guest {
  id: string;
  name: string;
  checked_in: boolean;
}

interface GuestsResponse {
  guests: Guest[];
  count: number;
}

function loadStoredWinners(): Guest[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storeWinners(winners: Guest[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(winners));
  } catch {
    // storage unavailable — winners just won't survive a refresh
  }
}

function randomIndex(max: number): number {
  const buffer = new Uint32Array(1);
  window.crypto.getRandomValues(buffer);
  return buffer[0] % max;
}

const CONFETTI_COLORS = [PINK, PURPLE, INK, '#ffffff'];

const ConfettiBurst: React.FC<{ seed: number }> = ({ seed }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: `${seed}-${i}`,
        x: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 2.4 + Math.random() * 1.6,
        rotate: (Math.random() - 0.5) * 720,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]
      })),
    [seed]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ x: `${piece.x}vw`, y: '-6vh', rotate: 0, opacity: 1 }}
          animate={{ y: '106vh', rotate: piece.rotate, opacity: [1, 1, 0.8] }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
          className="absolute top-0 left-0 block"
          style={{
            width: piece.size,
            height: piece.size * 0.45,
            backgroundColor: piece.color
          }}
        />
      ))}
    </div>
  );
};

const RaffleVol13Page: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [manualNames, setManualNames] = useState('');
  const [checkedInOnly, setCheckedInOnly] = useState(false);
  const [winners, setWinners] = useState<Guest[]>(() => loadStoredWinners());
  const [drawing, setDrawing] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [revealedWinner, setRevealedWinner] = useState<Guest | null>(null);
  const [confettiSeed, setConfettiSeed] = useState(0);
  const shuffleTimer = useRef<number | null>(null);

  const fetchGuests = useCallback(async () => {
    setLoadState('loading');
    setLoadError('');
    try {
      const response = await fetch(`/api/raffle/guests?event=${EVENT_SLUG}`);
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }
      setGuests((payload as GuestsResponse).guests);
      setLoadState('ready');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not reach the guest list');
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    fetchGuests();
    return () => {
      if (shuffleTimer.current !== null) {
        window.clearTimeout(shuffleTimer.current);
      }
    };
  }, [fetchGuests]);

  useEffect(() => {
    storeWinners(winners);
  }, [winners]);

  const manualGuests = useMemo<Guest[]>(
    () =>
      manualNames
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((name, index) => ({ id: `manual-${index}-${name}`, name, checked_in: true })),
    [manualNames]
  );

  const activeGuests = loadState === 'error' ? manualGuests : guests;
  const winnerIds = useMemo(() => new Set(winners.map((winner) => winner.id)), [winners]);
  const pool = useMemo(
    () =>
      activeGuests.filter(
        (guest) => !winnerIds.has(guest.id) && (!checkedInOnly || guest.checked_in)
      ),
    [activeGuests, winnerIds, checkedInOnly]
  );

  const drawWinner = useCallback(() => {
    if (drawing || pool.length === 0 || winners.length >= PRIZE_COUNT) return;

    const winner = pool[randomIndex(pool.length)];
    setDrawing(true);
    setRevealedWinner(null);

    const start = performance.now();
    const SHUFFLE_MS = 3400;

    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= SHUFFLE_MS) {
        setDisplayName(winner.name);
        setRevealedWinner(winner);
        setWinners((current) => [...current, winner]);
        setConfettiSeed((seed) => seed + 1);
        setDrawing(false);
        return;
      }
      setDisplayName(pool[randomIndex(pool.length)].name);
      // Ease out: fast flicker at first, slow ticks near the end.
      const progress = elapsed / SHUFFLE_MS;
      const delay = 40 + progress * progress * 360;
      shuffleTimer.current = window.setTimeout(tick, delay);
    };

    tick();
  }, [drawing, pool, winners.length]);

  const removeWinner = (id: string) => {
    setWinners((current) => current.filter((winner) => winner.id !== id));
    if (revealedWinner?.id === id) {
      setRevealedWinner(null);
      setDisplayName(null);
    }
  };

  const resetRaffle = () => {
    if (!window.confirm('Clear all drawn winners and start over?')) return;
    setWinners([]);
    setRevealedWinner(null);
    setDisplayName(null);
  };

  const allPrizesDrawn = winners.length >= PRIZE_COUNT;

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {confettiSeed > 0 && <ConfettiBurst seed={confettiSeed} />}

      {/* Giant XIII backdrop, straight off the vol 13 poster */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden select-none"
      >
        <span
          className="font-syne font-extrabold leading-none"
          style={{
            fontSize: 'min(58vw, 34rem)',
            color: PINK,
            opacity: 0.28,
            letterSpacing: '-0.05em'
          }}
        >
          XIII
        </span>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-6" style={{ borderColor: INK }}>
          <div>
            <a
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> ctrlshift.to
            </a>
            <h1 className="font-syne text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-6xl">
              Ctrl+<br />Shift
            </h1>
            <p className="mt-2 font-syne text-sm font-bold uppercase tracking-[0.25em]" style={{ color: PURPLE }}>
              Vol. XIII @ Stan — Raffle
            </p>
          </div>
          <div className="text-right text-xs uppercase tracking-[0.2em] opacity-70">
            <p>Friday, Aug 28</p>
            <p>Toronto, ON</p>
            <p className="mt-2 inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {loadState === 'loading' ? '—' : `${pool.length} in the draw`}
            </p>
          </div>
        </header>

        {/* Main draw area */}
        <main className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          {loadState === 'loading' && (
            <p className="font-syne text-xl font-bold uppercase tracking-widest opacity-60">
              Pulling the guest list…
            </p>
          )}

          {loadState === 'error' && (
            <div className="mb-10 w-full max-w-lg text-left">
              <p className="mb-2 text-sm font-semibold" style={{ color: PURPLE }}>
                Couldn't reach Luma ({loadError}). Paste names below — one per line — or{' '}
                <button type="button" onClick={fetchGuests} className="underline">
                  retry
                </button>
                .
              </p>
              <textarea
                value={manualNames}
                onChange={(event) => setManualNames(event.target.value)}
                rows={6}
                placeholder={'Ada Lovelace\nGrace Hopper\n…'}
                className="w-full rounded-lg border-2 bg-white/70 p-3 font-mono text-sm outline-none"
                style={{ borderColor: INK }}
              />
            </div>
          )}

          {loadState !== 'loading' && (
            <>
              <div className="flex min-h-[7rem] items-center justify-center sm:min-h-[9rem]">
                <AnimatePresence mode="popLayout">
                  {displayName ? (
                    <motion.p
                      key={revealedWinner ? `winner-${revealedWinner.id}` : 'shuffling'}
                      initial={revealedWinner ? { scale: 0.85, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      className="font-syne px-4 text-4xl font-extrabold uppercase leading-tight sm:text-6xl"
                      style={revealedWinner ? { color: PURPLE } : undefined}
                    >
                      {displayName}
                    </motion.p>
                  ) : (
                    <p className="font-syne px-4 text-2xl font-bold uppercase tracking-widest opacity-40 sm:text-3xl">
                      {allPrizesDrawn ? 'All prizes drawn' : 'Who takes prize ' + (winners.length + 1) + '?'}
                    </p>
                  )}
                </AnimatePresence>
              </div>

              {revealedWinner && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm font-semibold uppercase tracking-[0.3em]"
                >
                  Winner — Prize {winners.length}
                </motion.p>
              )}

              <button
                type="button"
                onClick={drawWinner}
                disabled={drawing || pool.length === 0 || allPrizesDrawn}
                className="mt-10 inline-flex items-center gap-3 rounded-full px-10 py-5 font-syne text-lg font-bold uppercase tracking-widest text-white transition-transform enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: INK }}
              >
                <Ticket className="h-5 w-5" style={{ color: PINK }} />
                {drawing
                  ? 'Drawing…'
                  : allPrizesDrawn
                    ? 'Raffle complete'
                    : `Draw prize ${winners.length + 1} of ${PRIZE_COUNT}`}
              </button>

              <label className="mt-6 inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-70">
                <input
                  type="checkbox"
                  checked={checkedInOnly}
                  onChange={(event) => setCheckedInOnly(event.target.checked)}
                  className="h-4 w-4 accent-current"
                />
                Checked-in guests only
              </label>
            </>
          )}
        </main>

        {/* Winners board */}
        <footer className="border-t pt-6 pb-4" style={{ borderColor: INK }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-syne text-sm font-bold uppercase tracking-[0.3em]">Winners</h2>
            {winners.length > 0 && (
              <button
                type="button"
                onClick={resetRaffle}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: PRIZE_COUNT }, (_, index) => {
              const winner = winners[index];
              return (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-xl border-2 px-4 py-3"
                  style={{
                    borderColor: winner ? PURPLE : INK,
                    backgroundColor: winner ? 'rgba(255,255,255,0.65)' : 'transparent',
                    opacity: winner ? 1 : 0.45
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
                      Prize {index + 1}
                    </p>
                    <p className="truncate font-syne font-bold">
                      {winner ? winner.name : 'Not drawn yet'}
                    </p>
                  </div>
                  {winner ? (
                    <button
                      type="button"
                      onClick={() => removeWinner(winner.id)}
                      title="Remove winner (e.g. not in the room) and free the slot"
                      className="ml-3 shrink-0 rounded-full p-1.5 hover:bg-black/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <Check className="ml-3 h-4 w-4 shrink-0 opacity-0" />
                  )}
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] opacity-50">
            Brought to you by CTRL+SHIFT and Stan
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RaffleVol13Page;
