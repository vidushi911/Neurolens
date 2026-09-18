import React, { useState, useMemo } from 'react';
import { AnalysisState, DockingPoseResult, ValidationStage } from '../../types';
import { 
  PROTEIN_TARGETS, 
  CURATED_LIGANDS, 
  calculateLipinskiDescriptors, 
  runVinaDockingSimulation 
} from '../../data/dockingTargetsAndLigands';
import { Protein3DViewer } from './Protein3DViewer';
import { 
  Dna, 
  Play, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Upload, 
  ArrowUpDown, 
  Sparkles,
  FlaskConical,
  Activity,
  Layers,
  Search,
  Check
} from 'lucide-react';

interface DockingTabProps {
  state: AnalysisState;
  onOpenGeneModal?: (symbol: string) => void;
}

export const DockingTab: React.FC<DockingTabProps> = ({ state, onOpenGeneModal }) => {
  // Target Gene Selection State
  const [selectedGeneSymbol, setSelectedGeneSymbol] = useState<string>(
    state.selectedGene && PROTEIN_TARGETS[state.selectedGene] ? state.selectedGene : 'BACE1'
  );

  const currentTarget = useMemo(() => {
    return PROTEIN_TARGETS[selectedGeneSymbol] || PROTEIN_TARGETS['BACE1'];
  }, [selectedGeneSymbol]);

  // Ligand Library & Custom Input State
  const [selectedLigandId, setSelectedLigandId] = useState<string>('lig-verubecestat');
  const [customSmiles, setCustomSmiles] = useState<string>('');
  const [customLigandName, setCustomLigandName] = useState<string>('');
  const [inputMode, setInputMode] = useState<'library' | 'custom'>('library');

  // Execution & Results State
  const [isDockingRunning, setIsDockingRunning] = useState<boolean>(false);
  const [dockingResults, setDockingResults] = useState<DockingPoseResult[]>(() => {
    // Initialize default docking runs for BACE1
    const target = PROTEIN_TARGETS['BACE1'];
    return CURATED_LIGANDS.map(lig => runVinaDockingSimulation(target, lig)).sort(
      (a, b) => a.bindingEnergyKcal - b.bindingEnergyKcal
    );
  });

  const [activePoseId, setActivePoseId] = useState<string>('lig-verubecestat');
  const [sortBy, setSortBy] = useState<'energy' | 'score'>('energy');

  // Currently inspected docking pose result
  const activePose = useMemo(() => {
    return dockingResults.find(r => r.candidateId === activePoseId) || dockingResults[0] || null;
  }, [dockingResults, activePoseId]);

  // Handle target change -> re-run batch docking for target
  const handleSelectTarget = (geneSymbol: string) => {
    setSelectedGeneSymbol(geneSymbol);
    const target = PROTEIN_TARGETS[geneSymbol] || PROTEIN_TARGETS['BACE1'];
    const newResults = CURATED_LIGANDS.map(lig => runVinaDockingSimulation(target, lig)).sort(
      (a, b) => a.bindingEnergyKcal - b.bindingEnergyKcal
    );
    setDockingResults(newResults);
    if (newResults[0]) {
      setActivePoseId(newResults[0].candidateId);
    }
  };

  // Run Docking trigger
  const handleRunDocking = () => {
    setIsDockingRunning(true);
    setTimeout(() => {
      let candidateToDock = CURATED_LIGANDS.find(l => l.id === selectedLigandId);

      if (inputMode === 'custom') {
        if (!customSmiles.trim()) {
          setIsDockingRunning(false);
          return;
        }
        candidateToDock = calculateLipinskiDescriptors(customSmiles, customLigandName.trim() || 'Custom Ligand');
      }

      if (candidateToDock) {
        const newPose = runVinaDockingSimulation(currentTarget, candidateToDock);
        setDockingResults(prev => {
          const filtered = prev.filter(p => p.candidateId !== newPose.candidateId);
          const updated = [newPose, ...filtered];
          return updated.sort((a, b) => 
            sortBy === 'energy' 
              ? a.bindingEnergyKcal - b.bindingEnergyKcal 
              : b.screeningScore - a.screeningScore
          );
        });
        setActivePoseId(newPose.candidateId);
      }
      setIsDockingRunning(false);
    }, 600);
  };

  // Update compound stage in Feature 4 tracker
  const handleUpdateStage = (candidateId: string, newStage: ValidationStage) => {
    setDockingResults(prev =>
      prev.map(item => item.candidateId === candidateId ? { ...item, validationStage: newStage } : item)
    );
  };

  // Sorted Docking Results
  const sortedResults = useMemo(() => {
    return [...dockingResults].sort((a, b) => {
      if (sortBy === 'energy') return a.bindingEnergyKcal - b.bindingEnergyKcal;
      return b.screeningScore - a.screeningScore;
    });
  }, [dockingResults, sortBy]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Module Header & Research Disclaimer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
              <FlaskConical className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Molecular Docking & Drug-Candidate Screening
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Target Protein Mapping (PDB/UniProt), AutoDock Vina Binding Energy Calculation, and Lipinski Screening.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-mono font-semibold border border-sky-200">
              AutoDock Vina Engine
            </span>
          </div>
        </div>

        {/* Feature 3 Explicit Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Research Use Only (RUO) — In-Silico Screening Disclaimer</p>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Binding energy predictions (kcal/mol) and drug-likeness screening scores are computational estimates intended strictly to assist researchers in prioritizing candidate molecules for laboratory validation. They do not constitute clinical efficacy, safety, or diagnostic predictions.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURE 1 — Gene-to-Target Mapping */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-sky-700 uppercase tracking-wider block">
              Feature 1 — Target Selection & Structure
            </span>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Target Protein Mapping</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {currentTarget.geneSymbol}
              </span>
            </h2>
          </div>

          {/* Gene Target Select Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {Object.keys(PROTEIN_TARGETS).map((symbol) => {
              const target = PROTEIN_TARGETS[symbol];
              const isSelected = selectedGeneSymbol === symbol;
              return (
                <button
                  key={symbol}
                  onClick={() => handleSelectTarget(symbol)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-sky-100 text-sky-900 border border-sky-300 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-mono">{target.geneSymbol}</span>
                  <span className="text-[10px] text-slate-500 ml-1 font-sans">({target.pdbId})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Details Grid & 3D Viewer Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Metadata Column */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentTarget.proteinName}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Organism: {currentTarget.organism}</p>
                </div>
              </div>

              {/* External PDB & UniProt Links */}
              <div className="flex items-center gap-2 font-mono text-[11px] pt-1">
                <a
                  href={`https://www.rcsb.org/structure/${currentTarget.pdbId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-300 text-sky-700 font-semibold hover:bg-sky-50"
                >
                  <span>PDB: {currentTarget.pdbId}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://www.uniprot.org/uniprotkb/${currentTarget.uniprotId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-300 text-sky-700 font-semibold hover:bg-sky-50"
                >
                  <span>UniProt: {currentTarget.uniprotId}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Active Site Description */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800 block text-[11px]">Binding Pocket & Active Site:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentTarget.activeSiteDescription}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {currentTarget.activeSiteResidueNames.map(res => (
                    <span key={res} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-mono border border-sky-200 font-semibold">
                      {res}
                    </span>
                  ))}
                </div>
              </div>

              {/* Role in Alzheimer's */}
              <div className="space-y-1 pt-2 border-t border-slate-200 text-[11px]">
                <span className="font-bold text-slate-800 block">Alzheimer's Pathology Role:</span>
                <p className="text-slate-600 leading-relaxed">
                  {currentTarget.biologicalRoleInAD}
                </p>
              </div>
            </div>
          </div>

          {/* Right 3D Structure Viewer Column */}
          <div className="lg:col-span-7">
            <Protein3DViewer
              target={currentTarget}
              dockedPose={activePose}
              className="h-[380px]"
            />
          </div>
        </div>
      </div>

      {/* FEATURE 2 — Molecular Docking Module */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-sky-700 uppercase tracking-wider block">
              Feature 2 — Ligand Library & AutoDock Vina Engine
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Molecular Docking Execution
            </h2>
          </div>

          {/* Library vs Custom Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setInputMode('library')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                inputMode === 'library' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curated Library
            </button>
            <button
              onClick={() => setInputMode('custom')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                inputMode === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom SMILES / Upload
            </button>
          </div>
        </div>

        {/* Ligand Selector & Docking Trigger Controls */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
          {inputMode === 'library' ? (
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">Select Candidate Ligand from Curated AD Library:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {CURATED_LIGANDS.map((lig) => {
                  const isSelected = selectedLigandId === lig.id;
                  return (
                    <div
                      key={lig.id}
                      onClick={() => setSelectedLigandId(lig.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-sky-50 border-sky-300 text-sky-950 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{lig.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{lig.molecularWeight} Da</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{lig.mechanismOfAction}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Compound Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Experimental Molecule-01"
                    value={customLigandName}
                    onChange={(e) => setCustomLigandName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-sans focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">SMILES String Structure:</label>
                  <input
                    type="text"
                    placeholder="e.g. CC1(C2=CC(=CC=C2)F)N=C(N)NC1(=O)..."
                    value={customSmiles}
                    onChange={(e) => setCustomSmiles(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[11px] text-slate-500">
              Receptor: <strong className="font-mono">{currentTarget.geneSymbol} ({currentTarget.pdbId})</strong>
            </span>
            <button
              onClick={handleRunDocking}
              disabled={isDockingRunning}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isDockingRunning ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-white" />
                  <span>Computing Vina Binding Energy...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run AutoDock Vina Docking</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* FEATURE 2 & FEATURE 3 — Docking Results Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Docking & Screening Results ({sortedResults.length} Candidates)
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Sort by:</span>
              <button
                onClick={() => setSortBy('energy')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                  sortBy === 'energy' ? 'bg-sky-100 border-sky-300 text-sky-900' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Binding Energy (kcal/mol)
              </button>
              <button
                onClick={() => setSortBy('score')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                  sortBy === 'score' ? 'bg-sky-100 border-sky-300 text-sky-900' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Screening Score
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-600">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Rank</th>
                  <th className="py-2.5 px-3 font-semibold">Candidate Ligand</th>
                  <th className="py-2.5 px-3 font-semibold">Binding Energy (Vina)</th>
                  <th className="py-2.5 px-3 font-semibold">Est. Ki</th>
                  <th className="py-2.5 px-3 font-semibold">Lipinski Violations</th>
                  <th className="py-2.5 px-3 font-semibold">Screening Score</th>
                  <th className="py-2.5 px-3 font-semibold">Validation Stage</th>
                  <th className="py-2.5 px-3 font-semibold text-right">3D Pose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedResults.map((res, idx) => {
                  const isActive = activePoseId === res.candidateId;
                  return (
                    <tr
                      key={res.candidateId}
                      onClick={() => setActivePoseId(res.candidateId)}
                      className={`cursor-pointer transition-colors ${
                        isActive ? 'bg-sky-50/80 font-medium' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{res.candidateName}</span>
                        <span className="font-mono text-[10px] text-slate-500 block truncate max-w-[180px]">{res.smiles}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-900">
                        {res.bindingEnergyKcal} kcal/mol
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{res.inhibitionConstantEst}</td>
                      <td className="py-2.5 px-3">
                        {res.lipinskiPass ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{res.lipinskiViolations} Violations (Pass)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>{res.lipinskiViolations} Violations</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${res.screeningScore > 75 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                              style={{ width: `${res.screeningScore}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-900">{res.screeningScore} / 100</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {res.validationStage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePoseId(res.candidateId);
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                            isActive
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? 'Viewing Pose' : 'View Pose'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FEATURE 3 — Drug Candidate Lipinski Breakdown Card */}
      {activePose && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-sky-700 uppercase tracking-wider block">
                Feature 3 — Lipinski Rule of 5 Descriptors
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Drug-Likeness Profile: {activePose.candidateName}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-sky-100 text-sky-900 border border-sky-200">
                Score: {activePose.screeningScore} / 100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] block">Molecular Weight</span>
              <span className="font-bold text-slate-900 text-sm">{activePose.molecularWeight} Da</span>
              <span className="text-[10px] text-slate-500 block">(Rule: ≤ 500 Da)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] block">LogP (Partition)</span>
              <span className="font-bold text-slate-900 text-sm">{activePose.logP}</span>
              <span className="text-[10px] text-slate-500 block">(Rule: ≤ 5.0)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] block">H-Bond Donors</span>
              <span className="font-bold text-slate-900 text-sm">{activePose.hbd}</span>
              <span className="text-[10px] text-slate-500 block">(Rule: ≤ 5)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] block">H-Bond Acceptors</span>
              <span className="font-bold text-slate-900 text-sm">{activePose.hba}</span>
              <span className="text-[10px] text-slate-500 block">(Rule: ≤ 10)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] block">Rotatable Bonds</span>
              <span className="font-bold text-slate-900 text-sm">{activePose.rotatableBonds}</span>
              <span className="text-[10px] text-slate-500 block">(Rule: ≤ 10)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 text-[10px] block">TPSA (Polar Surface)</span>
              <span className="font-bold text-slate-900 text-sm">{activePose.tpsa} Å²</span>
              <span className="text-[10px] text-slate-500 block">(Rule: ≤ 140 Å²)</span>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4 — Validation Pipeline Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[10px] font-mono font-bold text-sky-700 uppercase tracking-wider block">
            Feature 4 — Candidate Validation Stage Tracker
          </span>
          <h2 className="text-base font-bold text-slate-900">
            Pre-Clinical Research Roadmap Status
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal prioritization workflow tracking candidate compounds across computational and experimental milestones.
          </p>
        </div>

        {activePose && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Selected Compound</span>
                <h3 className="text-sm font-bold text-slate-900">{activePose.candidateName}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-600 font-semibold">Current Stage:</span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-100 text-sky-900 border border-sky-300">
                  {activePose.validationStage}
                </span>
              </div>
            </div>

            {/* 3-Stage Progress Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {(['Computational Hit', 'Suggested for Experimental Validation', 'Suggested for Clinical Evaluation'] as ValidationStage[]).map((stage, sIdx) => {
                const isCurrent = activePose.validationStage === stage;
                return (
                  <div
                    key={stage}
                    onClick={() => handleUpdateStage(activePose.candidateId, stage)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isCurrent
                        ? 'bg-sky-100 border-sky-300 text-sky-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] font-bold">STAGE 0{sIdx + 1}</span>
                      {isCurrent && <Check className="w-4 h-4 text-sky-700" />}
                    </div>
                    <div className="text-xs font-semibold">{stage}</div>
                    <div className="text-[10px] text-slate-500">
                      {stage === 'Computational Hit' && 'Surfaced by Vina docking energy & Lipinski rule compliance.'}
                      {stage === 'Suggested for Experimental Validation' && 'Prioritized for in-vitro enzyme assay & SPR binding validation.'}
                      {stage === 'Suggested for Clinical Evaluation' && 'High-affinity lead candidate flagged for pre-clinical evaluation.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
