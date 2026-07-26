"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CompareCtx {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: boolean;
}

const Ctx = createContext<CompareCtx | null>(null);
const MAX = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const add = (id: string) =>
    setIds((prev) => (prev.length < MAX && !prev.includes(id) ? [...prev, id] : prev));
  const remove = (id: string) => setIds((prev) => prev.filter((x) => x !== id));
  const clear = () => setIds([]);
  const has = (id: string) => ids.includes(id);

  return (
    <Ctx.Provider value={{ ids, add, remove, clear, has, isFull: ids.length >= MAX }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
