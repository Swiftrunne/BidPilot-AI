# BidPilot AI V2

BidPilot AI V2 turns solicitation PDF packages into an evidence-first opportunity dashboard for bid/no-bid review, compliance planning, deterministic pricing, supplier RFQs, and printable reports.

## Architecture

- `app/api/analyze` validates uploaded PDFs, assigns request IDs, applies bounded in-memory request throttling, extracts searchable text, and calls server-side AI analysis.
- `app/api/demo` is the only endpoint that returns fictional `demoAnalysis` data.
- `lib/ai` contains prompts, strict Structured Outputs JSON Schema, robust runtime validation, metadata, chunk analysis, final synthesis, and OpenAI Responses API integration. `OPENAI_MODEL` remains configurable.
- `lib/documents` contains PDF validation and page-aware package text assembly.
- `lib/pricing` contains deterministic calculations for margin, markup, break-even price, and aggressive/target/conservative scenarios.
- `lib/decision` contains deterministic bid-fit scoring and hard-stop enforcement.
- `components/` contains extracted V2 UI panels for bidder profile and supplier quote comparison.

## Real vs demo separation

Real uploaded solicitations never fall back to fictional demo data. Missing API keys, OpenAI failures, invalid JSON, invalid structured output, unreadable PDFs, and scanned/low-text documents return safe actionable errors for the frontend error UI.

## Structured AI output and evidence

The analyzer uses strict JSON Schema Structured Outputs (`strict: true`, no arbitrary additional properties) and runtime validation that fails safely when critical V2 structure is missing. The prompt treats solicitation contents as untrusted data, resists prompt injection, avoids invented facts, and classifies important fields as `Fact`, `Inference`, `Not Found`, or `Needs Clarification`.

## Long documents and page evidence

BidPilot no longer sends only the beginning of a document. Searchable PDF text is preserved by document and page when the parser supplies true per-page callbacks. Long packages are split into page/section-aware chunks, each chunk is analyzed for requirements, line items, deadlines, evidence, and risks, and a final synthesis step combines the validated chunk analyses. Tail content is therefore included instead of silently ignored.

Page numbers are shown only when extracted from real parser page callbacks. If reliable page mapping is unavailable, BidPilot preserves `documentName` and omits `pageNumber` rather than fabricating a citation.

## Scanned PDFs

When a PDF has no selectable text, BidPilot attempts the official OpenAI Responses API `input_file` path using the configured `OPENAI_MODEL`. If that model/SDK path cannot reliably analyze the PDF directly, the request fails safely with an OCR/searchable-copy message. BidPilot never fabricates OCR output.

## Bidder Profile and decision framework

The browser-only Bidder Profile panel stores optional capability notes in `localStorage`. Unknown capabilities create clarification gates and lower certainty; they are not automatic No Bid findings. Deterministic decision support considers hard stops, clarification gates, deadline feasibility, technical fit, commercial fit, compliance readiness, delivery feasibility, past performance fit, supplier readiness, known conflicts, and unknown mandatory capabilities. No Bid requires a documented non-remediable hard conflict.

## File limits and security

- PDF only, with extension, MIME, size, empty-file, and `%PDF-` magic-byte validation.
- Up to 5 PDFs per analysis, 25 MB each.
- API keys remain server-side and must not be exposed to the browser.
- Security headers are configured in `next.config.mjs`.
- In-memory throttling is a best-effort local safeguard for the MVP. Reliable distributed rate limiting on Vercel serverless requires an external datastore and is intentionally documented rather than overstated.

## Environment variables

- `OPENAI_API_KEY` — required for real PDF analysis.
- `OPENAI_MODEL` — optional configurable model name; defaults to `gpt-5.6` if unset.

Do not commit secrets or real solicitation documents.

## Dependencies

Next.js and `eslint-config-next` are pinned to `15.5.20`, a stable patched 15.x release available in the current lockfile. Canary releases are not used.

## Testing

Run:

```bash
npm run typecheck
npm run build
npm test
npm audit
```

Behavioral tests cover pricing outputs, markup vs gross margin, break-even calculations, pricing scenarios, deterministic decision rules, strict schema acceptance/rejection, invalid structural output rejection, invalid PDF magic bytes, oversized PDFs, empty PDFs, long-document chunk retention, and proof that the missing-key real-analysis path cannot return `demoAnalysis`.

### Analysis timeout and extraction performance

Normal searchable PDF packages now use one primary OpenAI extraction request. Long extracted text is compacted once in application code before the request by preserving document/page boundaries, keeping section heads and tails, and retaining final-page content so deadline/requirement material near the end is not silently discarded. Chunk helpers remain available for regression protection, but the production text path no longer performs one model call per chunk plus a blocking synthesis call.

Server timing logs are emitted with the request ID for form parsing, PDF validation, buffer reads, text extraction, document compaction, OpenAI extraction, structured-output parsing, normalization/scoring, direct-PDF fallback, and request completion. Logs are concise timings only and do not include API keys, prompts, or full solicitation text.

## Known limitations

- No authentication, database persistence, team collaboration, live SAM.gov integration, payment processing, or supplier API integrations are included in this PR.
- Supplier quote tracking is browser/in-session only.
- Direct scanned-PDF analysis depends on the configured OpenAI model supporting Responses API file input; otherwise users must upload an OCR/searchable PDF.
- In-memory rate limiting is not distributed across serverless instances.

