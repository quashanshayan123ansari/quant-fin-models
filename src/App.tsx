import React, { useState } from 'react';
import { Header } from './components/Header';
import { ALL_MODELS } from './components/Sidebar';
import { ModelViewer } from './components/ModelViewer';
import { DashboardOverview } from './components/DashboardOverview';
import { ReadmeModal } from './components/ReadmeModal';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'model'>('dashboard');
  const [activeModelId, setActiveModelId] = useState<string>('black-scholes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isReadmeOpen, setIsReadmeOpen] = useState<boolean>(false);

  const categories = [
    'All',
    'Derivatives & Options',
    'Risk & Credit',
    'Volatility & Stochastic',
    'Asset Allocation',
    'Time Series & ML'
  ];

  const handleSelectModelFromDashboard = (id: string) => {
    setActiveModelId(id);
    setViewMode('model');
  };

  const handleSelectModelFromReadme = (id: string) => {
    setActiveModelId(id);
    setViewMode('model');
    setIsReadmeOpen(false);
  };

  const activeModelMeta = ALL_MODELS.find((m) => m.id === activeModelId);

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
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeModelName={activeModelMeta?.name}
      />

      {viewMode === 'dashboard' ? (
        /* Front Dashboard Page with Rectangular Model Tabs & 3D Stage */
        <DashboardOverview
          onSelectModel={handleSelectModelFromDashboard}
          onOpenReadme={() => setIsReadmeOpen(true)}
        />
      ) : (
        /* Dedicated Full-Width Realistic Model Workspace View (No Left Sidebar) */
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50 text-slate-900">
          <main className="flex-1 flex flex-col min-w-0 w-full">
            <ModelViewer
              modelId={activeModelId}
              onSelectModel={(id) => setActiveModelId(id)}
              onReturnToDashboard={() => setViewMode('dashboard')}
            />
          </main>
        </div>
      )}

      {/* README Documentation Modal */}
      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
        onSelectModel={handleSelectModelFromReadme}
      />
    </div>
  );
};

export default App;
