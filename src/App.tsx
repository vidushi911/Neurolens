import React, { useState, useEffect, useRef } from 'react';
import { AnalysisState } from './types';
import { generateGSE63063Samples, GSE63063_GENES, GSE63063_META } from './data/gse63063Dataset';
import { trainXGBoostModel } from './services/xgboostEngine';
import { calculateSHAPValues } from './services/shapEngine';
import { runEnrichrPathwayAnalysis } from './services/enrichrService';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WorkflowSection } from './components/WorkflowSection';
import { WhyExistsSection } from './components/WhyExistsSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';

import { WorkspaceNav, WorkspaceTab } from './components/workspace/WorkspaceNav';
import { OverviewTab } from './components/workspace/OverviewTab';
import { DatasetTab } from './components/workspace/DatasetTab';
import { AnalyzeTab } from './components/workspace/AnalyzeTab';
import { ExplainTab } from './components/workspace/ExplainTab';
import { PathwaysTab } from './components/workspace/PathwaysTab';
import { ResultsTab } from './components/workspace/ResultsTab';
import { DownloadTab } from './components/workspace/DownloadTab';

import { GeneExplorerModal } from './components/modals/GeneExplorerModal';
import { SampleInspectorModal } from './components/modals/SampleInspectorModal';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [collapsedNav, setCollapsedNav] = useState<boolean>(false);
  const [myPathwayGenes, setMyPathwayGenes] = useState<string[]>([]);

  // Selected Inspect Items
  const [inspectedGene, setInspectedGene] = useState<string | null>(null);
  const [inspectedSampleId, setInspectedSampleId] = useState<string | null>(null);

  // Initialize dataset & ML state
  const [state, setState] = useState<AnalysisState>(() => {
    const samples = generateGSE63063Samples();
    const genes = GSE63063_GENES;

    // Run baseline XGBoost & SHAP computation
    const metrics = trainXGBoostModel(samples, genes);
    const { globalShap, sampleExplanations } = calculateSHAPValues(samples, genes);

    return {
      datasetMeta: GSE63063_META,
      samples,
      genes,
      isCustomDataset: false,
      
      preprocessingStatus: 'complete',
      classificationStatus: 'complete',
      shapStatus: 'complete',
      enrichrStatus: 'idle',

      metrics,
      globalShap,
      sampleExplanations,
      pathways: [],

      topShapCount: 25,
      selectedDatabase: 'KEGG 2021 Human',

      selectedGene: null,
      selectedSampleId: null
    };
  });

  // Initial Enrichr query on load
  useEffect(() => {
    if (state.globalShap.length > 0 && state.pathways.length === 0) {
      const topGenes = state.globalShap.slice(0, state.topShapCount).map(g => g.geneSymbol);
      runEnrichrPathwayAnalysis(topGenes, state.selectedDatabase).then(pathways => {
        setState(prev => ({
          ...prev,
          enrichrStatus: 'complete',
          pathways
        }));
      });
    }
  }, []);

  const handleUpdateState = (updates: Partial<AnalysisState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleTryExampleDataset = () => {
    const samples = generateGSE63063Samples();
    const genes = GSE63063_GENES;
    const metrics = trainXGBoostModel(samples, genes);
    const { globalShap, sampleExplanations } = calculateSHAPValues(samples, genes);

    setState({
      datasetMeta: GSE63063_META,
      samples,
      genes,
      isCustomDataset: false,
      preprocessingStatus: 'complete',
      classificationStatus: 'complete',
      shapStatus: 'complete',
      enrichrStatus: 'complete',
      metrics,
      globalShap,
      sampleExplanations,
      pathways: state.pathways,
      topShapCount: 25,
      selectedDatabase: 'KEGG 2021 Human',
      selectedGene: null,
      selectedSampleId: null
    });

    setCurrentView('workspace');
    setActiveTab('overview');
  };

  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const handleExploreWorkflowScroll = () => {
    setCurrentView('workspace');
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onTryExampleDataset={handleTryExampleDataset}
        state={state}
      />

      {/* LANDING PAGE VIEW */}
      {currentView === 'landing' && (
        <main className="flex-1 text-white" style={{ backgroundColor: '#0000CD' }}>
          <HeroSection />
          <WorkflowSection />
          <WhyExistsSection />
          <TargetAudienceSection />

          {/* Continuous Transition CTA */}
          <section className="py-20 text-center px-4 transition-all duration-700 border-t border-blue-800" style={{ backgroundColor: '#0000CD' }}>
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white">Understand your Alzheimer&apos;s models.</h2>
              <p className="text-sm text-blue-100">
                Launch the research studio with our built-in NCBI GEO dataset or drop in your experimental gene expression matrix.
              </p>
              <button
                onClick={handleTryExampleDataset}
                className="px-8 py-4 bg-yellow-300 hover:bg-yellow-200 text-blue-950 font-bold rounded-2xl text-sm shadow-xl shadow-yellow-300/20 transition-all transform hover:scale-[1.02]"
              >
                Launch Research Studio →
              </button>
            </div>
          </section>
        </main>
      )}

      {/* SINGLE CONTINUOUS WORKSPACE VIEW */}
      {currentView === 'workspace' && (
        <div ref={workspaceRef} className="flex-1 flex bg-slate-50 text-slate-900 min-h-[calc(100vh-57px)]">
          {/* 7-Tab Persistent Left Navigation */}
          <WorkspaceNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={collapsedNav}
            setCollapsed={setCollapsedNav}
            state={state}
            onBackToLanding={() => setCurrentView('landing')}
          />

          {/* Continuous Workspace Panel */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {activeTab === 'overview' && (
              <OverviewTab
                state={state}
                setActiveTab={setActiveTab}
                onOpenGeneModal={(symbol) => setInspectedGene(symbol)}
              />
            )}

            {activeTab === 'dataset' && (
              <DatasetTab
                state={state}
                onUpdateState={handleUpdateState}
                onResetToDemo={handleTryExampleDataset}
              />
            )}

            {activeTab === 'analyze' && (
              <AnalyzeTab
                state={state}
                onUpdateState={handleUpdateState}
                setActiveTab={setActiveTab}
                onOpenSampleInspector={(sampleId) => setInspectedSampleId(sampleId)}
              />
            )}

            {activeTab === 'explain' && (
              <ExplainTab
                state={state}
                onOpenGeneModal={(symbol) => setInspectedGene(symbol)}
                myPathwayGenes={myPathwayGenes}
                setMyPathwayGenes={setMyPathwayGenes}
              />
            )}

            {activeTab === 'pathways' && (
              <PathwaysTab
                state={state}
                onUpdateState={handleUpdateState}
                onOpenGeneModal={(symbol) => setInspectedGene(symbol)}
                myPathwayGenes={myPathwayGenes}
              />
            )}

            {activeTab === 'results' && (
              <ResultsTab
                state={state}
                onResetAnalysis={handleTryExampleDataset}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'download' && (
              <DownloadTab state={state} />
            )}
          </main>
        </div>
      )}

      {/* Modals */}
      <GeneExplorerModal
        geneSymbol={inspectedGene}
        onClose={() => setInspectedGene(null)}
        state={state}
      />

      <SampleInspectorModal
        sampleId={inspectedSampleId}
        onClose={() => setInspectedSampleId(null)}
        state={state}
        onOpenGeneModal={(symbol) => setInspectedGene(symbol)}
      />
    </div>
  );
}

export default App;
