 HEAD
# ImpactSphere AI — Smart Social Impact Platform

> *"Turn compassion into measurable impact."*

ImpactSphere AI connects volunteers with verified social causes, equips non-profits (NGOs) with operational tooling for volunteer and event management, and transforms verified field records into transparent, auditable impact reports.

---

## 🌍 Platform Overview & Architecture

ImpactSphere AI is built with a decoupled modern architecture designed for speed, verifiability, and resilience:

```
                        ┌──────────────────────────────────────────┐
                        │          ImpactSphere AI Web App         │
                        │   React 18 + TypeScript + Tailwind CSS   │
                        │        Lucide Icons + Recharts UI        │
                        └────────────────────┬─────────────────────┘
                                             │ REST API / Fallback Cache
                                             ▼
                        ┌──────────────────────────────────────────┐
                        │          FastAPI Backend Service         │
                        │         (Python 3.9+ / Pydantic v2)      │
                        ├────────────────────┬─────────────────────┤
                        │ • RBAC Simulator   │ • Cause Matching    │
                        │ • Opportunity API  │ • Grounded RAG      │
                        │ • NGO Management   │ • Report Generation │
                        └────────────────────┼─────────────────────┘
                                             │
                        ┌────────────────────┴─────────────────────┐
                        │   Structured Storage & Knowledge Base    │
                        │ • Supabase / PostgreSQL Schema           │
                        │ • Chunked NGO Policy & Field Manuals     │
                        │ • Immutable Activity & Audit Ledger      │
                        └──────────────────────────────────────────┘
```

---

## 🎨 Design System

ImpactSphere AI adheres strictly to the custom social-impact SaaS tokens:
- **Forest Green (`#143D2A`)**: Core primary brand and navigation headers.
- **Primary Green (`#23834A`)**: Primary action buttons, badges, and positive metrics.
- **Lime Accent (`#B7E36B`)**: Highlights, pills, and active status indicators.
- **Warm Ivory (`#F7F7F0`)**: Page canvas background, subtle card borders, and warm neutral shading.
- **White Cards (`#FFFFFF`)**: High contrast readable typography, subtle shadows, and rounded cards.
- **Typography**: Clean Plus Jakarta Sans font stack with responsive mobile layouts.

---

## 🚀 All 9 Pages Implemented

1. **`/` — Landing Page**:
   - Hero with impact statistics counter and trust indicators.
   - Quick cause categories carousel.
   - Featured opportunities with real-time slot counters.
   - 4-step verified workflow (Algorithmic Fit → Active Service → Audit & Sign-off → Transparent Reports).
   - Responsible AI commitment banner.

2. **`/causes` — Cause Directory**:
   - Filter by category (`Environment`, `Education`, `Food Security`, `Social Inclusion`).
   - Keyword search across titles, descriptions, and UN Sustainable Development Goals (SDGs).
   - Metrics cards showing active opportunities, volunteers engaged, and verified hours.

3. **`/opportunities` — Volunteering Opportunities**:
   - Live multi-dimensional filtering (category, skill, schedule, remote/in-person status, query).
   - **Configurable Weighted Matching Tuner**: Custom volunteer skill tagging and live sliders for skill (35%), cause (25%), availability (20%), and location (20%) weights.
   - Transparent score explanations without probabilistic claims.
   - Interactive Detail View with NGO verification status.
   - **Application Submission Workflow**: In-app modal with motivation statement, skills selection, and confirmation reference codes.

4. **`/dashboard` — Volunteer Hub**:
   - Personalized volunteer profile (Alex Chen, Impact Star Level 3, verified hours, community points).
   - Live application tracking (`pending`, `accepted`, `rejected`).
   - Supervisor-verified activity history with countersigned hours.
   - High-alignment recommendations based on active profile.

5. **`/impact` — Evidence-Backed Impact Ledger**:
   - Recharts visual analytics: Monthly verified hours trajectory area chart and cause distribution pie chart.
   - Verified metric cards: Volunteer hours, beneficiaries served, economic impact valuation ($31.80/hr Independent Sector Standard), and active audited NGOs.
   - Verifiable Field Activity Ledger table: Event title, date, attendees, logged hours, proof type (`photo_audit`, `gps_checkin`, `countersigned_roster`), and accession reference IDs.
   - Explicit data integrity guarantee and non-fabrication disclaimer.

6. **`/assistant` — AI Impact Assistant (Grounded RAG)**:
   - Constrained to verified NGO field manuals, child safeguarding policies, and annual reports.
   - Structured citation cards displaying document title, organization name, type, and excerpt.
   - Grounding status badge and honest refusal when context is missing (prevents hallucination).
   - Pre-built sample prompt chips for quick exploration.

