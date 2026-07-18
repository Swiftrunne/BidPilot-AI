import type { Recommendation } from '@/lib/types';
export function decideBidFit(input:{hardStops?:string[];unknownMandatoryCapabilities?:string[];positiveDrivers?:string[]}):Recommendation{ if(input.hardStops?.length) return 'No Bid'; if(input.unknownMandatoryCapabilities?.length) return 'Needs Clarification'; return 'Bid'; }
