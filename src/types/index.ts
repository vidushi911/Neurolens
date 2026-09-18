// Core Data & ML Types for NeuroLens (Research Use Only - Non-Diagnostic)

export type DiagnosisLabel = 'Alzheimer\'s Disease' | 'Healthy Control';

// Non-diagnostic display helper
export function getNonDiagnosticLabel(label: DiagnosisLabel): string {
  return label === 'Alzheimer\'s Disease'
    ? 'AD-associated molecular profile'
    : 'Control-associated molecular profile';
}

export interface GeneExpressionSample {
  sampleId: string;
  diagnosis: DiagnosisLabel;
  tissueType: string;
  age?: number;
  gender?: string;
  expressions: Record<string, number>; // geneSymbol -> normalized log2 expression
}

export interface DatasetMeta {
  id: string;
  name: string;
  repository: string;
  accessionId: string;
  organism: string;
  tissueType: string;
  sampleCount: number;
  adCount: number;
  controlCount: number;
  geneCount: number;
  sourceUrl: string;
  citation: string;
  description: string;
}

export interface XGBoostParams {
  numTrees: number;
  maxDepth: number;
  learningRate: number;
  trainRatio: number; // e.g. 0.8
}

export interface ModelBenchmarkItem {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  description: string;
  isPrimary?: boolean;
}

export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    falseNegative: number;
    trueNegative: number;
  };
  rocCurveData: Array<{ fpr: number; tpr: number; threshold: number }>;
  predictions: Array<{
    sampleId: string;
    actualLabel: DiagnosisLabel;
    predictedLabel: DiagnosisLabel;
    adProbability: number;
  }>;
  benchmarks?: ModelBenchmarkItem[];
}

export interface GeneSHAP {
  geneSymbol: string;
  meanAbsShap: number; // Global importance
  direction: 'Up in AD' | 'Down in AD' | 'Variable';
  adExpressionAvg: number;
  controlExpressionAvg: number;
  foldChange: number;
  rank: number;
  description?: string;
}

export interface LocalSHAPContribution {
  geneSymbol: string;
  shapValue: number; // positive = pushes towards AD-associated profile, negative = pushes towards Control profile
  expressionValue: number;
  direction: 'Push AD' | 'Push Healthy';
}

export interface SampleSHAPExplanation {
  sampleId: string;
  actualLabel: DiagnosisLabel;
  predictedLabel: DiagnosisLabel;
  adProbability: number;
  baseValue: number;
  totalShapSum: number;
  contributions: LocalSHAPContribution[];
}

export interface EnrichrPathway {
  rank: number;
  pathwayName: string;
  database: 'GO Biological Process 2023' | 'KEGG 2021 Human' | 'Reactome 2022';
  pValue: number;
  adjustedPValue: number;
  combinedScore: number;
  overlappingGenes: string[];
  totalPathwayGenes: number;
}

export interface ScientificReference {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
  url?: string;
  relevance: string;
}

export interface ResearchLimitation {
  title: string;
  category: 'Platform' | 'Cohort Size' | 'Validation' | 'Non-Diagnostic';
  description: string;
}

// Molecular Docking & Drug Candidate Screening Types (RUO)
export interface ProteinTarget {
  geneSymbol: string;
  proteinName: string;
  pdbId: string;
  uniprotId: string;
  organism: string;
  resolution: string;
  activeSiteResidues: number[]; // Residue sequence numbers
  activeSiteResidueNames: string[]; // e.g. ["Asp32", "Asp228"]
  activeSiteDescription: string;
  functionSummary: string;
  biologicalRoleInAD: string;
}

export interface DrugCandidate {
  id: string;
  name: string;
  smiles: string;
  formula: string;
  molecularWeight: number; // Da (<= 500)
  logP: number; // Octanol-water partition (<= 5)
  hbd: number; // H-bond donors (<= 5)
  hba: number; // H-bond acceptors (<= 10)
  rotatableBonds: number; // (<= 10)
  tpsa: number; // Topological Polar Surface Area (Å²)
  mechanismOfAction: string;
  isStandardLibrary: boolean;
}

export type ValidationStage = 'Computational Hit' | 'Suggested for Experimental Validation' | 'Suggested for Clinical Evaluation';

export interface DockingPoseResult {
  candidateId: string;
  candidateName: string;
  smiles: string;
  formula: string;
  molecularWeight: number;
  logP: number;
  hbd: number;
  hba: number;
  rotatableBonds: number;
  tpsa: number;
  bindingEnergyKcal: number; // lower (more negative) = stronger binding
  inhibitionConstantEst: string; // e.g., "140 nM"
  lipinskiViolations: number;
  lipinskiPass: boolean;
  screeningScore: number; // 0-100 composite score
  validationStage: ValidationStage;
  activeSiteInteractions: string[]; // e.g., ["H-Bond to Asp32", "Pi-Stacking Tyr71"]
}

export interface AnalysisState {
  datasetMeta: DatasetMeta;
  samples: GeneExpressionSample[];
  genes: string[];
  isCustomDataset: boolean;
  
  // Pipeline status
  preprocessingStatus: 'idle' | 'running' | 'complete' | 'error';
  classificationStatus: 'idle' | 'running' | 'complete' | 'error';
  shapStatus: 'idle' | 'running' | 'complete' | 'error';
  enrichrStatus: 'idle' | 'running' | 'complete' | 'error';

  // Results
  metrics: ClassificationMetrics | null;
  globalShap: GeneSHAP[];
  sampleExplanations: Record<string, SampleSHAPExplanation>;
  pathways: EnrichrPathway[];
  
  // Settings
  topShapCount: number; // top N genes sent to Enrichr
  selectedDatabase: 'GO Biological Process 2023' | 'KEGG 2021 Human' | 'Reactome 2022';
  
  // Selected items
  selectedGene: string | null;
  selectedSampleId: string | null;
}
