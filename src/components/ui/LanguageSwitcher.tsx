"use client";

import { usePathname, useRouter } from "next/navigation";

import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher(props: {
  locale: Locale;
  label: string;
  variant?: "light" | "dark";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const variant = props.variant ?? "light";

  function setLocale(nextLocale: Locale) {
    void fetch("/api/preferences/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale }),
    }).finally(() => {
      router.refresh();
    });
  }

  const baseClass =
    variant === "dark"
      ? "border-slate-200 bg-white text-slate-700"
      : "border-slate-300 bg-white/90 text-slate-700";

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-500 md:block">
        {props.label}
      </span>
      <div className={`inline-flex rounded-full border p-1 ${baseClass}`}>
        {(["id", "en"] as const).map((item) => {
          const isActive = props.locale === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setLocale(item)}
              aria-pressed={isActive}
              aria-label={`${props.label}: ${item.toUpperCase()}`}
              className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition ${
                isActive ? "bg-[#B91C1C] text-white" : "text-slate-600"
              }`}
              data-pathname={pathname}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
