import clsx from "clsx";

import { getStatusLabel, type Locale } from "@/lib/i18n";
import type { StatusHukum } from "@/lib/types";

export function StatusBadge({ status, locale = "id" }: { status: StatusHukum; locale?: Locale }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        status === "berlaku" || status === "induk"
          ? "bg-emerald-100 text-emerald-900"
          : status === "revisi"
          ? "bg-amber-100 text-amber-900"
          : "bg-rose-100 text-rose-900"
      )}
    >
      {getStatusLabel(locale, status)}
    </span>
  );
}
