import React from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { ALL_MODELS } from './Sidebar';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (modelId: string) => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose, onSelectModel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono text-white">QUANT OS // MASTER DOCUMENTATION & MODEL INDEX</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          <div className="glass-panel p-4 space-y-2 border-cyan-500/20 bg-cyan-950/20">
            <h3 className="font-bold text-sm text-cyan-400 font-mono">Overview & Suite Architecture</h3>
            <p className="leading-relaxed text-slate-300">
              Welcome to the <strong>Quantitative Finance Model Suite</strong>. This platform integrates 20 analytical, numerical, stochastic, and machine learning models into an interactive terminal environment.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono font-bold text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800 pb-2">
              Complete Model Inventory (20 Models)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ALL_MODELS.map((model, idx) => (
                <div
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    onClose();
                  }}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition flex items-start gap-3 group"
                >
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-cyan-400">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition flex items-center justify-between">
                      <span>{model.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{model.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex justify-between items-center text-xs font-mono text-slate-500">
          <span>Quantitative Engineering Standard IEEE 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition"
          >
            Close Index
          </button>
        </div>
      </div>
    </div>
  );
};
