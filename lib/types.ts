export type Recommendation = 'Bid' | 'No Bid' | 'Needs Clarification';
export type ChecklistStatus = 'Not Started' | 'In Progress' | 'Complete' | 'Blocked';
export type SolicitationField = { value: string; confidence: 'High' | 'Medium' | 'Low' | 'Needs Clarification'; evidence?: string };
export type LineItem = { id: string; name: string; description: string; quantity: number; unit: string; deliveryRequirement: string; mandatoryRequirements: string[]; risks: string[]; fitScore: number; fitReasoning: string; recommendation: Recommendation };
export type ChecklistItem = { id: string; task: string; owner: string; due: string; status: ChecklistStatus; riskLevel: 'Low' | 'Medium' | 'High' };
export type BidAnalysis = { summary: { bidNumber: SolicitationField; title: SolicitationField; agency: SolicitationField; dueDateTime: SolicitationField; submissionMethod: SolicitationField; deliveryRequirements: SolicitationField; licensingRequirements: SolicitationField; bondingRequirements: SolicitationField }; lineItems: LineItem[]; mandatoryRequirements: string[]; disqualificationRisks: string[]; recommendation: Recommendation; recommendationReasoning: string; checklist: ChecklistItem[]; generatedAt: string; sourceNotes: string[] };
export type PricingInput = { productCost: number; freight: number; otherRiskCost: number; targetMargin: number };
