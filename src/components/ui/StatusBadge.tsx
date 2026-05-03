import clsx from "clsx";

import type { StatusHukum } from "@/lib/types";

export function StatusBadge({ status }: { status: StatusHukum }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        status === "induk"
          ? "bg-blue-100 text-blue-900"
          : "bg-amber-100 text-amber-900"
      )}
    >
      {status}
    </span>
  );
}
