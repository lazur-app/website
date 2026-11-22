"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { logout, type UserProfile } from "@/lib/auth";
import { track } from "@/lib/productAnalytics";

/** Tracks before logout(): its clearSession() resets the analytics user (lib/auth.ts). */
function signOut(location: string) {
  track("logout", { location });
  logout();
}

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
        className={`${dim} shrink-0 rounded-full border-[1.5px] border-[#1c1917] object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1c1917] bg-[#5b4bd6] ${text} font-bold text-white`}
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
          onClick={() => {
            track("nav_link_clicked", { location: "user_menu_mobile", label: "Account", destination: "/dashboard" });
            onNavigate?.();
          }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
            onDashboard
              ? "bg-[#1c1917] text-white"
              : "text-[var(--foreground-muted)] hover:bg-[#1c1917]/[0.05] hover:text-[var(--foreground)]"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Account
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut("user_menu_mobile");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[#1c1917]/[0.05] hover:text-[var(--foreground)]"
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
        onClick={() => {
          track(open ? "menu_closed" : "menu_opened", { menu: "user_menu" });
          setOpen((o) => !o);
        }}
        className={`flex h-11 items-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white pl-2 pr-3 text-[14px] font-bold shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-transform hover:-translate-y-0.5 ${
          onDashboard ? "ring-2 ring-[#1c1917]/10" : ""
        }`}
      >
        <UserAvatar user={user} />
        <span className="max-w-[7rem] truncate leading-none text-[var(--foreground)]">
          {firstName(user)}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--foreground-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-[200] w-60 overflow-hidden rounded-[12px] border-[1.5px] border-[#1c1917] bg-white py-1 shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]"
            role="menu"
          >
            <div className="border-b border-dashed border-[#1c1917]/15 px-4 py-3">
              <p className="truncate text-[14px] font-bold text-[var(--foreground)]">
                {user.name || firstName(user)}
              </p>
              <p className="mt-1 truncate text-[12px] text-[var(--foreground-muted)]">{user.email}</p>
            </div>
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => {
                track("nav_link_clicked", { location: "user_menu", label: "Account", destination: "/dashboard" });
                setOpen(false);
              }}
              className={`flex min-h-[44px] items-center gap-3 px-4 text-[14px] font-semibold transition-colors ${
                onDashboard
                  ? "bg-[#1c1917]/[0.05] text-[var(--foreground)]"
                  : "text-[var(--foreground-muted)] hover:bg-[#1c1917]/[0.05] hover:text-[var(--foreground)]"
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
                signOut("user_menu");
              }}
              className="flex min-h-[44px] w-full items-center gap-3 px-4 text-left text-[14px] font-semibold text-[var(--foreground-muted)] transition-colors hover:bg-[#1c1917]/[0.05] hover:text-[var(--foreground)]"
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
