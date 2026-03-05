import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  type Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Download, ExternalLink, Filter, Menu, X } from 'lucide-react';
import { useSponsorReportData } from '../data/useSponsorReportData';
import type { AudienceAttendee, FinancialLineItem } from '../types';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'program-recap', label: 'Program Recap' },
  { id: 'activations', label: 'Activations' },
  { id: 'financials', label: 'Financials' },
  { id: 'audience', label: 'Audience' },
  { id: 'crm-highlights', label: 'CRM Highlights' },
  { id: 'media', label: 'Media' },
  { id: 'next-steps', label: 'Next Steps' }
] as const;

type SectionId = (typeof NAV_ITEMS)[number]['id'];
type ChartDatum = {
  name: string;
  value: number;
  color: string;
};

const PIE_COLORS = ['#5EEAD4', '#22D3EE', '#F9A8D4', '#FDE68A', '#C4B5FD', '#FDBA74', '#86EFAC', '#93C5FD'];
const SECTION_CARD_CLASS =
  'scroll-mt-28 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/35 p-6';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 2
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function withChartColors(data: { name: string; value: number }[]) {
  return data.map((item, index) => ({
    ...item,
    color: PIE_COLORS[index % PIE_COLORS.length]
  }));
}

function ChartLegend({
  data,
  formatValue
}: {
  data: ChartDatum[];
  formatValue?: (value: number) => string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-3 text-xs">
            <span className="inline-flex min-w-0 items-center gap-2 text-zinc-300">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="shrink-0 font-medium text-zinc-100">
              {formatValue ? formatValue(item.value) : item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PieTooltip({
  active,
  payload,
  valueFormatter
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { color?: string } }>;
  valueFormatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const current = payload[0];
  const value = typeof current.value === 'number' ? current.value : 0;

  return (
    <div className="rounded-lg border border-white/15 bg-black/90 px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-300">{current.name}</p>
      <p className="mt-1 font-medium text-zinc-100">{valueFormatter ? valueFormatter(value) : value}</p>
    </div>
  );
}

function InstagramEmbed({ permalink }: { permalink: string }) {
  useEffect(() => {
    const processEmbeds = () => {
      (
        window as Window & {
          instgrm?: { Embeds?: { process?: () => void } };
        }
      ).instgrm?.Embeds?.process?.();
    };

    const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (existingScript) {
      processEmbeds();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = processEmbeds;
    document.body.appendChild(script);
  }, [permalink]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{
        margin: '0 auto',
        maxWidth: 540,
        minWidth: 280,
        width: '100%',
        background: '#101114',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.12)'
      }}
    >
      <a href={permalink} target="_blank" rel="noopener noreferrer">
        View this post on Instagram
      </a>
    </blockquote>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">{label}</p>
      <p className="mt-2 font-syne text-3xl tracking-tight text-white">{value}</p>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items.length) {
    return <span className="text-zinc-500">n/a</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, 4).map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function DataTable<TData>({
  table,
  emptyLabel
}: {
  table: Table<TData>;
  emptyLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/[0.02] text-left text-xs uppercase tracking-[0.1em] text-zinc-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-3 py-2.5 font-medium">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-white/10 bg-black/20 text-zinc-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 align-top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={table.getAllColumns().length} className="px-3 py-5 text-center text-zinc-400">
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function scrollToAnchor(anchorId: string) {
  const element = document.getElementById(anchorId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${anchorId}`);
  }
}

function useActiveSection(isEnabled: boolean) {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      return;
    }

    let rafId = 0;
    const updateActiveFromScroll = () => {
      const threshold = 170;
      let current = sections[0]?.id ?? 'overview';

      for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        if (top <= threshold) {
          current = section.id;
        } else {
          break;
        }
      }
      setActiveSection(current as SectionId);
    };

    const onScroll = () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        updateActiveFromScroll();
        rafId = 0;
      });
    };

    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (NAV_ITEMS.some((item) => item.id === hash)) {
        setActiveSection(hash as SectionId);
      }
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onHashChange);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [isEnabled]);

  return { activeSection, setActiveSection };
}

export default function SponsorVol9ReportPage() {
  const { data, loading, error } = useSponsorReportData('vol-9');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('all');

  const [audienceSearch, setAudienceSearch] = useState('');
  const [checkedInFilter, setCheckedInFilter] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [toolFilter, setToolFilter] = useState('all');

  const { activeSection, setActiveSection } = useActiveSection(Boolean(data) && !loading);
  const expenseDonutData = useMemo(() => withChartColors(data?.financials.expensesByCategory ?? []), [data]);
  const toolsDonutData = useMemo(
    () => withChartColors(data?.audience.toolsDistribution.slice(0, 8) ?? []),
    [data]
  );

  const expenseCategories = useMemo(
    () => ['all', ...new Set(data?.financials.lineItems.map((item) => item.category) ?? [])],
    [data?.financials.lineItems]
  );

  const filteredExpenseLineItems = useMemo(() => {
    if (!data) return [];

    const query = expenseSearch.trim().toLowerCase();

    return data.financials.lineItems.filter((item) => {
      const matchesCategory = expenseCategory === 'all' || item.category === expenseCategory;
      const matchesSearch =
        !query ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [data, expenseCategory, expenseSearch]);

  const attendeeRoleOptions = useMemo(
    () => ['all', ...new Set(data?.audience.attendees.flatMap((attendee) => attendee.roles) ?? [])],
    [data?.audience.attendees]
  );

  const attendeeInterestOptions = useMemo(
    () => ['all', ...new Set(data?.audience.attendees.flatMap((attendee) => attendee.interests) ?? [])],
    [data?.audience.attendees]
  );

  const attendeeToolOptions = useMemo(
    () => ['all', ...new Set(data?.audience.attendees.flatMap((attendee) => attendee.tools) ?? [])],
    [data?.audience.attendees]
  );

  const filteredAttendees = useMemo(() => {
    if (!data) return [];

    const query = audienceSearch.trim().toLowerCase();

    return data.audience.attendees.filter((attendee) => {
      const matchesSearch =
        !query ||
        attendee.name.toLowerCase().includes(query) ||
        attendee.role.toLowerCase().includes(query) ||
        attendee.interests.join(' ').toLowerCase().includes(query) ||
        attendee.tools.join(' ').toLowerCase().includes(query);

      const matchesCheckIn =
        checkedInFilter === 'all' ||
        (checkedInFilter === 'checked-in' ? attendee.checkedIn : !attendee.checkedIn);

      const matchesRole = roleFilter === 'all' || attendee.roles.includes(roleFilter);
      const matchesInterest = interestFilter === 'all' || attendee.interests.includes(interestFilter);
      const matchesTool = toolFilter === 'all' || attendee.tools.includes(toolFilter);

      return matchesSearch && matchesCheckIn && matchesRole && matchesInterest && matchesTool;
    });
  }, [data, audienceSearch, checkedInFilter, roleFilter, interestFilter, toolFilter]);

  const expenseColumnHelper = createColumnHelper<FinancialLineItem>();
  const expenseColumns = useMemo(
    () => [
      expenseColumnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => info.getValue()
      }),
      expenseColumnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => <span className="text-zinc-200">{info.getValue()}</span>
      }),
      expenseColumnHelper.accessor('amount', {
        header: 'Amount',
        cell: (info) => <span className="font-medium text-zinc-100">{formatCurrency(info.getValue())}</span>
      })
    ],
    [expenseColumnHelper]
  );

  const expenseTable = useReactTable({
    data: filteredExpenseLineItems,
    columns: expenseColumns,
    getCoreRowModel: getCoreRowModel()
  });

  const attendeeColumnHelper = createColumnHelper<AudienceAttendee>();
  const attendeeColumns = useMemo(
    () => [
      attendeeColumnHelper.accessor('name', {
        header: 'Attendee',
        cell: (info) => <span className="font-medium text-zinc-100">{info.getValue()}</span>
      }),
      attendeeColumnHelper.accessor('checkedIn', {
        header: 'Checked In',
        cell: (info) => (
          <span className={info.getValue() ? 'text-emerald-200' : 'text-zinc-400'}>
            {info.getValue() ? 'Yes' : 'No'}
          </span>
        )
      }),
      attendeeColumnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => info.getValue()
      }),
      attendeeColumnHelper.accessor('interests', {
        header: 'Interests',
        cell: (info) => <TagList items={info.getValue()} />
      }),
      attendeeColumnHelper.accessor('tools', {
        header: 'Tools',
        cell: (info) => <TagList items={info.getValue()} />
      })
    ],
    [attendeeColumnHelper]
  );

  const attendeeTable = useReactTable({
    data: filteredAttendees,
    columns: attendeeColumns,
    getCoreRowModel: getCoreRowModel()
  });

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-12 text-zinc-300 sm:px-6">
        Loading Volume 9 report...
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-rose-300/35 bg-rose-400/10 p-4 text-sm text-rose-100">
          Failed to load report data. {error ?? 'Unknown error'}
        </div>
      </main>
    );
  }

  const navButtons = NAV_ITEMS.map((item) => {
    const isActive = activeSection === item.id;

    return (
      <a
        key={item.id}
        href={`#${item.id}`}
        onClick={(event) => {
          event.preventDefault();
          setActiveSection(item.id);
          scrollToAnchor(item.id);
          setMobileNavOpen(false);
        }}
        className={[
          'block w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-all',
          isActive
            ? 'border-emerald-300/80 bg-emerald-300/20 text-emerald-100 shadow-[0_0_0_1px_rgba(110,231,183,0.25)]'
            : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/30 hover:bg-white/[0.045] hover:text-white'
        ].join(' ')}
      >
        <span className="inline-flex w-full items-center justify-between gap-3">
          <span className="truncate">{item.label}</span>
          <span
            className={[
              'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
              isActive ? 'bg-emerald-200' : 'bg-zinc-600'
            ].join(' ')}
          />
        </span>
      </a>
    );
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <h1 className="font-syne text-3xl tracking-tight text-white">Volume 9 Sponsor Report</h1>
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200"
        >
          <Menu size={14} /> Sections
        </button>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 border-r border-white/10 bg-[#060606] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-100">Sections</p>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg border border-white/10 p-1.5 text-zinc-300"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">{navButtons}</div>
          </div>
          <button className="flex-1 bg-black/60" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />
        </div>
      )}

      <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="sticky top-24 hidden h-fit lg:block">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <h2 className="mb-3 px-2 text-xs uppercase tracking-[0.14em] text-zinc-500">Volume 9</h2>
            <div className="space-y-2">{navButtons}</div>
          </div>
        </aside>

        <div className="space-y-8">
          <section id="overview" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-emerald-200/80">Overview</p>
            <h2 className="mt-2 font-syne text-3xl tracking-tight text-white">CTRL + SHIFT Volume 9</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300">
              Volume 9 delivered strong audience engagement with improved pacing and positive sponsor visibility. This page covers program highlights,
              financial performance and audience composition from the event.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <KpiCard label="Guest Count" value={String(data.audience.approvedCount)} />
              <KpiCard label="Checked In" value={String(data.audience.checkedInCount)} />
              <KpiCard label="Show Rate" value={formatPercent(data.audience.showRate)} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={data.downloads.agendaPdf}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200 hover:border-white/25"
              >
                <Download size={14} /> Agenda PDF
              </a>
              <a
                href={data.downloads.guestsCsv}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200 hover:border-white/25"
              >
                <Download size={14} /> Guests CSV
              </a>
              <a
                href={data.downloads.budgetXlsx}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200 hover:border-white/25"
              >
                <Download size={14} /> Budget XLSX
              </a>
            </div>
          </section>

          <section id="program-recap" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Program Recap</p>
            <h2 className="mt-2 font-syne text-2xl tracking-tight text-white">Night Summary</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
              <li>
                The night landed with strong momentum, sustained energy and a highly positive audience response across talks, screenings and activations.
              </li>
              <li>
                Emily Switzer delivered a strong talk on taste through craft and consumption, grounding the room in creative decision-making and giving a clear
                lens for how teams can evaluate emerging tools.
              </li>
              <li>
                Justin Gerrard mapped the current tool landscape across open source and custom workflows, then translated that landscape into practical
                implementation patterns the audience could apply immediately.
              </li>
              <li>J Lee had to cancel due to a family emergency, so trailers were screened instead.</li>
              <li>
                The transition from the canceled segment into screenings was handled cleanly, which helped maintain flow and kept attendees engaged through the
                second half of the night.
              </li>
              <li>
                PrayFirst Diva&apos;s art installation was engaging, but audience flow was suboptimal and many guests missed it because it was placed at the back
                of the venue.
              </li>
              <li>Overall timing improved with the adjusted run of show and pacing felt tighter than previous volumes.</li>
            </ul>
          </section>

          <section id="activations" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Activations</p>
            <h2 className="mt-2 font-syne text-2xl tracking-tight text-white">Interactive Activation Recap</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="font-medium text-zinc-100">Find a Friend Matchmaking</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Find a Friend used Luma onboarding responses to build an interest profile for attendees, then processed those profiles through Claude Code
                  to identify strong one-to-one match candidates. The output was used as a networking and icebreaker tool that helped hosts facilitate better
                  introductions and stronger early-event connections, especially for first-time guests.
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="font-medium text-zinc-100">Places of Historical Significance by LTS Collective</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  A canvas with topology sculpted on and fictional locations guests could point to with a tracking cursor to see terrain renders and read lore
                  about the history and significance of each location. Artist reference:{' '}
                  <a
                    href="https://www.instagram.com/prayfirstdiva/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-200 underline decoration-emerald-300/60 underline-offset-2 hover:text-emerald-100"
                  >
                    Pray First Diva (@prayfirstdiva)
                  </a>
                  .
                </p>
              </article>
            </div>
          </section>

          <section id="financials" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Financials</p>
            <h2 className="mt-2 font-syne text-2xl tracking-tight text-white">Revenue and Expense Breakdown</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              The event closed at a net deficit of {formatCurrency(data.financials.kpis.netPnL)}. Late venue fees, low-engagement installation placement and
              excess bar procurement drove the result.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <KpiCard label="Total Revenue" value={formatCurrency(data.financials.kpis.totalRevenue)} />
              <KpiCard label="Total Expenses" value={formatCurrency(data.financials.kpis.totalExpenses)} />
              <KpiCard label="Net P&L" value={formatCurrency(data.financials.kpis.netPnL)} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="mb-3 text-sm font-medium text-zinc-100">Expense Distribution by Category</h3>
                <div className="flex flex-col gap-4 2xl:flex-row">
                  <div className="h-72 min-w-[220px] 2xl:flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseDonutData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius="46%"
                          outerRadius="73%"
                          paddingAngle={2}
                          stroke="#101215"
                          strokeWidth={1.25}
                        >
                          {expenseDonutData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip valueFormatter={(value) => formatCurrency(value)} />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="2xl:w-[230px]">
                    <ChartLegend data={expenseDonutData} formatValue={(value) => formatCurrency(value)} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="mb-3 text-sm font-medium text-zinc-100">Revenue Snapshot</h3>
                <div className="space-y-2 text-sm">
                  {data.financials.revenueLineItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                      <span className="text-zinc-300">{item.label}</span>
                      <span className="font-medium text-zinc-100">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-zinc-300">
                  <Filter size={12} /> Line Item Filters
                </div>
                <input
                  value={expenseSearch}
                  onChange={(event) => setExpenseSearch(event.target.value)}
                  placeholder="Search category or description"
                  className="w-full min-w-[220px] flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-300/50 transition focus:ring"
                />
                <select
                  value={expenseCategory}
                  onChange={(event) => setExpenseCategory(event.target.value)}
                  className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100"
                >
                  {expenseCategories.map((category) => (
                    <option value={category} key={category}>
                      {category === 'all' ? 'All categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <DataTable table={expenseTable} emptyLabel="No expense line items match current filters" />
            </div>
          </section>

          <section id="audience" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Audience</p>
            <h2 className="mt-2 font-syne text-2xl tracking-tight text-white">Attendee Composition and Engagement</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Technical builders were strongly represented with frontend and developer profiles clustered around tooling, automation and interactive work.
              Demographics shown here avoid inferred attributes and focus on attendee-provided signals only.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <KpiCard label="Total Records" value={String(data.audience.totalRecords)} />
              <KpiCard label="Guest Count" value={String(data.audience.approvedCount)} />
              <KpiCard label="Checked In" value={String(data.audience.checkedInCount)} />
              <KpiCard label="Show Rate" value={formatPercent(data.audience.showRate)} />
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <h3 className="mb-3 text-sm font-medium text-zinc-100">Roles</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.audience.roleDistribution} layout="vertical" margin={{ left: 8, right: 24 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis dataKey="name" type="category" width={122} stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#34d399" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <h3 className="mb-3 text-sm font-medium text-zinc-100">Interests</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.audience.interestDistribution.slice(0, 8)} margin={{ left: 8, right: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="name" hide />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="mb-3 text-sm font-medium text-zinc-100">Tools</h3>
                <div className="flex flex-col gap-4 xl:flex-row">
                  <div className="h-80 min-w-[220px] xl:flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={toolsDonutData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius="72%"
                          innerRadius="44%"
                          paddingAngle={2}
                          stroke="#101215"
                          strokeWidth={1.25}
                        >
                          {toolsDonutData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="xl:w-[220px]">
                    <ChartLegend data={toolsDonutData} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                <input
                  value={audienceSearch}
                  onChange={(event) => setAudienceSearch(event.target.value)}
                  placeholder="Search attendees"
                  className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none ring-emerald-300/50 transition focus:ring xl:col-span-2"
                />

                <select
                  value={checkedInFilter}
                  onChange={(event) => setCheckedInFilter(event.target.value as 'all' | 'checked-in' | 'not-checked-in')}
                  className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="all">All check-in states</option>
                  <option value="checked-in">Checked in</option>
                  <option value="not-checked-in">Not checked in</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100"
                >
                  {attendeeRoleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All roles' : option}
                    </option>
                  ))}
                </select>

                <select
                  value={interestFilter}
                  onChange={(event) => setInterestFilter(event.target.value)}
                  className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100"
                >
                  {attendeeInterestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All interests' : option}
                    </option>
                  ))}
                </select>

                <select
                  value={toolFilter}
                  onChange={(event) => setToolFilter(event.target.value)}
                  className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-zinc-100"
                >
                  {attendeeToolOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All tools' : option}
                    </option>
                  ))}
                </select>
              </div>

              <DataTable table={attendeeTable} emptyLabel="No attendees match current filters" />
            </div>
          </section>

          <section id="crm-highlights" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">CRM Highlights</p>
            <h2 className="mt-2 font-syne text-2xl tracking-tight text-white">Curated High-Signal Attendees</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Sponsor-safe highlights only. No emails or phone numbers are displayed.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {data.crmHighlights.map((highlight) => (
                <article
                  key={highlight.name}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/45 hover:bg-emerald-300/[0.06] hover:shadow-[0_18px_32px_rgba(16,185,129,0.12)]"
                >
                  <p className="font-medium text-zinc-100">{highlight.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-zinc-400">{highlight.role}</p>
                  <p className="mt-3 text-sm text-zinc-300">{highlight.whyRelevant}</p>
                  <p className="mt-2 text-sm text-zinc-200">{highlight.note}</p>
                  {highlight.linkUrl && (
                    <a
                      href={highlight.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/45 bg-emerald-200/10 px-3 py-1.5 text-xs font-medium text-emerald-100 transition-colors hover:bg-emerald-200/20"
                    >
                      Open {highlight.linkLabel ?? 'link'} <ExternalLink size={13} />
                    </a>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {highlight.tags.map((tag) => (
                      <span
                        key={`${highlight.name}-${tag}`}
                        className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="media" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Media</p>
            <h2 className="mt-2 font-syne text-2xl tracking-tight text-white">Assets</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Featured social recap from Volume 9.
            </p>
            <div className="mt-4 rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.035] to-black/30 p-4 sm:p-6">
              <div className="mx-auto w-full max-w-[640px]">
                <div className="flex justify-center">
                  <InstagramEmbed permalink="https://www.instagram.com/p/DVZGZm3jaeF/?img_index=1" />
                </div>
                <p className="mt-4 text-center text-xs text-zinc-400">
                  If the embed is blocked in your browser,{' '}
                  <a
                    href="https://www.instagram.com/p/DVZGZm3jaeF/?img_index=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-200 underline decoration-emerald-300/60 underline-offset-2 hover:text-emerald-100"
                  >
                    open the post on Instagram
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section id="next-steps" className={SECTION_CARD_CLASS}>
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Next Steps</p>
            <h2 className="mt-2 font-syne text-2xl tracking-tight text-white">Volume 10 Optimization</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-300">
              <p>
                1. Venue secured:{' '}
                <a
                  href="https://tendril.studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-200 underline decoration-emerald-300/60 underline-offset-2 hover:text-emerald-100"
                >
                  Tendril Studios
                </a>{' '}
                for March 27, 2026.
              </p>
              <p>2. Confirmed speakers: Leo Burnett, CEO of Tendril Animation and Mosaic.</p>
              <p>3. Rework installation placement and secure a lower budget, or discard the installation if it does not justify cost.</p>
              <p>4. Tighten bar procurement targets based on check-in forecasts and historical conversion.</p>
              <p>5. Improve Find a friend by collecting socials and communicating before the event why this matters for better matches.</p>
              <p>6. Active venue conversations are in progress for Volumes 11 and 12, to be announced.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
