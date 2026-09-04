// Core Data & ML Types for NeuroLens

export type DiagnosisLabel = 'Alzheimer\'s Disease' | 'Healthy Control';

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
  shapValue: number; // positive = pushes towards AD, negative = pushes towards Healthy
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
