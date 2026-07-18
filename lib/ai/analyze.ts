import OpenAI from 'openai';
import { normalizeAnalysis, JSON_SCHEMA } from './schema';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import type { BidAnalysis } from '@/lib/types';
export class AnalysisError extends Error { status=500; constructor(message:string,status=500){super(message);this.status=status} }
export async function analyzeSolicitationText(text:string, requestId=crypto.randomUUID()): Promise<BidAnalysis>{
 if(!process.env.OPENAI_API_KEY) throw new AnalysisError('OpenAI is not configured. Add OPENAI_API_KEY before analyzing real solicitations.',500);
 if(!text.trim()) throw new AnalysisError('No analyzable solicitation text was found. Upload a searchable PDF or OCR copy.',422);
 const model=process.env.OPENAI_MODEL||'gpt-5.6'; const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 try{ const res:any=await client.responses.create({model,input:[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:buildUserPrompt(text)}],text:{format:{type:'json_schema',...JSON_SCHEMA}}});
 const raw=res.output_text; if(!raw) throw new Error('empty model output'); return normalizeAnalysis(JSON.parse(raw),{modelUsed:model,requestId}); }
 catch(e){ if(e instanceof AnalysisError) throw e; throw new AnalysisError('Solicitation analysis failed safely. No demo data was returned; please retry or verify the document is readable.',502); }
}
