import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, ALL_MODELS } from './components/Sidebar';
import { ModelViewer } from './components/ModelViewer';
import { ReadmeModal } from './components/ReadmeModal';

export const App: React.FC = () => {
  const [activeModelId, setActiveModelId] = useState<string>('black-scholes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isReadmeOpen, setIsReadmeOpen] = useState<boolean>(false);

  const categories = ['All', 'Derivatives & Options', 'Risk & Credit', 'Volatility & Stochastic', 'Asset Allocation', 'Time Series & ML'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenReadme={() => setIsReadmeOpen(true)}
        categories={categories}
      />

      {/* Category Pills Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <span className="text-slate-500 font-bold uppercase mr-2 text-[10px]">Filter Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-semibold'
                : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Terminal Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeModelId={activeModelId}
          setActiveModelId={setActiveModelId}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />

        {/* Active Model Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
          <ModelViewer modelId={activeModelId} />
        </main>
      </div>

      {/* README Documentation Modal */}
      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
        onSelectModel={(id) => setActiveModelId(id)}
      />
    </div>
  );
};

export default App;
