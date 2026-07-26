"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  KIND_LABEL,
  formatArticleDate,
  type Article,
  type ArticleKind,
} from "@/data/news";

type SportFilter = "" | "padel" | "tenis";

const KINDS: ArticleKind[] = ["guia", "analisis", "novedad"];

export default function NewsList({ articles }: { articles: Article[] }) {
  const [sport, setSport] = useState<SportFilter>("");
  const [kind, setKind] = useState<ArticleKind | "">("");
  const [tag, setTag] = useState("");

  const tags = useMemo(
    () => Array.from(new Set(articles.flatMap((a) => a.tags))).sort(),
    [articles]
  );

  const filtered = useMemo(
    () =>
      articles.filter((a) => {
        if (sport && a.sport !== sport && a.sport !== "ambos") return false;
        if (kind && a.kind !== kind) return false;
        if (tag && !a.tags.includes(tag)) return false;
        return true;
      }),
    [articles, sport, kind, tag]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Chip active={sport === ""} onClick={() => setSport("")}>
          Todo
        </Chip>
        <Chip
          active={sport === "padel"}
          onClick={() => setSport(sport === "padel" ? "" : "padel")}
        >
          Pádel
        </Chip>
        <Chip
          active={sport === "tenis"}
          onClick={() => setSport(sport === "tenis" ? "" : "tenis")}
        >
          Tenis
        </Chip>

        <span className="w-px h-5 bg-white/10 mx-1" aria-hidden />

        {KINDS.map((k) => (
          <Chip
            key={k}
            active={kind === k}
            onClick={() => setKind(kind === k ? "" : k)}
          >
            {KIND_LABEL[k]}
          </Chip>
        ))}

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="ml-auto px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none"
        >
          <option value="">Todos los temas</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-3">📰</p>
          <p>No hay artículos con esos filtros.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const accent =
    article.sport === "tenis" ? "text-tenis" : "text-padel";

  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="card-glow rounded-2xl bg-white/[0.02] p-6 flex flex-col h-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${accent}`}>
          {KIND_LABEL[article.kind]}
        </span>
        <span className="text-xs text-muted">·</span>
        <span className="text-xs text-muted">{article.readingMinutes} min</span>
      </div>
      <h2 className="font-display text-lg font-bold leading-snug">
        {article.title}
      </h2>
      <p className="text-sm text-muted mt-2 leading-relaxed flex-1">
        {article.excerpt}
      </p>
      <p className="text-xs text-muted mt-4">
        {formatArticleDate(article.date)}
      </p>
    </Link>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-padel text-black"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
