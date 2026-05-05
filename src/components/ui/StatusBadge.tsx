import clsx from "clsx";

import type { StatusHukum } from "@/lib/types";

export function StatusBadge({ status }: { status: StatusHukum }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        status === "berlaku"
          ? "bg-emerald-100 text-emerald-900"
          : status === "revisi"
          ? "bg-amber-100 text-amber-900"
          : "bg-rose-100 text-rose-900"
      )}
    >
      {status}
    </span>
  );
}
