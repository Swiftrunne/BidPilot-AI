# BidPilot AI

**Navigate every solicitation with evidence, clarity, and control.**

BidPilot AI is an evidence-first solicitation analysis and bid-readiness command center. It turns complex procurement documents into structured requirements, compliance actions, deterministic readiness scores, pricing workflows, supplier RFQs, clarification questions, and printable bid reports.

**Live app:** https://bid-pilot-ai-eta.vercel.app/

---

## Why BidPilot AI

Government solicitations are dense, fragmented, and easy to misread. A strong bid can still fail because of one missed deadline, signature, registration step, submission rule, pricing condition, technical specification, or insurance requirement.

BidPilot AI is built around a simple principle:

> **AI understands and extracts. Application code verifies and decides.**

The goal is not to let a model make an opaque bid/no-bid judgment. Instead, GPT-5.6 is used to understand solicitation language and extract structured evidence, while deterministic application logic handles canonical requirement mapping, bidder-readiness evaluation, scoring, and final recommendations.

---

## The Bid Journey

**Upload → Analyze → Verify → Plan → Price → Source → Submit**

BidPilot AI helps users move from raw solicitation documents to an actionable bid-readiness workflow:

1. Upload one or more solicitation PDFs.
2. Extract structured evidence and critical facts.
3. Normalize requirements into stable canonical concepts.
4. Separate solicitation requirements from bidder readiness.
5. Identify disqualification risks, clarification needs, and active hard stops.
6. Calculate deterministic readiness scores.
7. Prepare compliance actions, supplier RFQs, and pricing scenarios.
8. Generate a printable Bid Readiness Report.

---

## Core Features

### Evidence-first solicitation analysis
Critical findings are classified as:

- `Fact`
- `Inference`
- `Not Found`
- `Needs Clarification`

Where available, BidPilot preserves document and page evidence rather than presenting unsupported conclusions.

### Deterministic bid-readiness scoring
The model does not author the final numeric scores. BidPilot computes the final readiness dimensions in application code after structured extraction and normalization.

Current dimensions include:

- Technical Fit
- Commercial Fit
- Compliance Readiness
- Delivery Feasibility
- Past Performance Fit
- Supplier Readiness
- Deadline Feasibility

Unknown bidder capability lowers confidence and creates a review action. It is not automatically treated as confirmed noncompliance.

### Canonical requirement architecture
Equivalent solicitation language is mapped into stable application-owned concepts such as:

- `SUBMISSION_DEADLINE`
- `SUBMISSION_METHOD`
- `ATTACHMENT_SIZE_LIMIT`
- `AUTHORIZED_SIGNATURE`
- `SUPPLIER_REGISTRATION`
- `TAX_DOCUMENTATION`
- `INSURANCE_REQUIREMENTS`
- `FOB_DESTINATION_PRICING`
- `DELIVERY_LEAD_TIME`
- `TECHNICAL_COMPLIANCE`
- `INSTALLATION_REQUIRED`
- `TRAINING_REQUIRED`
- `WARRANTY_REQUIRED`
- `LASER_SAFETY_COMPLIANCE`
- `DEBARMENT_CERTIFICATION`
- `PRICE_VALIDITY_PERIOD`

Repeated evidence is deduplicated before scoring so equivalent requirements do not inflate readiness calculations.

### Mission Control
The command-center interface surfaces:

- Recommendation
- Fit score
- Deadline
- Agency
- Solicitation number
- Active hard stops
- Disqualification risks
- Clarification gates
- Dimension-level readiness scores

### Compliance workspace
Requirements are presented as an operational flow:

**Requirement → Evidence → Bidder Status → Action**

### Clarification Center
Questions are organized by who needs to answer them:

- Buyer / Contracting Officer
- Internal Bid Team
- Supplier / Manufacturer

### Deterministic pricing workspace
Pricing calculations are performed locally in application code, including:

- Landed cost
- Margin
- Markup
- Break-even price
- Extended bid amount
- Aggressive / Target / Conservative scenarios

### Supplier RFQ workspace
BidPilot helps turn solicitation-supported requirements into supplier quote requests and sourcing actions.

### Printable Bid Readiness Report
Users can export a report containing the opportunity summary, decision drivers, compliance requirements, clarifications, pricing information, action items, and evidence notes.

---

## Architecture

```text
PDF / Solicitation Documents
        ↓
AI Evidence Extraction with GPT-5.6
        ↓
Structured Output Validation
        ↓
Deterministic Evidence Classification
        ↓
Code-Owned Canonical Requirement Mapping
        ↓
Requirement Deduplication
        ↓
Deterministic Bidder-State Evaluation
        ↓
Deterministic Dimension Scoring
        ↓
Deterministic Overall Recommendation
        ↓
Compliance / Pricing / Supplier / Clarification / Report Workflows
```

The architecture intentionally separates probabilistic document understanding from deterministic business decisioning.

---

## How GPT-5.6 Is Used

GPT-5.6 powers the solicitation-understanding layer.

It is used to interpret procurement language and extract structured evidence such as:

- Deadlines
- Submission instructions
- Award basis
- Technical requirements
- Commercial terms
- Insurance obligations
- Supplier registration requirements
- Certifications
- Freight and delivery requirements
- Clarification needs

