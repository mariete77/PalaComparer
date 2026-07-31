"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  kindLabel,
  articleHref,
  formatArticleDate,
  type Article,
  type ArticleKind,
} from "@/data/news";
import { useLocale } from "@/i18n/LocaleContext";

type SportFilter = "" | "padel" | "tenis";

const KINDS: ArticleKind[] = ["guia", "analisis", "novedad"];

export default function NewsList({ articles }: { articles: Article[] }) {
  const { locale, lp, t } = useLocale();
  const [sport, setSport] = useState<SportFilter>("");
  const [kind, setKind] = useState<ArticleKind | "">("");
  const [tag, setTag] = useState("");

  const tags = useMemo(
    () =>
      Array.from(new Set(articles.flatMap((a) => a.tags.map((tg) => tg[locale])))).sort(),
    [articles, locale]
  );

  const filtered = useMemo(
    () =>
      articles.filter((a) => {
        if (sport && a.sport !== sport && a.sport !== "ambos") return false;
        if (kind && a.kind !== kind) return false;
        if (tag && !a.tags.some((tg) => tg[locale] === tag)) return false;
        return true;
      }),
    [articles, sport, kind, tag, locale]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Chip active={sport === ""} onClick={() => setSport("")}>
          {t("news.todo")}
        </Chip>
        <Chip
          active={sport === "padel"}
          onClick={() => setSport(sport === "padel" ? "" : "padel")}
        >
          {t("common.padel")}
        </Chip>
        <Chip
          active={sport === "tenis"}
          onClick={() => setSport(sport === "tenis" ? "" : "tenis")}
        >
          {t("common.tenis")}
        </Chip>

        <span className="w-px h-5 bg-white/10 mx-1" aria-hidden />

        {KINDS.map((k) => (
          <Chip
            key={k}
            active={kind === k}
            onClick={() => setKind(kind === k ? "" : k)}
          >
            {kindLabel(k, locale)}
          </Chip>
        ))}

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="ml-auto px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none"
        >
          <option value="">{t("news.todosTemas")}</option>
          {tags.map((tg) => (
            <option key={tg} value={tg}>
              {tg}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-3">📰</p>
          <p>{t("catalog.noResultados")}</p>
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
  const { locale, t } = useLocale();
  const accent = article.sport === "tenis" ? "text-tenis" : "text-padel";

  return (
    <Link
      href={articleHref(article, locale)}
      className="card-glow rounded-2xl bg-white/[0.02] p-6 flex flex-col h-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${accent}`}>
          {kindLabel(article.kind, locale)}
        </span>
        <span className="text-xs text-muted">·</span>
        <span className="text-xs text-muted">{article.readingMinutes} {t("common.min")}</span>
      </div>
      <h2 className="font-display text-lg font-bold leading-snug">
        {article.title[locale]}
      </h2>
      <p className="text-sm text-muted mt-2 leading-relaxed flex-1">
        {article.excerpt[locale]}
      </p>
      <p className="text-xs text-muted mt-4">
        {formatArticleDate(article.date, locale)}
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
