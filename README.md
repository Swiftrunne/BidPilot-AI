# BidPilot AI V2

BidPilot AI V2 turns solicitation PDF packages into an evidence-first opportunity dashboard for bid/no-bid review, compliance planning, deterministic pricing, supplier RFQs, and printable reports.

## Architecture

- `app/api/analyze` validates uploaded PDFs, assigns request IDs, applies bounded in-memory request throttling, extracts searchable text, and calls server-side AI analysis.
- `app/api/demo` is the only endpoint that returns fictional `demoAnalysis` data.
- `lib/ai` contains prompts, schema normalization/runtime validation, metadata, and OpenAI Responses API integration. `OPENAI_MODEL` remains configurable.
- `lib/documents` contains PDF validation and page-aware package text assembly.
- `lib/pricing` contains deterministic pricing calculations for margin, markup, break-even price, and aggressive/target/conservative scenarios.
- `lib/decision` contains transparent bid-fit decision helpers.

## Real vs demo separation

Real uploaded solicitations never fall back to fictional demo data. Missing API keys, OpenAI failures, invalid JSON, invalid structured output, unreadable PDFs, and scanned/low-text documents return safe actionable errors for the frontend error UI.

## Structured AI output and evidence

The analyzer instructs the model to treat solicitation contents as untrusted data, resist prompt injection, avoid invented facts, and classify important fields as `Fact`, `Inference`, `Not Found`, or `Needs Clarification`. Evidence should be concise and may include page and document references when available.

## Bidder Profile and decision framework

The browser-only Bidder Profile panel stores optional capability notes in `localStorage`. Unknown capabilities create clarification gates and lower certainty; they are not automatic No Bid findings. The V2 recommendation includes opportunity score, sub-scores, hard stops, clarification gates, positive drivers, and concerns.

## File limits and security

- PDF only, with extension, MIME, size, empty-file, and `%PDF-` magic-byte validation.
- Up to 5 PDFs per analysis, 25 MB each.
- API keys remain server-side and must not be exposed to the browser.
- Security headers are configured in `next.config.mjs`.
- In-memory throttling is a best-effort local safeguard for the MVP. Reliable distributed rate limiting on Vercel serverless requires an external datastore and is intentionally documented rather than overstated.
- Scanned-only PDFs require OCR/searchable text for the current configuration; the app fails safely instead of fabricating analysis.

## Environment variables

- `OPENAI_API_KEY` — required for real PDF analysis.
- `OPENAI_MODEL` — optional configurable model name; defaults to `gpt-5.6` if unset.

Do not commit secrets or real solicitation documents.

## Testing

Run:

```bash
npm run typecheck
npm run build
npm test
npm audit
```

The tests cover demo separation, missing-key safety, invalid-response safety, schema metadata, pricing math, file validation, long-document handling, and decision behavior for unknown mandatory capabilities.

## Known limitations

- No authentication, database persistence, team collaboration, live SAM.gov integration, payment processing, or supplier API integrations are included in this PR.
- Supplier quote tracking is lightweight and in-session oriented.
- OCR for scanned PDFs is not enabled unless the configured model and SDK path support direct document/image analysis; otherwise users receive an OCR-required message.
