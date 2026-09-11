import React, { useState, useEffect, useRef } from 'react';
import { AnalysisState } from './types';
import { ALL_NCBI_DATASETS, GSE63063_DATASET } from './data/ncbiDatasets';
import { trainXGBoostModel } from './services/xgboostEngine';
import { calculateSHAPValues } from './services/shapEngine';
import { runEnrichrPathwayAnalysis } from './services/enrichrService';

import { ScientificDisclaimerBanner } from './components/ScientificDisclaimerBanner';
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
import { SampleComparisonModal } from './components/modals/SampleComparisonModal';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [collapsedNav, setCollapsedNav] = useState<boolean>(false);
  const [myPathwayGenes, setMyPathwayGenes] = useState<string[]>([]);

  // Selected Inspect & Compare Items
  const [inspectedGene, setInspectedGene] = useState<string | null>(null);
  const [inspectedSampleId, setInspectedSampleId] = useState<string | null>(null);
  const [isSampleComparisonOpen, setIsSampleComparisonOpen] = useState<boolean>(false);

  // Initialize History State for Browser Back Button navigation
  useEffect(() => {
    window.history.replaceState({ view: 'landing' }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateView = (view: 'landing' | 'workspace') => {
    if (view !== currentView) {
      window.history.pushState({ view }, '');
      setCurrentView(view);
    }
  };

  // Initialize dataset & ML state
  const [state, setState] = useState<AnalysisState>(() => {
    const ds = GSE63063_DATASET;
    const samples = ds.generateSamples();
    const genes = ds.genes;

    const metrics = trainXGBoostModel(samples, genes);
    const { globalShap, sampleExplanations } = calculateSHAPValues(samples, genes);

    return {
      datasetMeta: ds.meta,
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

  // Train ML model dynamically on any selected NCBI GEO dataset
  const handleSelectNCBIDataset = (accessionId: string) => {
    const ds = ALL_NCBI_DATASETS[accessionId] || GSE63063_DATASET;
    const samples = ds.generateSamples();
    const genes = ds.genes;

    const metrics = trainXGBoostModel(samples, genes);
    const { globalShap, sampleExplanations } = calculateSHAPValues(samples, genes);

    const topGenes = globalShap.slice(0, 25).map(g => g.geneSymbol);
    runEnrichrPathwayAnalysis(topGenes, 'KEGG 2021 Human').then(pathways => {
      setState({
        datasetMeta: ds.meta,
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
        pathways,
        topShapCount: 25,
        selectedDatabase: 'KEGG 2021 Human',
        selectedGene: null,
        selectedSampleId: null
      });
    });
  };

  const workspaceRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#B5C7EB] selection:text-[#0000FF]">
      {/* Research Use Only Persistent Disclaimer Banner */}
      <ScientificDisclaimerBanner />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => handleNavigateView(v)}
        onSelectNCBIDataset={handleSelectNCBIDataset}
        state={state}
      />

      {/* LANDING PAGE VIEW */}
      {currentView === 'landing' && (
        <main className="flex-1">
          {/* Top Hero Section: Royal Blue with spotlight lens animation */}
          <HeroSection />

          {/* As user scrolls down: Lighter backgrounds with brain/gene artwork overlays for high legibility */}
          <WorkflowSection />
          <WhyExistsSection />
          <TargetAudienceSection />

          {/* Bottom Transition CTA with Brain Network Overlay */}
          <section
            className="relative py-24 text-center px-4 border-t overflow-hidden"
            style={{ backgroundColor: '#FFFAFA', borderColor: '#B5C7EB' }}
          >
            <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none"
              style={{ backgroundImage: `url('/assets/brain_network_background.jpg')` }}
            />

            <div className="relative z-10 max-w-2xl mx-auto p-10 rounded-3xl bg-white/95 backdrop-blur-md border-2 shadow-xl space-y-6" style={{ borderColor: '#B5C7EB' }}>
              <h2 className="text-3xl sm:text-4xl font-bold font-gwen text-[#0000FF]">
                Understand your Alzheimer&apos;s models.
              </h2>
              <p className="text-sm font-gwen text-slate-700 font-medium">
                Launch the research studio with real NCBI GEO datasets (GSE63063, GSE1297, GSE5281) or drop in your experimental matrix.
              </p>
              <button
                onClick={() => {
                  handleSelectNCBIDataset(state.datasetMeta.accessionId);
                  handleNavigateView('workspace');
                }}
                className="px-8 py-4 font-bold rounded-2xl text-sm shadow-xl transition-all transform hover:scale-[1.02] text-white bg-[#0000FF]"
              >
                Launch Research Studio →
              </button>
            </div>
          </section>
        </main>
      )}

      {/* SINGLE CONTINUOUS WORKSPACE VIEW */}
      {currentView === 'workspace' && (
        <div ref={workspaceRef} className="flex-1 flex bg-slate-50 text-slate-900 min-h-[calc(100vh-87px)]">
          {/* 7-Tab Persistent Left Navigation */}
          <WorkspaceNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={collapsedNav}
            setCollapsed={setCollapsedNav}
            state={state}
            onBackToLanding={() => handleNavigateView('landing')}
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
                onSelectNCBIDataset={handleSelectNCBIDataset}
              />
            )}

            {activeTab === 'analyze' && (
              <AnalyzeTab
                state={state}
                onUpdateState={handleUpdateState}
                setActiveTab={setActiveTab}
                onOpenSampleInspector={(sampleId) => setInspectedSampleId(sampleId)}
                onOpenSampleComparison={() => setIsSampleComparisonOpen(true)}
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
                onResetAnalysis={() => handleSelectNCBIDataset('GSE63063')}
                setActiveTab={setActiveTab}
                onOpenGeneModal={(symbol) => setInspectedGene(symbol)}
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

      <SampleComparisonModal
        isOpen={isSampleComparisonOpen}
        onClose={() => setIsSampleComparisonOpen(false)}
        state={state}
        onOpenGeneModal={(symbol) => setInspectedGene(symbol)}
      />
    </div>
  );
}

export default App;
