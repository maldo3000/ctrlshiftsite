import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSponsorAuth } from '../auth';

export default function SponsorLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useSponsorAuth();

  const nextPath = useMemo(() => {
    const next = searchParams.get('next');
    if (!next || !next.startsWith('/sponsors')) {
      return '/sponsors';
    }
    return next;
  }, [searchParams]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? 'Password did not match');
      return;
    }

    navigate(nextPath, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(244,63,94,0.12),transparent_40%),#040404] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/65 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/80">Sponsor Access</p>
        <h1 className="font-syne text-3xl tracking-tight text-white">CTRL + SHIFT</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          Enter the shared sponsor password to access reports, spend details and audience insights.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-zinc-300" htmlFor="sponsor-password">
            Password
          </label>
          <input
            id="sponsor-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none ring-emerald-300/60 transition focus:ring"
            placeholder="Enter sponsor password"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="rounded-lg border border-rose-300/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Checking...' : 'Enter portal'}
          </button>
        </form>

        <Link to="/" className="mt-5 inline-block text-xs text-zinc-400 hover:text-zinc-200">
          Back to controlshift.community
        </Link>
      </div>
    </div>
  );
}
