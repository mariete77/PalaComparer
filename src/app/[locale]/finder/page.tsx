"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, Sport, Level, PlayStyle } from "@/data/products";
import { getBestPrice } from "@/data/offers";
import ProductCard from "@/components/ProductCard";
import { PadelIcon, TennisIcon } from "@/components/icons";
import { useLocale } from "@/i18n/LocaleContext";
import { translate, type TranslationKey } from "@/i18n/locales";

type Step = "sport" | "level" | "style" | "priority" | "budget" | "results";
type HandPriority = "manejo" | "equilibrio" | "estabilidad";

export default function FinderPage() {
  const { locale } = useLocale();
  const t = (k: TranslationKey, p?: Record<string, string | number>) =>
    translate(locale, k, p);

  const [step, setStep] = useState<Step>("sport");
  const [sport, setSport] = useState<Sport | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [style, setStyle] = useState<PlayStyle | null>(null);
  const [priority, setPriority] = useState<HandPriority | null>(null);
  const [budget, setBudget] = useState<number>(350);

  const recommendations = useMemo(() => {
    if (!sport) return [];
    // El presupuesto se compara contra el mejor precio de tienda, no contra el
    // PVP: es lo que el usuario va a pagar de verdad.
    const priceOf = (id: string, pvp: number) => getBestPrice(id) ?? pvp;

    let pool = PRODUCTS.filter(
      (p) => p.sport === sport && priceOf(p.id, p.price) <= budget
    );
    if (level) pool = pool.filter((p) => p.level.includes(level));
    if (style) pool = pool.filter((p) => p.style.includes(style));
    // Score: exact style match first, then year desc, then price asc
    return pool
      .sort((a, b) => {
        const scoreA =
          (style && a.style.includes(style) ? 10 : 0) +
          preferenceScore(a, priority) +
          (a.year >= 2024 ? 5 : 0) -
          priceOf(a.id, a.price) / 100;
        const scoreB =
          (style && b.style.includes(style) ? 10 : 0) +
          preferenceScore(b, priority) +
          (b.year >= 2024 ? 5 : 0) -
          priceOf(b.id, b.price) / 100;
        return scoreB - scoreA;
      })
      .slice(0, 6);
  }, [sport, level, style, priority, budget]);

  const restart = () => {
    setStep("sport");
    setSport(null);
    setLevel(null);
    setStyle(null);
    setPriority(null);
    setBudget(350);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {step !== "results" ? (
        <>
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-padel-strong mb-2">
              {t("finder.etiqueta")}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold">
              {t("finder.titulo", { arma: sport === "tenis" ? t("common.tenisLower") : t("common.padelLower") })}
            </h1>
            <Progress step={step} />
          </div>

          {step === "sport" && (
            <QuestionStep
              question={t("finder.preguntaDeporte")}
              options={[
                { value: "padel", label: t("common.padel"), desc: t("finder.deportePadel"), icon: <PadelIcon className="w-7 h-7 text-padel-strong" /> },
                { value: "tenis", label: t("common.tenis"), desc: t("finder.deporteTenis"), icon: <TennisIcon className="w-7 h-7 text-tenis-strong" /> },
              ]}
              onSelect={(v) => {
                setSport(v as Sport);
                setStep("level");
              }}
            />
          )}

          {step === "level" && (
            <QuestionStep
              question={t("finder.preguntaNivel")}
              options={[
                { value: "principiante", label: t("catalog.nivel.principiante"), desc: t("finder.nivelPrincipiante") },
                { value: "intermedio", label: t("catalog.nivel.intermedio"), desc: t("finder.nivelIntermedio") },
                { value: "avanzado", label: t("catalog.nivel.avanzado"), desc: t("finder.nivelAvanzado") },
                { value: "profesional", label: t("catalog.nivel.profesional"), desc: t("finder.nivelProfesional") },
              ]}
              onSelect={(v) => {
                setLevel(v as Level);
                setStep("style");
              }}
              onBack={() => setStep("sport")}
            />
          )}

          {step === "style" && (
            <QuestionStep
              question={t("finder.preguntaEstilo")}
              options={[
                { value: "control", label: t("finder.estiloControl"), desc: t("finder.estiloControlDesc") },
                { value: "potencia", label: t("finder.estiloPotencia"), desc: t("finder.estiloPotenciaDesc") },
                { value: "polivalente", label: t("finder.estiloPolivalente"), desc: t("finder.estiloPolivalenteDesc") },
              ]}
              onSelect={(v) => {
                setStyle(v as PlayStyle);
                setStep("priority");
              }}
              onBack={() => setStep("level")}
            />
          )}

          {step === "priority" && (
            <QuestionStep
              question={t("finder.preguntaPrioridad")}
              options={[
                { value: "manejo", label: t("finder.prioridadManejo"), desc: t("finder.prioridadManejoDesc") },
                { value: "equilibrio", label: t("finder.prioridadEquilibrio"), desc: t("finder.prioridadEquilibrioDesc") },
                { value: "estabilidad", label: t("finder.prioridadEstabilidad"), desc: t("finder.prioridadEstabilidadDesc") },
              ]}
              onSelect={(v) => {
                setPriority(v as HandPriority);
                setStep("budget");
              }}
              onBack={() => setStep("style")}
            />
          )}

          {step === "budget" && (
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-8">
                {t("finder.preguntaPresupuesto")}
              </h2>
              <p className="font-display text-5xl font-bold text-padel-strong mb-6">
                {budget} €
              </p>
              <input
                type="range"
                min={60}
                max={350}
                step={10}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full max-w-md accent-lime-400 mb-10"
              />
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setStep("priority")}
                  className="px-6 py-3 rounded-xl border border-overlay-10 hover:bg-overlay-5"
                >
                  ← {t("finder.atras")}
                </button>
                <button
                  onClick={() => setStep("results")}
                  className="px-8 py-3 rounded-xl bg-padel text-black font-semibold hover:bg-lime-300"
                >
                  {t("finder.verRecomendaciones")} →
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-padel-strong mb-2">
              {t("finder.tusRecomendaciones")}
            </p>
            <h1 className="font-display text-4xl font-bold">
              {recommendations.length > 0
                ? t("finder.resultadoOk", { arma: sport === "tenis" ? t("common.tenisLower") : t("common.padelLower") })
                : t("finder.resultadoVacio")}
            </h1>
            <p className="text-muted mt-3">
              {level && translate(locale, `catalog.nivel.${level}`)} ·{" "}
              {style && translate(locale, `catalog.estilo.${style}`)} ·{" "}
              {t("finder.hasta")} {budget} €
            </p>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} bestPrice={getBestPrice(p.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center mb-10">
              <p className="text-muted">
                {t("finder.vacioCuerpo")}
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={restart}
              className="px-6 py-3 rounded-xl border border-overlay-10 hover:bg-overlay-5"
            >
              ↺ {t("finder.empezarDeNuevo")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Progress({ step }: { step: Step }) {
  const steps = ["sport", "level", "style", "priority", "budget"];
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all ${
            i <= idx ? "w-10 bg-padel" : "w-6 bg-overlay-10"
          }`}
        />
      ))}
    </div>
  );
}

function preferenceScore(product: (typeof PRODUCTS)[number], priority: HandPriority | null) {
  if (!priority) return 0;

  if (product.padel) {
    const weights = product.padel.weight.match(/\d+/g)?.map(Number) ?? [];
    const weight = weights.length > 1 ? (weights[0] + weights[1]) / 2 : weights[0] ?? 0;
    if (priority === "manejo") return (product.padel.balance === "bajo" ? 4 : 0) + (weight <= 365 ? 2 : 0);
    if (priority === "equilibrio") return (product.padel.balance === "medio" ? 4 : 0) + (product.style.includes("polivalente") ? 2 : 0);
    return (product.padel.balance === "alto" ? 4 : 0) + (weight >= 365 ? 2 : 0);
  }

  const weight = product.tenis?.weightStrung ?? 0;
  if (priority === "manejo") return weight <= 300 ? 4 : 0;
  if (priority === "equilibrio") return weight >= 300 && weight <= 315 ? 4 : 0;
  return weight >= 315 ? 4 : 0;
}

function QuestionStep({
  question,
  options,
  onSelect,
  onBack,
}: {
  question: string;
  options: { value: string; label: string; desc: string; icon?: React.ReactNode }[];
  onSelect: (v: string) => void;
  onBack?: () => void;
}) {
  const { locale } = useLocale();
  const t = (k: TranslationKey) => translate(locale, k);
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-center mb-8">
        {question}
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onSelect(o.value)}
            className="card-glow rounded-2xl bg-overlay-2 p-6 text-left hover:bg-overlay-5 transition-colors flex items-start gap-4"
          >
            {o.icon && <div className="mt-0.5 shrink-0">{o.icon}</div>}
            <div>
              <p className="font-display font-semibold text-lg">{o.label}</p>
              <p className="text-sm text-muted mt-1">{o.desc}</p>
            </div>
          </button>
        ))}
      </div>
      {onBack && (
        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="text-sm text-muted hover:text-foreground"
          >
            ← {t("finder.atras")}
          </button>
        </div>
      )}
    </div>
  );
}
