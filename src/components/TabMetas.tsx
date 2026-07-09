import { useState } from "react";
import { Loader2, CheckCircle2, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmationResponse {
  confirmation: string;
  microCommitment: string;
}

export function TabMetas() {
  const [goals, setGoals] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConfirmationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validGoals = goals.filter((g) => g.trim().length > 0);
    
    if (validGoals.length === 0) {
      setError("Por favor escribe al menos una meta para hoy.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/confirm-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: validGoals }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Error al procesar las metas");
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-4 md:py-8 h-full flex flex-col justify-center">
      <div className="bg-kick-card p-6 rounded-xl border border-white/5 mb-8 text-center md:text-left">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">¿Qué vas a lograr hoy?</h2>
          <span className="text-kick-text-muted text-xs uppercase hidden sm:inline-block">Escribe entre 1 y 3 metas</span>
        </div>
        <p className="text-kick-text-muted text-sm sm:hidden mb-4">Escribe entre 1 y 3 metas concretas para hoy</p>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-kick-text-muted font-bold ml-1 mb-2">Meta 1</label>
              <input
                type="text"
                value={goals[0]}
                onChange={(e) => updateGoal(0, e.target.value)}
                placeholder="Ej: Terminar el informe del cliente"
                className="w-full bg-kick-bg p-3 rounded border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-kick-accent/30 focus:ring-1 focus:ring-kick-accent/30 transition-all text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-kick-text-muted font-bold ml-1 mb-2">Meta 2 (opcional)</label>
              <input
                type="text"
                value={goals[1]}
                onChange={(e) => updateGoal(1, e.target.value)}
                placeholder="Ej: Hacer 20 minutos de ejercicio"
                className="w-full bg-kick-bg p-3 rounded border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-kick-accent/30 focus:ring-1 focus:ring-kick-accent/30 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-kick-text-muted font-bold ml-1 mb-2">Meta 3 (opcional)</label>
              <input
                type="text"
                value={goals[2]}
                onChange={(e) => updateGoal(2, e.target.value)}
                placeholder="Ej: Leer 10 páginas de mi libro"
                className="w-full bg-kick-bg p-3 rounded border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-kick-accent/30 focus:ring-1 focus:ring-kick-accent/30 transition-all text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium ml-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kick-accent text-black font-black py-3 rounded uppercase text-sm tracking-tighter hover:bg-[#e66000] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Activando...
                </>
              ) : (
                "Activar mis metas"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-kick-card p-6 rounded-xl border border-white/5 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-green-500/20 p-2 rounded-full mt-1">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">¡Metas activadas!</h3>
                  <p className="text-kick-text-muted text-sm leading-relaxed">{result.confirmation}</p>
                </div>
              </div>

              <div className="bg-kick-bg rounded p-5 border border-kick-accent/30 relative overflow-hidden mt-4">
                <div className="absolute top-0 left-0 w-1 h-full bg-kick-accent" />
                <div className="flex items-center gap-2 mb-2 text-kick-accent">
                  <Rocket className="w-5 h-5" />
                  <span className="font-bold text-[10px] tracking-widest uppercase">Tu micro-compromiso ahora:</span>
                </div>
                <p className="text-base font-medium text-white">
                  {result.microCommitment}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setGoals(["", "", ""]);
              }}
              className="w-full py-3 text-kick-text-muted hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors mt-4"
            >
              Plantear nuevas metas
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