7. **`/ngo` — NGO Operations Workspace**:
   - Multi-organization selector (GreenCanopy, CodePathways, NourishAll, Pacific Shore Watch).
   - Review volunteer applications with 1-click Accept / Decline.
   - **Attendance & Hours Verification Tool**: Select volunteer, input hours, add supervisor audit notes, and countersign.
   - **Draft Impact Report Generator**: 1-click synthesis strictly segregating measured facts, economic models, missing evidence alerts, and AI narrative.
   - Coordinator Human Sign-off & Publish button.
   - Organization verification status badge with Admin approval actions.

8. **`/about` — Mission & Responsible AI**:
   - Mission statement, core pillars, and 4-Part AI Accountability Charter.
   - ImpactSphere Evidence Hierarchy (Tier 1 Gold GPS check-ins down to Tier 3 provisional self-reports).

9. **`/contact` — Validated Inquiries**:
   - Interactive form with real-time field validation (name, email format, role, category, message minimum length).
   - Submits inquiry and returns a tracked ticket reference ID.

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **React 18** with **TypeScript** and **Vite 6**
- **Tailwind CSS 3** with custom theme extension
- **Lucide React** for lightweight accessible icons
- **Recharts 2** for responsive SVG data visualizations
- Client-side resilience layer ensuring 100% offline interactivity

### Backend
- **Python 3.9+** with **FastAPI**
- **Pydantic v2** for strict schema validation
- **Uvicorn** ASGI server
- **Pytest** with **HTTPX** for automated test suites
- **Google GenAI SDK (`google-genai`)** with fallback for grounded question answering

---

## ⚡ Setup & Execution

### 1. Backend Setup

```bash
# Navigate to project root
cd /Users/shashi.../.gemini/antigravity/scratch/impactsphere

# Activate virtual environment
source venv/bin/activate

# Run backend test suite
PYTHONPATH=backend pytest backend/tests/test_backend.py -v

# Start FastAPI server (runs on port 8000)
PYTHONPATH=backend uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd /Users/shashi.../.gemini/antigravity/scratch/impactsphere/frontend

# Build frontend production bundle
npm run build

# Start Vite development server (runs on port 5173 with proxy to backend)
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root if you wish to configure live third-party integrations:

```env
# Optional: Set Gemini API Key to enable live generative reasoning with Gemini 2.5 Flash
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase configuration (when deploying PostgreSQL backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

*Note: If `GEMINI_API_KEY` is omitted, the application operates deterministically using its built-in knowledge retrieval engine without synthetic hallucinations.*

---

## 🧪 Testing Results

Backend test suite verified with Pytest:
```
============================== 8 passed in 0.30s ===============================
backend/tests/test_backend.py::test_health_endpoint PASSED               [ 12%]
backend/tests/test_backend.py::test_causes_endpoint PASSED               [ 25%]
backend/tests/test_backend.py::test_opportunities_filtering PASSED       [ 37%]
backend/tests/test_backend.py::test_matching_algorithm_weights_and_reasons PASSED [ 50%]
backend/tests/test_backend.py::test_rag_assistant_grounded_and_refusal PASSED [ 62%]
backend/tests/test_backend.py::test_impact_report_generation_segregation PASSED [ 75%]
backend/tests/test_backend.py::test_application_and_attendance_workflow PASSED [ 87%]
backend/tests/test_backend.py::test_ngo_verification_lifecycle PASSED    [100%]
```

Frontend production build verified with Vite + TypeScript compiler:
```
✓ 2222 modules transformed.
dist/index.html                   1.51 kB │ gzip:   0.80 kB
dist/assets/index-CJcneCvl.css   35.24 kB │ gzip:   6.38 kB
dist/assets/index-Clv461ZB.js   703.15 kB │ gzip: 191.96 kB
✓ built in 2.28s
```

---

## 🛡️ Security, Privacy & Integrity

1. **Role-Based Access**: Multi-persona simulation allows testing from Volunteer, NGO Coordinator, and Platform Auditor perspectives.
2. **Deterministic Matching**: Scores are calculated using explicit linear weights and never presented as acceptance probabilities.
3. **No Fabricated Impact**: Data models strictly isolate measured physical logs from modeled economic multipliers ($31.80/hr).
4. **Grounded Refusal**: If a question asked to the AI assistant has no verified backing chunks in the knowledge base, it explicitly refuses to invent facts.
 git pull --no-rebase origin main --allow-unrelated-histories
 