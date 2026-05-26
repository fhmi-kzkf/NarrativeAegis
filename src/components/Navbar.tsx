'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || '';

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50" id="main-navbar">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" id="nav-logo">
          <div className="w-9 h-9 rounded-xl bg-lime flex items-center justify-center transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-ghost font-bold text-base tracking-tight">
            Narrative<span className="text-lime">Shield</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/dashboard" label="Dashboard" active={pathname === '/dashboard'} />
          <NavLink href="/audit/nexafin" label="Audit" active={pathname.includes('/audit/nexafin')} />
          <NavLink href="/playbook" label="Playbook" active={pathname === '/playbook'} />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/audit/new" className="btn-primary text-sm" id="nav-new-audit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            New Audit
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-ghost"
          onClick={() => setMobileOpen(!mobileOpen)}
          id="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ghost/10 px-6 py-4 flex flex-col gap-2 animate-fade-in">
          <NavLink href="/dashboard" label="Dashboard" active={pathname === '/dashboard'} mobile />
          <NavLink href="/audit/nexafin" label="Audit" active={pathname.includes('/audit/nexafin')} mobile />
          <NavLink href="/playbook" label="Playbook" active={pathname === '/playbook'} mobile />
          <Link
            href="/audit/new"
            className="btn-primary text-sm mt-2 text-center"
            onClick={() => setMobileOpen(false)}
          >
            New Audit
          </Link>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  label,
  active = false,
  mobile = false,
}: {
  href: string;
  label: string;
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        px-4 py-2 text-sm font-medium rounded-[20.7px] transition-all duration-200
        ${mobile ? 'w-full' : ''}
        ${
          active
            ? 'text-lime bg-lime/10'
            : 'text-ghost/60 hover:text-ghost hover:bg-ghost/5'
        }
      `}
    >
      {label}
    </Link>
  );
}
