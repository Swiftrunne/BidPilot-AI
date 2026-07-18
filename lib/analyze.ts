import OpenAI from 'openai';
import { BidAnalysis } from './types';
import { demoAnalysis } from './demo';

const schema = `Return ONLY valid JSON matching: {"summary":{"bidNumber":{"value":string,"confidence":"High|Medium|Low|Needs Clarification","evidence"?:string},"title":...,"agency":...,"dueDateTime":...,"submissionMethod":...,"deliveryRequirements":...,"licensingRequirements":...,"bondingRequirements":...},"lineItems":[{"id":string,"name":string,"description":string,"quantity":number,"unit":string,"deliveryRequirement":string,"mandatoryRequirements":string[],"risks":string[],"fitScore":number,"fitReasoning":string,"recommendation":"Bid|No Bid|Needs Clarification"}],"mandatoryRequirements":string[],"disqualificationRisks":string[],"recommendation":"Bid|No Bid|Needs Clarification","recommendationReasoning":string,"checklist":[{"id":string,"task":string,"owner":string,"due":string,"status":"Not Started|In Progress|Complete|Blocked","riskLevel":"Low|Medium|High"}],"sourceNotes":string[]}`;

function coerceFallback(text: string): BidAnalysis {
  return { ...demoAnalysis, generatedAt: new Date().toISOString(), sourceNotes: ['OpenAI was not configured or analysis failed; showing fictional demo structure. Upload text preview length: ' + text.length] };
}

export async function analyzeSolicitationText(text: string): Promise<BidAnalysis> {
  if (!process.env.OPENAI_API_KEY) return coerceFallback(text);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-5.6';
  const prompt = `You are BidPilot AI, an expert government bid analyst for small businesses. Analyze the solicitation text. Do not fabricate. If a field is unclear, set value to "Needs Clarification" and confidence to "Needs Clarification". Produce fit scores from 1-10 with practical reasoning and a bid/no-bid recommendation. ${schema}\n\nSOLICITATION TEXT:\n${text.slice(0, 60000)}`;
  const completion = await client.chat.completions.create({ model, messages: [{ role: 'system', content: 'Extract solicitation requirements, risks, line items, compliance tasks, and pricing-relevant data. Return strict JSON only.' }, { role: 'user', content: prompt }] });
  const content = completion.choices[0]?.message?.content || '';
  try {
    const parsed = JSON.parse(content) as BidAnalysis;
    return { ...parsed, generatedAt: new Date().toISOString() };
  } catch {
    return coerceFallback(text);
  }
}
