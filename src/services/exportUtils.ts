import { AnalysisState } from '../types';

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSHAPImportanceCSV(state: AnalysisState) {
  if (!state.globalShap || state.globalShap.length === 0) return;

  const headers = ['Rank', 'Gene Symbol', 'Mean Absolute SHAP', 'Direction in AD', 'AD Expression Avg', 'Control Expression Avg', 'Fold Change', 'Description'];
  const rows = state.globalShap.map(item => [
    item.rank,
    `"${item.geneSymbol}"`,
    item.meanAbsShap,
    `"${item.direction}"`,
    item.adExpressionAvg,
    item.controlExpressionAvg,
    item.foldChange,
    `"${(item.description || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`NeuroLens_SHAP_Gene_Importance_${state.datasetMeta.accessionId}.csv`, csvContent);
}

export function exportPathwayResultsCSV(state: AnalysisState) {
  if (!state.pathways || state.pathways.length === 0) return;

  const headers = ['Rank', 'Pathway Name', 'Database', 'P-Value', 'Adjusted P-Value (FDR)', 'Combined Score', 'Overlapping Genes', 'Total Pathway Genes'];
  const rows = state.pathways.map(item => [
    item.rank,
    `"${item.pathwayName.replace(/"/g, '""')}"`,
    `"${item.database}"`,
    item.pValue.toExponential(3),
    item.adjustedPValue.toExponential(3),
    item.combinedScore,
    `"${item.overlappingGenes.join(';')}"`,
    item.totalPathwayGenes
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`NeuroLens_Enrichr_Pathways_${state.datasetMeta.accessionId}.csv`, csvContent);
}

export function exportPreprocessedDataCSV(state: AnalysisState) {
  if (!state.samples || state.samples.length === 0) return;

  const genes = state.genes;
  const headers = ['Sample_ID', 'Diagnosis', 'Tissue_Type', ...genes];

  const rows = state.samples.map(sample => {
    const exprs = genes.map(g => sample.expressions[g] ?? '');
    return [`"${sample.sampleId}"`, `"${sample.diagnosis}"`, `"${sample.tissueType}"`, ...exprs];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`NeuroLens_Preprocessed_Expression_${state.datasetMeta.accessionId}.csv`, csvContent);
}

export function generateMarkdownReport(state: AnalysisState): string {
  const meta = state.datasetMeta;
  const metrics = state.metrics;
  const topGenes = state.globalShap.slice(0, 10);
  const topPathways = state.pathways.slice(0, 5);

  return `# NeuroLens Computational Research Report
Date: ${new Date().toLocaleDateString()}
Dataset: ${meta.name} (${meta.accessionId})
Organism: ${meta.organism}
Tissue Type: ${meta.tissueType}

## 1. Dataset Summary
- Total Samples: ${meta.sampleCount} (${meta.adCount} AD vs ${meta.controlCount} Healthy Control)
- Analyzed Genes: ${meta.geneCount}
- Repository Source: ${meta.repository}
- Accession: ${meta.accessionId}

## 2. XGBoost Classification Model Performance
${metrics ? `
- Classification Model: XGBoost Gradient Boosted Decision Ensemble
- Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%
- Precision: ${(metrics.precision * 100).toFixed(1)}%
- Recall: ${(metrics.recall * 100).toFixed(1)}%
- F1-Score: ${metrics.f1Score.toFixed(3)}
- ROC-AUC: ${metrics.rocAuc.toFixed(3)}

Confusion Matrix:
- True Positives (AD): ${metrics.confusionMatrix.truePositive}
- True Negatives (Control): ${metrics.confusionMatrix.trueNegative}
- False Positives: ${metrics.confusionMatrix.falsePositive}
- False Negatives: ${metrics.confusionMatrix.falseNegative}
` : 'Model training pending.'}

## 3. Top Model-Driving Biomarker Genes (SHAP Feature Importance)
${topGenes.map(g => `${g.rank}. **${g.geneSymbol}** — Mean |SHAP|: ${g.meanAbsShap} (${g.direction}) [AD Avg: ${g.adExpressionAvg}, Ctrl Avg: ${g.controlExpressionAvg}]`).join('\n')}

## 4. Top Enriched Biological Pathways (Enrichr Analysis)
Library: ${state.selectedDatabase}
${topPathways.map(p => `${p.rank}. **${p.pathwayName}** (Combined Score: ${p.combinedScore}, Adj. p-val: ${p.adjustedPValue.toExponential(2)})\n   - Overlapping Genes: ${p.overlappingGenes.join(', ')}`).join('\n\n')}

---
*NeuroLens is an exploratory research and computational workflow platform. Results are intended for scientific hypothesis generation and education.*
`;
}
