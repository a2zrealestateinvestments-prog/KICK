import { useState } from "react";
import { Loader2, Lightbulb, HelpCircle, ListTodo, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UnblockResponse {
  advice: string;
  question: string;
  planStep1: string;
  planStep2: string;
  planStep3: string;
}

export function TabDesbloqueo() {
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UnblockResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) {
      setError("Por favor cuéntame un poco sobre qué te tiene bloqueado.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue: issue.trim() }),
      });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al procesar tu solicitud");
        setResult(data);
      } else {
        throw new Error("El servidor no respondió correctamente. Intenta de nuevo.");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8 w-full flex flex-col h-full justify-center">
      <div className="mb-8 text-center md:text-left flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">¿Qué te tiene bloqueado?</h2>
          <p className="text-kick-text-muted text-sm sm:hidden">Cuéntame qué está pasando y te ayudo a moverte</p>
        </div>
        <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-kick-text-muted font-bold">Cuéntame qué está pasando</span>
      </div>

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
              <label className="block text-[10px] uppercase tracking-widest text-kick-text-muted font-bold ml-1 mb-2">Describe tu bloqueo</label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Ej: Sé lo que tengo que hacer pero no puedo empezar, siento que todo es urgente y no avanzo..."
                rows={5}
                className="w-full bg-kick-bg p-4 rounded-xl border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-kick-accent/30 focus:ring-1 focus:ring-kick-accent/30 transition-all resize-none text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium ml-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kick-accent text-black font-black py-4 rounded uppercase text-sm tracking-tighter hover:bg-[#e66000] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analizando tu situación...
                </>
              ) : (
                "Ayúdame a arrancar"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">Análisis de Desbloqueo</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              {/* Tarjeta 1: Consejo Personalizado */}
              <div className="bg-kick-card p-5 rounded-xl flex flex-col border border-white/5">
                <div className="w-10 h-10 bg-kick-accent/10 flex items-center justify-center rounded-lg mb-4">
                  <Lightbulb className="w-5 h-5 text-kick-accent" />
                </div>
                <h4 className="text-xs font-black uppercase text-kick-text-muted mb-2">Consejo</h4>
                <p className="text-sm leading-relaxed text-white">{result.advice}</p>
              </div>

              {/* Tarjeta 2: Pregunta Poderosa */}
              <div className="bg-kick-card p-5 rounded-xl flex flex-col border border-white/5">
                <div className="w-10 h-10 bg-kick-accent/10 flex items-center justify-center rounded-lg mb-4">
                  <HelpCircle className="w-5 h-5 text-kick-accent" />
                </div>
                <h4 className="text-xs font-black uppercase text-kick-text-muted mb-2">Pregunta Poderosa</h4>
                <p className="text-sm leading-relaxed italic font-medium text-white">"{result.question}"</p>
              </div>

              {/* Tarjeta 3: Tu Plan de 3 Pasos */}
              <div className="bg-kick-card p-5 rounded-xl flex flex-col border border-white/5">
                <div className="w-10 h-10 bg-kick-accent/10 flex items-center justify-center rounded-lg mb-4">
                  <ListTodo className="w-5 h-5 text-kick-accent" />
                </div>
                <h4 className="text-xs font-black uppercase text-kick-text-muted mb-2">Plan 3 Pasos</h4>
                
                <ul className="text-[11px] space-y-3 mt-1">
                  <li className="flex gap-2 leading-tight">
                    <span className="text-kick-accent font-bold mt-px">01</span>
                    <span className="text-white">{result.planStep1}</span>
                  </li>
                  <li className="flex gap-2 leading-tight">
                    <span className="text-kick-accent font-bold mt-px">02</span>
                    <span className="text-white">{result.planStep2}</span>
                  </li>
                  <li className="flex gap-2 leading-tight">
                    <span className="text-kick-accent font-bold mt-px">03</span>
                    <span className="text-white">{result.planStep3}</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setIssue("");
              }}
              className="mt-6 self-start border border-kick-accent text-kick-accent px-4 py-2 rounded-md text-[10px] font-bold hover:bg-kick-accent/10 transition-all uppercase tracking-widest flex items-center gap-2 w-full justify-center sm:w-auto"
            >
              <RefreshCw className="w-3 h-3" />
              Tengo otro bloqueo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
