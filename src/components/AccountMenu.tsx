import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/auth';

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  if (!user) return null;

  return (
    <div
      ref={container}
      className="relative z-50 text-sm"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="account-dropdown"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-[#014BAA] transition hover:bg-[#014BAA]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#014BAA]"
      >
        <UserRound size={17} aria-hidden="true" />
        <span className="max-w-36 truncate">{user.name}님</span>
        <ChevronDown size={15} aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div id="account-dropdown" className="absolute right-0 top-full w-56 pt-2">
          <div className="overflow-hidden rounded-xl border border-[#014BAA]/15 bg-white">
            <div className="border-b border-[#014BAA]/10 px-4 py-3">
              <p className="truncate font-medium text-[#014BAA]">{user.name}님</p>
              <p className="mt-1 truncate text-xs text-slate-500">{user.id}</p>
            </div>
            <div className="p-1.5">
              <Link to="/MyPage" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#014BAA] hover:bg-[#014BAA]/5 focus-visible:bg-[#014BAA]/5">
                <UserRound size={16} aria-hidden="true" />마이페이지
              </Link>
              <button type="button" onClick={() => { setOpen(false); logout(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 focus-visible:bg-slate-50">
                <LogOut size={16} aria-hidden="true" />로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
