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
import { FutureScopeSection } from './components/FutureScopeSection';

import { WorkspaceNav, WorkspaceTab } from './components/workspace/WorkspaceNav';
import { OverviewTab } from './components/workspace/OverviewTab';
import { DatasetTab } from './components/workspace/DatasetTab';
import { AnalyzeTab } from './components/workspace/AnalyzeTab';
import { ExplainTab } from './components/workspace/ExplainTab';
import { PathwaysTab } from './components/workspace/PathwaysTab';
import { DockingTab } from './components/workspace/DockingTab';
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

  const handleSearchSubmit = (query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) return;

    // Check if query matches a known gene symbol
    const matchedGene = state.genes.find(g => g.toUpperCase() === cleanQuery) || cleanQuery;
    setInspectedGene(matchedGene);
    setActiveTab('explain');
    handleNavigateView('workspace');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-200 selection:text-slate-900 bg-[#F5F8FC]">
      {/* Research Use Only Persistent Disclaimer Banner */}
      <ScientificDisclaimerBanner />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(v) => handleNavigateView(v)}
        onSelectNCBIDataset={handleSelectNCBIDataset}
        state={state}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* LANDING PAGE VIEW */}
      {currentView === 'landing' && (
        <main className="flex-1">
          {/* Top Hero Section */}
          <HeroSection />

          {/* Workflow, Why Exists & Target Audience Sections */}
          <WorkflowSection />
          <WhyExistsSection />
          <TargetAudienceSection />

          {/* PART 4 — Future Scope Section */}
          <FutureScopeSection />

          {/* Bottom Transition CTA */}
          <section
            className="relative py-20 text-center px-4 border-t border-slate-200 overflow-hidden bg-white"
          >
            <div className="relative z-10 max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#F5F8FC] border border-slate-200 shadow-2xs space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold font-sans text-slate-900 tracking-tight">
                Explore Alzheimer&apos;s Molecular Profiles.
              </h2>
              <p className="text-sm font-sans text-slate-600 font-normal leading-relaxed">
                Launch NeuroLens Analytics with real NCBI GEO datasets (GSE63063, GSE1297, GSE5281) or drop in your experimental matrix.
              </p>
              <button
                onClick={() => {
                  handleSelectNCBIDataset(state.datasetMeta.accessionId);
                  handleNavigateView('workspace');
                }}
                className="px-8 py-4 font-bold rounded-2xl text-sm shadow-sm transition-all hover:opacity-95 text-white bg-[#3B5DBF] cursor-pointer"
              >
                Open Workbench →
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
                setActiveTab={setActiveTab}
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

            {activeTab === 'docking' && (
              <DockingTab
                state={state}
                onOpenGeneModal={(symbol) => setInspectedGene(symbol)}
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
