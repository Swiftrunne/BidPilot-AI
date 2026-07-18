# BidPilot AI

BidPilot AI is a polished MVP web application for the OpenAI Build Week hackathon. It helps small businesses upload government solicitation PDFs, extract bid-critical details, assess fit and risks, price line items, draft supplier quote requests, and export a clean bid analysis report.

## Features

- PDF upload workflow for government solicitations.
- Server-side text extraction from PDFs.
- OpenAI-powered solicitation analysis for:
  - Bid number, title, agency, due date/time, and submission method.
  - Line items, quantities, units, delivery requirements, licensing, and bonding requirements.
  - Mandatory requirements and disqualification risks.
  - Line-by-line Fit Scores from 1–10 with reasoning.
  - Overall Bid / No Bid / Needs Clarification recommendation.
  - Compliance checklist generation.
- Explicit uncertainty handling: unclear fields are marked `Needs Clarification` rather than invented.
- Interactive checklist status tracking.
- Interactive pricing calculator by line item, including landed cost, margin, recommended unit price, extended bid value, and estimated gross profit.
- Supplier quote-request email draft for the selected line item.
- One-click fictional demo inspired by a Louisiana hygiene-items solicitation.
- Printable/exportable bid analysis report using the browser print dialog.
- Responsive dashboard UI built with Next.js, TypeScript, and Tailwind CSS.

## Architecture

```text
app/
  api/analyze/route.ts   PDF upload endpoint. Extracts text and calls the AI analyzer.
  api/demo/route.ts      One-click fictional demo endpoint.
  page.tsx               Client dashboard, upload, pricing, checklist, email, and print UI.
  layout.tsx             App metadata and global layout.
  globals.css            Tailwind and print styles.
lib/
  analyze.ts             OpenAI integration and strict JSON analysis prompt.
  demo.ts                Fictional demo solicitation analysis.
  types.ts               Shared TypeScript types.
```

The UI keeps secrets out of the browser. Uploaded PDFs are posted to `/api/analyze`, where text extraction and OpenAI calls happen server-side.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`.

4. Run the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes for live AI analysis | Server-side OpenAI API key. Never expose this in client code. |
| `OPENAI_MODEL` | No | Model used for solicitation analysis. Defaults to `gpt-5.6`. |

## OpenAI Integration

OpenAI is used in `lib/analyze.ts` through the official `openai` Node SDK. By default, GPT-5.6 performs the core solicitation analysis: solicitation extraction, mandatory requirement detection, disqualification risk analysis, line-item fit scoring, and Bid / No Bid / Needs Clarification recommendations. The analyzer sends extracted solicitation text to the configured model and asks for strict JSON containing summary fields, line items, mandatory requirements, risks, Fit Scores, recommendations, and checklist items.

Important behavior:

- The model name is configured with `OPENAI_MODEL`; the default is `gpt-5.6`.
- The API key is read only on the server from `OPENAI_API_KEY` and is never exposed to browser/client code.
- The system and user prompts instruct the model not to fabricate data.
- If a field is unclear, the response should mark it as `Needs Clarification`.
- If OpenAI is not configured, the app falls back to the fictional demo-shaped data so the dashboard remains demonstrable.

## Deployment

This project is ready for quick deployment to Vercel or another Next.js host.

### Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)
4. Deploy.

## Demo Mode

Click **One-click demo** on the homepage to load fictional Louisiana hygiene-items solicitation data. The demo includes multiple line items with different Fit Scores and recommendations: Bid, Needs Clarification, and No Bid. It does not include any real company-sensitive information.

## How Codex Was Used

Codex was used to scaffold and implement the MVP end-to-end: Next.js project structure, TypeScript types, OpenAI analysis endpoint, fictional demo data, responsive Tailwind dashboard, pricing calculator, supplier email draft, print/export report, environment example, and this README.

## Notes and Future Enhancements

- Add OCR for scanned PDFs.
- Add persisted projects and user accounts.
- Add SAM.gov or state procurement portal integrations.
- Add downloadable DOCX/XLSX report exports.
- Add structured supplier quote comparison.
