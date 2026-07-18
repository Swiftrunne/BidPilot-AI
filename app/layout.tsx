import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'BidPilot AI', description: 'AI bid analysis for government solicitations' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
