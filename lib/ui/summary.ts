import type { BidAnalysis } from '../types';

export type PrintableSummaryRow = { key: string; label: string; value: string; status: string; evidence?: string };

export function summaryValue(summary: any, key: string, fallback = '—') {
  return summary?.[key]?.value || fallback;
}

export function bidReference(analysis: Pick<BidAnalysis, 'summary'> | null) {
  return summaryValue(analysis?.summary, 'bidNumber', summaryValue(analysis?.summary, 'solicitationNumber', 'Solicitation'));
}

export function printableSummaryRows(summary: any, fields: readonly (readonly [string, string])[]): PrintableSummaryRow[] {
  return fields
    .map(([key, label]) => {
      const value = summary?.[key];
      return !value || value.status === 'Not Found'
        ? null
        : { key, label, value: value.value, status: value.status, evidence: value.evidence };
    })
    .filter(Boolean) as PrintableSummaryRow[];
}
