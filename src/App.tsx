import { useState } from "react";
import { TabArranca } from "./components/TabArranca";
import { TabMetas } from "./components/TabMetas";
import { TabDesbloqueo } from "./components/TabDesbloqueo";
import { motion } from "motion/react";
import { Flame, Target, LockOpen } from "lucide-react";

type TabId = "arranca" | "metas" | "desbloqueo";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("arranca");

  const tabs = [
    { id: "arranca", label: "Arranca", icon: <Flame className="w-4 h-4" /> },
    { id: "metas", label: "Mis Metas", icon: <Target className="w-4 h-4" /> },
    { id: "desbloqueo", label: "Estoy Atascado", icon: <LockOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-kick-bg text-white font-sans flex flex-col p-4 md:p-8 overflow-hidden selection:bg-kick-accent/30 selection:text-white max-w-[1024px] mx-auto w-full">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-kick-accent leading-none">KICK</h1>
          <p className="text-kick-text-muted text-xs md:text-sm mt-2 tracking-wide uppercase font-medium">Tu aliado diario para empezar</p>
        </div>
        <div className="flex items-center gap-2 bg-kick-card px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5">
          <div className="w-2 h-2 bg-kick-accent rounded-full animate-pulse"></div>
          <span className="text-[10px] md:text-xs text-kick-text-muted font-mono uppercase tracking-widest hidden sm:inline-block">Coach Activo</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex gap-4 md:gap-8 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`pb-4 border-b-2 font-bold text-base md:text-lg transition-colors whitespace-nowrap uppercase ${
                isActive ? "border-kick-accent text-kick-accent" : "border-transparent text-kick-text-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col overflow-y-auto no-scrollbar">
        {activeTab === "arranca" && <TabArranca />}
        {activeTab === "metas" && <TabMetas />}
        {activeTab === "desbloqueo" && <TabDesbloqueo />}
      </main>

      {/* Footer Status */}
      <footer className="mt-8 flex justify-between items-center text-[10px] text-kick-text-muted uppercase tracking-[0.2em] font-medium border-t border-white/5 pt-4 shrink-0">
        <span>Kick: El empujón que necesitas</span>
        <span className="hidden sm:inline">© 2024 Kick — Empieza hoy</span>
      </footer>
    </div>
  );
}

