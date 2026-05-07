"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function PublicSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/pkpu?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
      <div className="group relative flex items-center overflow-hidden rounded-full bg-white shadow-xl ring-4 ring-red-500/10 transition-all focus-within:ring-red-500/30">
        <div className="pl-6 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari Nomor, Tahun, atau Judul Peraturan..."
          className="w-full px-4 py-5 text-lg text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="mr-2 rounded-full bg-[#B91C1C] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-red-900 active:scale-95"
        >
          CARI
        </button>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-red-100/80">
        <span>Contoh: </span>
        <button
          type="button"
          onClick={() => setQuery("2024")}
          className="hover:text-white hover:underline"
        >
          "2024"
        </button>
        <button
          type="button"
          onClick={() => setQuery("Logistik")}
          className="hover:text-white hover:underline"
        >
          "Logistik"
        </button>
        <button
          type="button"
          onClick={() => setQuery("Tahun 2023")}
          className="hover:text-white hover:underline"
        >
          "Tahun 2023"
        </button>
      </div>
    </form>
  );
}
