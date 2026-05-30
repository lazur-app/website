"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { logout, type UserProfile } from "@/lib/auth";

type UserMenuProps = {
  user: UserProfile;
  /** Compact layout for mobile drawer */
  variant?: "navbar" | "mobile";
  onNavigate?: () => void;
};

function UserAvatar({ user, size = "sm" }: { user: UserProfile; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-7 w-7" : "h-10 w-10";
  const text = size === "sm" ? "text-[11px]" : "text-sm";

  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt=""
        className={`${dim} shrink-0 rounded-full border border-[var(--border)] object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--brand-soft)] ${text} font-semibold text-[var(--brand-ink)]`}
    >
      {(user.name || user.email)[0]?.toUpperCase()}
    </div>
  );
}

function firstName(user: UserProfile) {
  if (user.name?.trim()) return user.name.trim().split(/\s+/)[0];
  return user.email.split("@")[0];
}

export function UserMenu({ user, variant = "navbar", onNavigate }: UserMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onDashboard = pathname === "/dashboard";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "mobile") {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-3 rounded-xl px-4 py-3">
          <UserAvatar user={user} size="md" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[var(--foreground)]">
              {user.name || firstName(user)}
            </p>
            <p className="truncate text-[13px] text-[var(--foreground-muted)]">{user.email}</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
            onDashboard
              ? "bg-[var(--brand-soft)] text-[var(--brand-ink)]"
              : "text-[var(--foreground-muted)] hover:bg-[var(--background-deep)] hover:text-[var(--foreground)]"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Account
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-deep)] hover:text-[var(--foreground)]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 items-center gap-2 rounded-full border bg-[var(--surface-solid)] px-3 text-[13px] font-semibold transition-all hover:border-[var(--border-strong)] hover:shadow-sm ${
          onDashboard
            ? "border-[var(--brand)]/35 ring-2 ring-[var(--brand)]/10"
            : "border-[var(--border)]"
        }`}
      >
        <UserAvatar user={user} />
        <span className="max-w-[7rem] truncate leading-none text-[var(--foreground)]">
          {firstName(user)}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[var(--foreground-faint)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-[var(--border)] py-1 shadow-[var(--shadow-soft)]"
            role="menu"
          >
            <div className="border-b border-[var(--border)] px-3 py-2.5">
              <p className="truncate text-[13px] font-semibold text-[var(--foreground)]">
                {user.name || firstName(user)}
              </p>
              <p className="truncate text-[11px] text-[var(--foreground-muted)]">{user.email}</p>
            </div>
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium transition-colors ${
                onDashboard
                  ? "bg-[var(--brand-soft)] text-[var(--brand-ink)]"
                  : "text-[var(--foreground-muted)] hover:bg-[var(--background-deep)] hover:text-[var(--foreground)]"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Account
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-deep)] hover:text-[var(--foreground)]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
