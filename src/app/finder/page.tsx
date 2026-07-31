"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, Sport, Level, PlayStyle } from "@/data/products";
import { getBestPrice } from "@/data/offers";
import ProductCard from "@/components/ProductCard";
import { PadelIcon, TennisIcon } from "@/components/icons";

type Step = "sport" | "level" | "style" | "budget" | "results";

export default function FinderPage() {
  const [step, setStep] = useState<Step>("sport");
  const [sport, setSport] = useState<Sport | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [style, setStyle] = useState<PlayStyle | null>(null);
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
          (a.year >= 2024 ? 5 : 0) -
          priceOf(a.id, a.price) / 100;
        const scoreB =
          (style && b.style.includes(style) ? 10 : 0) +
          (b.year >= 2024 ? 5 : 0) -
          priceOf(b.id, b.price) / 100;
        return scoreB - scoreA;
      })
      .slice(0, 6);
  }, [sport, level, style, budget]);

  const restart = () => {
    setStep("sport");
    setSport(null);
    setLevel(null);
    setStyle(null);
    setBudget(350);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {step !== "results" ? (
        <>
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-padel mb-2">
              Finder
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold">
              Encuentra tu {sport === "tenis" ? "raqueta" : "pala"} ideal
            </h1>
            <Progress step={step} />
          </div>

          {step === "sport" && (
            <QuestionStep
              question="¿Qué deporte juegas?"
              options={[
                { value: "padel", label: "Padel", desc: "Palas de padel", icon: <PadelIcon className="w-7 h-7 text-padel" /> },
                { value: "tenis", label: "Tenis", desc: "Raquetas de tenis", icon: <TennisIcon className="w-7 h-7 text-tenis" /> },
              ]}
              onSelect={(v) => {
                setSport(v as Sport);
                setStep("level");
              }}
            />
          )}

          {step === "level" && (
            <QuestionStep
              question="¿Cuál es tu nivel?"
              options={[
                {
                  value: "principiante",
                  label: "Principiante",
                  desc: "Llevo menos de 1 ano jugando",
                },
                {
                  value: "intermedio",
                  label: "Intermedio",
                  desc: "Juego regularmente, domino golpes basicos",
                },
                {
                  value: "avanzado",
                  label: "Avanzado",
                  desc: "Compito o juego a alto nivel",
                },
                {
                  value: "profesional",
                  label: "Profesional",
                  desc: "Nivel competicion/torneo",
                },
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
              question="¿Cuál es tu estilo de juego?"
              options={[
                {
                  value: "control",
                  label: "Control",
                  desc: "Gano con precision y colocacion",
                },
                {
                  value: "potencia",
                  label: "Potencia",
                  desc: "Busco el remate y el golpe ganador",
                },
                {
                  value: "polivalente",
                  label: "Polivalente",
                  desc: "Un poco de todo, juego completo",
                },
              ]}
              onSelect={(v) => {
                setStyle(v as PlayStyle);
                setStep("budget");
              }}
              onBack={() => setStep("level")}
            />
          )}

          {step === "budget" && (
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold mb-8">
                ¿Cuál es tu presupuesto máximo?
              </h2>
              <p className="font-display text-5xl font-bold text-padel mb-6">
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
                  onClick={() => setStep("style")}
                  className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep("results")}
                  className="px-8 py-3 rounded-xl bg-padel text-black font-semibold hover:bg-lime-300"
                >
                  Ver recomendaciones →
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-padel mb-2">
              Tus recomendaciones
            </p>
            <h1 className="font-display text-4xl font-bold">
              {recommendations.length > 0
                ? `Tu ${sport === "tenis" ? "raqueta" : "pala"} ideal está aquí`
                : "No encontramos nada con esos criterios"}
            </h1>
            <p className="text-muted mt-3">
              {level && capitalize(level)} · {style && capitalize(style)} · Hasta{" "}
              {budget} €
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
                Prueba a subir el presupuesto o cambiar algun criterio.
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={restart}
              className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5"
            >
              ↺ Empezar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Progress({ step }: { step: Step }) {
  const steps = ["sport", "level", "style", "budget"];
  const idx = steps.indexOf(step);
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all ${
            i <= idx ? "w-10 bg-padel" : "w-6 bg-white/10"
          }`}
        />
      ))}
    </div>
  );
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
            className="card-glow rounded-2xl bg-white/[0.02] p-6 text-left hover:bg-white/[0.05] transition-colors flex items-start gap-4"
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
            ← Atrás
          </button>
        </div>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
