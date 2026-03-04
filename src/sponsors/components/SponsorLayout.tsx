import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSponsorAuth } from '../auth';

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
    isActive
      ? 'border-emerald-300/60 bg-emerald-400/20 text-emerald-100'
      : 'border-white/15 bg-white/5 text-zinc-300 hover:border-white/25 hover:text-white'
  ].join(' ');
}

export default function SponsorLayout() {
  const navigate = useNavigate();
  const { logout } = useSponsorAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate('/sponsors/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.15),transparent_45%),radial-gradient(circle_at_80%_100%,rgba(244,63,94,0.12),transparent_40%),#040404] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/sponsors" className="font-syne text-lg tracking-tight text-white">
            CTRL + SHIFT Sponsor Portal
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 p-2 text-zinc-200 md:hidden"
            aria-label="Toggle sponsor navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/sponsors" end className={navClass}>
              Reports
            </NavLink>
            <NavLink to="/sponsors/vol-9" className={navClass}>
              Volume 9
            </NavLink>
            <button
              type="button"
              onClick={onLogout}
              className="ml-2 rounded-full border border-rose-300/40 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-400/20"
            >
              Log out
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <NavLink to="/sponsors" end className={navClass} onClick={() => setMenuOpen(false)}>
                Reports
              </NavLink>
              <NavLink to="/sponsors/vol-9" className={navClass} onClick={() => setMenuOpen(false)}>
                Volume 9
              </NavLink>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-rose-300/40 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-200"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  );
}
