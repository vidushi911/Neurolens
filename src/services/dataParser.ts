import Papa from 'papaparse';
import { DatasetMeta, GeneExpressionSample } from '../types';

export interface CSVParseResult {
  success: boolean;
  datasetMeta?: DatasetMeta;
  samples?: GeneExpressionSample[];
  genes?: string[];
  columns?: string[];
  samplePreview?: any[];
  error?: string;
}

export function parseCustomGeneExpressionCSV(
  fileContent: string,
  fileName: string,
  config?: {
    sampleIdCol?: string;
    labelCol?: string;
    adLabelValue?: string;
    ctrlLabelValue?: string;
  }
): CSVParseResult {
  try {
    const parseRes = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parseRes.errors && parseRes.errors.length > 0 && parseRes.data.length === 0) {
      return {
        success: false,
        error: `Could not parse CSV/TSV structure. Please ensure it is a valid delimited file. Details: ${parseRes.errors[0].message}`
      };
    }

    const rows = parseRes.data as any[];
    if (rows.length < 2) {
      return {
        success: false,
        error: 'Dataset is too small. Please provide a dataset with at least 2 samples and multiple gene expression columns.'
      };
    }

    const columns = Object.keys(rows[0] || {});

    // Try to auto-detect sample ID column
    const sampleIdCol = config?.sampleIdCol || columns.find(c => 
      /sample|gsm|patient|id|subject/i.test(c)
    ) || columns[0];

    // Try to auto-detect label column
    const labelCol = config?.labelCol || columns.find(c => 
      /diagnosis|status|label|group|condition|class|category/i.test(c)
    );

    if (!labelCol) {
      return {
        success: false,
        columns,
        samplePreview: rows.slice(0, 5),
        error: 'We couldn\'t automatically identify a diagnosis/label column. Please specify the column containing AD vs Healthy labels.'
      };
    }

    // Determine candidate gene columns (numeric columns excluding sampleId and labelCol)
    const geneColumns = columns.filter(c => c !== sampleIdCol && c !== labelCol);
    if (geneColumns.length === 0) {
      return {
        success: false,
        error: 'No numeric gene expression columns found in the uploaded dataset.'
      };
    }

    let adCount = 0;
    let ctrlCount = 0;

    const samples: GeneExpressionSample[] = [];

    rows.forEach((row, idx) => {
      const rawSampleId = String(row[sampleIdCol] || `Sample_${idx + 1}`);
      const rawLabel = String(row[labelCol] || '').trim();

      let isAD = false;
      if (config?.adLabelValue) {
        isAD = rawLabel.toLowerCase() === config.adLabelValue.toLowerCase();
      } else {
        isAD = /ad|alzheimer|case|1|positive|disease/i.test(rawLabel);
      }

      if (isAD) adCount++; else ctrlCount++;

      const expressions: Record<string, number> = {};
      geneColumns.forEach(gene => {
        const val = Number(row[gene]);
        expressions[gene] = isNaN(val) ? 7.0 : val; // Mean fallback imputation for NaN
      });

      samples.push({
        sampleId: rawSampleId,
        diagnosis: isAD ? 'Alzheimer\'s Disease' : 'Healthy Control',
        tissueType: 'Custom Bio-sample',
        expressions
      });
    });

    const datasetMeta: DatasetMeta = {
      id: `CUSTOM_${Date.now()}`,
      name: fileName.replace(/\.[^/.]+$/, ''),
      repository: 'User Uploaded Dataset',
      accessionId: 'USER_CSV',
      organism: 'Homo sapiens (Detected)',
      tissueType: 'User Defined Sample Set',
      sampleCount: samples.length,
      adCount,
      controlCount: ctrlCount,
      geneCount: geneColumns.length,
      sourceUrl: 'Local User File',
      citation: 'User-provided experimental gene expression matrix.',
      description: `Uploaded dataset containing ${samples.length} samples (${adCount} AD, ${ctrlCount} Healthy Control) across ${geneColumns.length} genes.`
    };

    return {
      success: true,
      datasetMeta,
      samples,
      genes: geneColumns,
      columns
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Error processing file: ${err.message || 'Unknown error'}`
    };
  }
}