The model is **not** trusted to directly determine final scores or hard-stop outcomes. Those decisions are handled downstream by deterministic application logic.

The OpenAI model remains configurable through `OPENAI_MODEL` and defaults to `gpt-5.6` when unset.

---

## How Codex Was Used

Codex was a core part of the OpenAI Build Week development workflow.

It was used to rapidly:

- Build the initial Next.js application
- Refactor the MVP into the evidence-first V2 architecture
- Implement structured output handling and validation
- Build deterministic scoring and canonical requirement systems
- Improve PDF handling and multi-document support
- Add safety checks and prompt-injection resistance
- Create regression tests
- Debug score instability and requirement deduplication
- Improve the command-center frontend
- Diagnose and fix production client-side rendering failures

A major development focus was identifying where probabilistic AI behavior was influencing business-critical decisions, then moving those responsibilities into deterministic code.

---

## Real Analysis vs Demo Data

Real uploaded solicitations never silently fall back to fictional demo data.

The `/api/demo` path is the only intended source of fictional demo content.

For real analysis, missing API configuration, invalid files, unreadable PDFs, structured-output failures, or unsupported scanned-document paths return explicit errors instead of fabricated results.

---

## PDF Handling

BidPilot includes:

- PDF extension and MIME validation
- `%PDF-` magic-byte validation
- Empty-file checks
- File-size limits
- Multi-document package support
- Searchable-text extraction
- Document/page-aware evidence where reliable page mapping is available
- Safe handling for scanned or low-text PDFs

Current upload limits:

- Up to 5 PDFs per analysis
- Up to 25 MB per PDF

When a PDF has no selectable text, BidPilot can attempt the OpenAI Responses API file-input path with the configured model. If the file cannot be analyzed reliably, the request fails safely and asks for a searchable/OCR copy.

---

## Trust and Safety Design

- API keys remain server-side.
- Solicitation contents are treated as untrusted input.
- Prompts include anti-injection guidance.
- Structured outputs are validated before decisioning.
- Critical missing data is not invented.
- Unknown bidder readiness is not converted into automatic noncompliance.
- Ordinary rejection rules are treated as disqualification risks unless the bidder is confirmed unable to comply.
- `No Bid` requires a confirmed active hard stop or confirmed mandatory noncompliance.
- Missing optional summary fields are rendered null-safely so incomplete data cannot crash the application.

---

## Recommendation Logic

The current deterministic scoring weights are:

- Technical Fit: 25%
- Compliance Readiness: 20%
- Commercial Fit: 15%
- Delivery Feasibility: 15%
- Supplier Readiness: 10%
- Past Performance Fit: 5%
- Deadline Feasibility: 10%

High-level recommendation behavior:

- **No Bid** — confirmed active hard stop or confirmed mandatory compliance failure.
- **Bid** — sufficient weighted readiness with no active hard stops and no unresolved blocking clarification needs.
- **Needs Review** — unresolved mandatory unknowns, clarification needs, or moderate readiness risk remain.

---

## Tech Stack

- OpenAI GPT-5.6
- OpenAI Responses API
- OpenAI Codex
- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel
- GitHub

---

## Project Structure

```text
app/
  api/analyze/       Real solicitation analysis endpoint
  api/demo/          Fictional demo endpoint
  page.tsx           Main BidPilot command-center UI

components/
  BidderProfilePanel.tsx
  SupplierQuotes.tsx

lib/
  ai/                OpenAI prompts, structured schema, extraction, validation
  decision/          Deterministic scoring and recommendation logic
  documents/         PDF validation and extraction helpers
  pricing/           Deterministic pricing calculator
  requirements/      Canonical requirement catalog and mapping
  ui/                Null-safe presentation helpers

tests/               Regression and behavioral tests
```

---

## Environment Variables

Create a local environment file with:

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.6
```

`OPENAI_API_KEY` is required for real solicitation analysis.

Do not commit secrets or confidential solicitation documents.

---

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Validation

```bash
npm run typecheck
npm run build
npm test
```

The test suite covers areas including:

- Deterministic pricing
- Margin and markup calculations
- Decision rules
- Structured output validation
- PDF validation
- Long-document retention
- Canonicalization and deduplication
- Clarification routing
- Score stability
- Missing optional summary-field null safety
- Protection against real-analysis fallback to fictional demo data

---

## Known Limitations

This OpenAI Build Week version does not yet include:

- User authentication
- Persistent database-backed projects
- Multi-user team collaboration
- Live SAM.gov or procurement-portal ingestion
- Automated addenda monitoring
- External supplier APIs
- Production-grade distributed rate limiting

Supplier quote tracking and bidder-profile readiness are currently lightweight browser/in-session workflows.

---

## OpenAI Build Week

BidPilot AI was built for **OpenAI Build Week** with a focus on one central question:

> How can powerful AI document understanding be combined with deterministic software so that high-stakes procurement workflows become more useful, traceable, and trustworthy?

BidPilot AI's answer is an evidence-first command center where AI extracts and understands, while code verifies and decides.

---

## Disclaimer

BidPilot AI provides AI-assisted solicitation analysis and decision support. Users should verify critical requirements, deadlines, legal obligations, and submission instructions against the official solicitation documents before submitting a bid.
