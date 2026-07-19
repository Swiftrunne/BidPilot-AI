export type PrintableSummaryRow = {
  key: string;
  label: string;
  value: string;
  status: string;
  evidence?: string;
};

export function summaryValue(summary: any, key: string, fallback = '—') {
  const value = summary?.[key]?.value;
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function bidReference(analysis: { summary?: any } | null | undefined) {
  return summaryValue(
    analysis?.summary,
    'bidNumber',
    summaryValue(analysis?.summary, 'solicitationNumber', 'Solicitation'),
  );
}

export function printableSummaryRows(
  summary: any,
  fields: readonly (readonly [string, string])[],
): PrintableSummaryRow[] {
  return fields.flatMap(([key, label]) => {
    const field = summary?.[key];
    if (!field || field.status === 'Not Found') return [];
    return [{
      key,
      label,
      value: String(field.value ?? ''),
      status: String(field.status ?? 'Needs Clarification'),
      evidence: field.evidence,
    }];
  });
}
