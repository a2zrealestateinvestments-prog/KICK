import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function TabArranca() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/daily-message");
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage(data.error || "Hubo un error al cargar tu mensaje. ¡Arranca de todas formas!");
        }
      } else {
        setMessage("No pudimos conectar con el servidor. ¡Pero hoy es tu día para arrancar!");
      }
    } catch (error) {
      setMessage("No pudimos conectar. ¡Pero hoy es tu día para arrancar!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-full relative flex items-center justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-kick-accent"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm font-medium text-kick-text-muted">Preparando tu dosis de energía...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-kick-card border-l-4 border-kick-accent p-6 md:p-8 rounded-r-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16L9.01697 16C7.9124 16 7.01697 16.8954 7.01697 18L7.01697 21M14.017 21L17.017 21C18.1216 21 19.017 20.1046 19.017 19L19.017 5C19.017 3.89543 18.1216 3 17.017 3L7.01697 3C5.9124 3 5.01697 3.89543 5.01697 5L5.01697 19C5.01697 20.1046 5.9124 21 7.01697 21L14.017 21ZM14.017 21L14.017 12L12.017 10L10.017 12L10.017 21"/></svg>
              </div>
              <p className="text-sm text-kick-accent font-bold mb-4 uppercase tracking-tighter">Mensaje de hoy</p>
              <h2 className="text-2xl md:text-3xl font-semibold leading-snug italic text-white whitespace-pre-wrap">
                "{message}"
              </h2>
              <button
                onClick={fetchMessage}
                disabled={loading}
                className="mt-8 self-start border border-kick-accent text-kick-accent px-4 py-2 rounded-md text-xs font-bold hover:bg-kick-accent/10 transition-all uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Nuevo mensaje
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
