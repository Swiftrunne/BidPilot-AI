import test from 'node:test';
import assert from 'node:assert/strict';
import { bidReference, printableSummaryRows, summaryValue } from '../lib/ui/summary';

test('summary helpers tolerate missing optional fields', () => {
  const summary: any = {
    solicitationNumber: { value: 'RFQ-123', status: 'Fact', evidence: 'RFQ line' },
    bonding: { value: 'Not Found', status: 'Not Found', evidence: '' },
  };

  assert.equal(bidReference({ summary }), 'RFQ-123');
  assert.equal(summaryValue(summary, 'dueDateTime'), '—');
  assert.equal(summaryValue(summary, 'agency'), '—');
});

test('bid reference falls back to Solicitation when identifiers are missing', () => {
  assert.equal(bidReference({ summary: {} }), 'Solicitation');
});

test('printable summary rows skip undefined and Not Found fields', () => {
  const summary: any = {
    solicitationNumber: { value: 'RFQ-123', status: 'Fact', evidence: 'RFQ line' },
    bonding: { value: 'Not Found', status: 'Not Found', evidence: '' },
  };

  const rows = printableSummaryRows(summary, [
    ['bidNumber', 'Bid Number'],
    ['solicitationNumber', 'Solicitation Number'],
    ['bonding', 'Bonding'],
    ['licenses', 'Licenses'],
  ] as const);

  assert.deepEqual(rows.map((row) => row.key), ['solicitationNumber']);
  assert.equal(rows[0]?.value, 'RFQ-123');
});
