"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher(props: {
  locale: Locale;
  label: string;
  variant?: "light" | "dark";
}) {
  const router = useRouter();
  const variant = props.variant ?? "light";
  const [isRefreshing, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
  const [activeLocale, setActiveLocale] = useState<Locale>(props.locale);

  useEffect(() => {
    setActiveLocale(props.locale);
    if (pendingLocale === props.locale) {
      setPendingLocale(null);
    }
  }, [pendingLocale, props.locale]);

  async function setLocale(nextLocale: Locale) {
    if (nextLocale === activeLocale || pendingLocale) return;

    setPendingLocale(nextLocale);
    setActiveLocale(nextLocale);

    try {
      await fetch("/api/preferences/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
    } finally {
      startTransition(() => {
        router.refresh();
      });
    }
  }

  const baseClass =
    variant === "dark"
      ? "border-slate-200 bg-white text-slate-700"
      : "border-slate-300 bg-white/90 text-slate-700";
  const isLoading = Boolean(pendingLocale) || isRefreshing;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-500 md:block">
        {props.label}
      </span>
      <div className={`inline-flex items-center rounded-full border p-1 ${baseClass}`}>
        {(["id", "en"] as const).map((item) => {
          const isActive = activeLocale === item;
          const isTarget = pendingLocale === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => void setLocale(item)}
              aria-pressed={isActive}
              aria-label={`${props.label}: ${item.toUpperCase()}`}
              disabled={isLoading}
              className={`inline-flex min-w-[46px] items-center justify-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase transition disabled:cursor-wait disabled:opacity-80 ${
                isActive ? "bg-[#B91C1C] text-white" : "text-slate-600"
              }`}
            >
              {isTarget ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              {item}
            </button>
          );
        })}
      </div>
      {isLoading ? (
        <span className="hidden text-xs font-medium text-slate-500 md:block">Loading...</span>
      ) : null}
    </div>
  );
}
