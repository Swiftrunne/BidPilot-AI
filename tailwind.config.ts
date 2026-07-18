import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { navy: '#0b1f3a', aqua: '#24c6dc', ink: '#101828' }, boxShadow: { soft: '0 20px 60px rgba(15, 23, 42, 0.12)' } } }, plugins: [] } satisfies Config;
