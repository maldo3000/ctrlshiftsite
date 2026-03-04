import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSponsorReportData } from '../data/useSponsorReportData';

function formatDate(value: string | undefined) {
  if (!value) return 'n/a';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'n/a';
  return date.toLocaleString('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function formatPercent(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'n/a';
  return `${value.toFixed(1)}%`;
}

export default function SponsorsLandingPage() {
  const { data } = useSponsorReportData('vol-9');

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-200/80">Reports</p>
        <h1 className="mt-2 font-syne text-4xl tracking-tight text-white">Sponsor Performance Reports</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
          Access post-event insights for each CTRL + SHIFT volume including financial outcomes, audience composition and sponsor-safe CRM highlights.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          to="/sponsors/vol-9"
          className="group rounded-2xl border border-white/10 bg-black/50 p-5 transition hover:border-emerald-300/50 hover:bg-black/70"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-syne text-2xl tracking-tight text-white">Volume 9</h2>
            <ArrowRight className="text-zinc-400 transition group-hover:text-emerald-200" size={18} />
          </div>

          <p className="mt-2 text-sm text-zinc-300">Creative Tech Meetup report and sponsor package</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-zinc-400">Approved</p>
              <p className="mt-1 text-lg font-semibold text-white">{data?.audience.approvedCount ?? '...'}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-zinc-400">Show Rate</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatPercent(data?.audience.showRate)}</p>
            </div>
          </div>

          <p className="mt-5 text-xs text-zinc-400">Data refreshed: {formatDate(data?.generatedAt)}</p>
        </Link>
      </div>
    </main>
  );
}