## Deterministic scoring and recommendations

Final fit scoring is computed in application code after structured AI extraction and validation. The AI extracts facts, requirements, evidence, unknowns, clarification needs, and candidate compliance items, but BidPilot computes final dimension scores and recommendations deterministically from normalized data.

Weights:

- Technical Fit: 25%
- Compliance Readiness: 20%
- Commercial Fit: 15%
- Delivery Feasibility: 15%
- Supplier Readiness: 10%
- Past Performance Fit: 5%
- Deadline Feasibility: 10%

Recommendation rules:

- `No Bid` requires an active hard stop or confirmed mandatory compliance failure.
- `Bid` requires a weighted score of at least 70 with no active hard stops and no unresolved clarification gates/questions.
- `Needs Clarification` / user-facing `Needs Review` is used when unknown bidder capability, missing evidence, unresolved clarification gates, or moderate readiness risk remains.
- Ordinary solicitation rejection rules such as late-bid rejection, required signatures, forms, submission method, or attachment limits are treated as disqualification risks/hard-stop rules, not active hard stops, unless the current bidder is confirmed unable to comply.

Compliance owner routing distinguishes the recipient of a clarification question from the internal owner responsible for completing the compliance action. Buyer/Contracting Officer should not be assigned as owner of internal bidder tasks; insurance/legal/bonding items route to Legal/Compliance, technical supplier questions route to Supplier / Manufacturer, and administrative readiness routes to Internal Bid Team.

### Score stability notes

Final V2 scores do not use model-authored numeric fit values. The deterministic scorer converts validated canonical statuses into bounded states: Confirmed, Unknown / Needs Clarification, Noncompliant, and Not Applicable. Equivalent wording in the model response must first normalize into those canonical states, and only those states feed the score. Empty bidder profile readiness is treated consistently as Unknown / Needs Clarification, not as an active hard stop. Scorecard labels distinguish score quality from confidence: score quality follows 0–39 Low, 40–69 Medium, 70–84 Good, and 85–100 High, while confidence remains a separate evidence/readiness label.

## Canonical requirement architecture

V2 now follows a production decision pipeline: PDF/document extraction → AI evidence extraction → canonical normalization → requirement deduplication → stable requirement IDs → deterministic bidder-state evaluation → deterministic dimension scoring → deterministic overall score → deterministic recommendation. The AI extracts evidence and unresolved requirements, while application code normalizes, deduplicates, classifies, scores, and decides.

Canonical requirements include stable fields such as `canonicalKey`, category, title, mandatory status, source evidence, solicitation status, bidder status, risk level, clarification audience, and action owner. Known procurement concepts map to deterministic IDs such as `SUPPLIER_REGISTRATION`, `TAX_DOCUMENTATION`, `INSURANCE_REQUIREMENTS`, `SUBMISSION_DEADLINE`, `SUBMISSION_METHOD`, `DELIVERY_LEAD_TIME`, `TECHNICAL_COMPLIANCE`, `INSTALLATION_REQUIRED`, `TRAINING_REQUIRED`, and `WARRANTY_REQUIRED`. Solicitation-specific requirements use a deterministic normalized key based on category and normalized requirement meaning.

Normalization lowercases text, strips punctuation/noise words, applies procurement synonym/alias rules, and maps equivalent wording into the same canonical concept. For example, “Supplier must enroll in LSU Workday,” “LSU Workday supplier registration is required,” and “Workday supplier enrollment required” all normalize to `SUPPLIER_REGISTRATION`. “W-9/W-8 required” and “Tax documentation required” normalize to `TAX_DOCUMENTATION`.

Deduplication occurs before scoring. Repeated instances of the same canonical requirement are collapsed into one row, evidence/page/document references are combined, mandatory/risk status is preserved at the highest applicable level, and clarification questions are deduplicated by canonical requirement key.

Canonical bidder states are `Confirmed Compliant`, `Unknown`, `Needs Clarification`, `Confirmed Noncompliant`, and `Not Applicable`. Empty bidder profile fields evaluate to `Unknown` / `Needs Clarification`; they never become `Confirmed Noncompliant` or Active Hard Stops without explicit bidder evidence.

### Code-owned canonical catalog

Canonical requirement inventory is now owned by application code, not AI prose. `lib/requirements/canonical.ts` defines 25 fixed catalog concepts with IDs, titles, categories, requirement types, default mandatory/risk behavior, action owners, clarification audiences, and deterministic alias rules. AI output can provide raw evidence, category hints, and requirement text, but BidPilot maps that evidence into the catalog before deduplication, compliance-matrix generation, clarification routing, and scoring.

Evidence-to-catalog matching runs known aliases first, then normalized semantic tokens/category compatibility, then deterministic fallback generation only for genuinely solicitation-specific obligations. Measurable LSU/PIV technical thresholds such as 625 Hz / frames per second, acquisition duration, field of view, vector spacing, SNR, and latency all map to the stable `TECHNICAL_COMPLIANCE` parent while preserving evidence details. Dedicated obligations such as installation, training, warranty, laser safety, manufacturer/model identification, Workday registration, tax documentation, suspension/debarment certification, hard-copy/electronic submission, and original/redacted copy requirements map to their own catalog IDs.
