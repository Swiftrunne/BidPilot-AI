import { BidAnalysis } from './types';
export const demoAnalysis: BidAnalysis = {
  generatedAt: new Date().toISOString(),
  summary: {
    bidNumber: { value: 'LA-HYG-2026-0142', confidence: 'High', evidence: 'Header identifies solicitation number.' },
    title: { value: 'Statewide Hygiene Items Supply Contract', confidence: 'High' },
    agency: { value: 'Louisiana Department of Community Services (fictional demo)', confidence: 'High' },
    dueDateTime: { value: '2026-08-14 2:00 PM CT', confidence: 'Medium', evidence: 'Demo due date.' },
    submissionMethod: { value: 'Electronic portal submission with signed PDF attachments', confidence: 'High' },
    deliveryRequirements: { value: 'Deliver to regional warehouses within 15 calendar days of purchase order.', confidence: 'High' },
    licensingRequirements: { value: 'Supplier must certify products meet applicable labeling and safety standards.', confidence: 'Medium' },
    bondingRequirements: { value: 'No bid bond identified; performance assurance may be requested for late delivery.', confidence: 'Needs Clarification' }
  },
  lineItems: [
    { id: '1', name: 'Antibacterial hand soap', description: '12 oz pump bottles, case pack of 24', quantity: 1200, unit: 'case', deliveryRequirement: '15 days ARO to Baton Rouge warehouse', mandatoryRequirements: ['Safety data sheet', 'Fragrance-free option acceptable'], risks: ['Volatile freight cost'], fitScore: 8, fitReasoning: 'Common SKU, clear unit of measure, manageable delivery window.', recommendation: 'Bid' },
    { id: '2', name: 'Travel-size toothpaste', description: '0.85 oz tubes, ADA accepted or equivalent', quantity: 8000, unit: 'each', deliveryRequirement: 'Split shipments to three regions', mandatoryRequirements: ['Expiration date at least 18 months after delivery'], risks: ['Brand equivalency may require clarification'], fitScore: 6, fitReasoning: 'Strong availability but equivalency and dating requirements need supplier confirmation.', recommendation: 'Needs Clarification' },
    { id: '3', name: 'Disposable razors', description: 'Twin blade, individually wrapped', quantity: 5000, unit: 'each', deliveryRequirement: 'Single delivery within 10 days', mandatoryRequirements: ['Individual wrapping required'], risks: ['Short lead time', 'Packaging noncompliance is disqualifying'], fitScore: 4, fitReasoning: 'Lead time and packaging requirements create meaningful noncompliance risk.', recommendation: 'No Bid' }
  ],
  mandatoryRequirements: ['Submit signed bid form before deadline', 'Acknowledge all addenda', 'Provide product spec sheets for each line item', 'Hold pricing for 90 days'],
  disqualificationRisks: ['Late electronic submission', 'Missing addendum acknowledgement', 'Substituting non-equivalent packaging', 'Omitting delivery lead times'],
  recommendation: 'Needs Clarification',
  recommendationReasoning: 'Bid soap, clarify toothpaste equivalency, and avoid or reprice razors unless a compliant supplier confirms lead time.',
  checklist: [
    { id: 'c1', task: 'Confirm portal registration and signer authority', owner: 'Ops', due: '2026-08-07', status: 'In Progress', riskLevel: 'Medium' },
    { id: 'c2', task: 'Collect supplier quotes and spec sheets', owner: 'Sourcing', due: '2026-08-09', status: 'Not Started', riskLevel: 'High' },
    { id: 'c3', task: 'Prepare addenda acknowledgement', owner: 'Bid Lead', due: '2026-08-12', status: 'Not Started', riskLevel: 'High' },
    { id: 'c4', task: 'Final price review and export report', owner: 'Finance', due: '2026-08-13', status: 'Not Started', riskLevel: 'Medium' }
  ],
  sourceNotes: ['Fictional demonstration data inspired by common public-sector hygiene supply solicitations.']
};
