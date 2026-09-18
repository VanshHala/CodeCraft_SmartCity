# CivicPulse — Intelligent Civic Issue Lifecycle & Risk-Aware Routing Platform

**Track:** SmartCity Tech — Civic Engagement & Urban Mobility Software
**Event:** Technofora '26 CodeCraft Hackathon, ISA Students' Chapter, Nirma University

## Problem Statement

Urban communities thrive when public infrastructure is reliable, streets are safe, and transportation flows efficiently — but cities struggle to identify and address neighborhood problems in real time. Citizens frequently observe broken infrastructure, transit delays, or safety risks without a convenient, responsive channel to report them, and even when they do, most civic-reporting apps treat every report as a separate, equally-weighted ticket, drowning authorities in duplicate noise with no real sense of what's actually urgent.

## Proposed Solution

CivicPulse is an intelligent civic issue lifecycle platform that converts citizen observations into prioritized, location-aware tasks and coordinates their resolution across city authorities and field workers — built on a shared, risk-aware road graph that also powers citizen routing.

The pipeline: a citizen reports an issue (photo + optional description + GPS) → an AI classification layer extracts issue type, severity, and department (never the assignment decision) → a duplicate-detection engine merges it into an existing civic issue if one already exists nearby → a deterministic priority formula (severity × cluster size × recency × structural criticality) ranks it → the authority dashboard verifies and assigns a worker → the worker navigates via the same road graph and resolves the issue → the citizen is notified.

That same road graph, precomputed once from real OpenStreetMap data with betweenness centrality, also answers a second question for citizens directly: given a start and destination, is the *fastest* route or the *safest* route (avoiding roads with open, high-severity issues) preferable — using the identical shortest-path algorithm with only the edge-cost function swapped.

## Features

- Photo + GPS civic issue reporting with automatic duplicate/cluster detection (Haversine distance + time-window clustering)
- Deterministic, explainable priority scoring (severity × cluster size × recency decay × graph-centrality criticality)
- Real road-graph-based routing with a fastest/safest toggle (Dijkstra/A*, swappable edge-cost function)
- Authority dashboard: verify AI classification, override priority, assign/reassign workers, monitor departments
- Worker app: prioritized task list, one-tap navigation, before/after resolution capture
- AI-based issue classification (Gemini) with a keyword-based fallback for reliability
- *(List any additional stretch features you complete: heatmaps, City Health Score, predictive flood alerts, reporter trust score, SLA tracking, reward system, voice intake, civic copilot)*

## Tech Stack

- **Backend:** Java 17, Spring Boot 3, PostgreSQL 15
- **Frontend:** React 18, Vite, Leaflet.js, Tailwind CSS
- **Offline graph preprocessing:** Python 3, OSMnx, NetworkX (Brandes' betweenness centrality)
- **AI:** Google Gemini API (issue classification), with a keyword-based fallback
- **Auth:** JWT (Spring Security)
- **Deployment:** Render/Railway (backend + DB), Vercel/Netlify (frontend)

## System Architecture

```
Citizen App (React + Leaflet)
      |  POST /api/reports (photo, text, GPS)
      v
Backend API (Spring Boot) -----> Gemini AI (classify: type, severity, department)
      |        |        |
      |        |        +--> Road Graph Service (in-memory, precomputed centrality)
      |        |                   ^
      |        |                   | built offline from Overpass/OSM data
      |        +--> Priority Scoring Engine --> PostgreSQL
      +--> Duplicate/Cluster Engine (Haversine + time window) --> PostgreSQL
      |
      +--> Worker Assignment Engine --> PostgreSQL

Authority Dashboard (React) --> verify / reassign / monitor --> Backend API
Worker App (React, mobile-first) --> task list, navigate, mark-resolved --> Backend API
Citizen App <-- GET /api/route?mode=fastest|safest -- Road Graph Service
```

**Why one shared graph powers two products:** both "which issue is most urgent" and "which route is safest" ask the same underlying question — how risky/important is this road segment right now? The graph's precomputed `centralityScore` feeds the priority formula's criticality multiplier; the same graph's live `openFlaggedReports` count feeds the routing engine's risk-adjusted edge cost.

## APIs

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a user (CITIZEN / WORKER / AUTHORITY) |
| POST | `/auth/login` | Public | Returns JWT |
| POST | `/reports` | CITIZEN | Submit a report → triggers classification + dedupe + priority scoring |
| GET | `/reports/mine` | CITIZEN | List the citizen's own reports with cluster status |
| GET | `/clusters` | AUTHORITY | List issue clusters, sortable by priority/status/category |
| GET | `/clusters/{id}` | AUTHORITY/CITIZEN | Full detail of one civic issue |
| PATCH | `/clusters/{id}/verify` | AUTHORITY | Accept/correct the AI classification |
| PATCH | `/clusters/{id}/priority` | AUTHORITY | Manually override the computed priority score |
| PATCH | `/clusters/{id}/assign` | AUTHORITY | Assign/reassign a worker |
| GET | `/clusters/{id}/suggest-worker` | AUTHORITY | Ranked candidate workers (domain + priority + distance + workload) |
| GET | `/workers/{id}/tasks` | WORKER | Prioritized task list for one worker |
| PATCH | `/clusters/{id}/resolve` | WORKER | Submit before/after photos + notes, mark resolved |
| GET | `/route?fromLat=&fromLng=&toLat=&toLng=&mode=fastest\|safest` | Public | Dijkstra/A* over the road graph |
| GET | `/analytics/overview` | AUTHORITY | KPI totals for the dashboard |
| GET | `/analytics/health-score` | AUTHORITY | City Health Score per ward |
| GET | `/analytics/heatmap` | AUTHORITY | Point data for the heatmap layer |

Full request/response examples are in the project implementation plan (Section 9).

## Database

Core tables: `users`, `workers`, `issue_clusters` (the deduplicated civic issue), `reports` (raw citizen submissions, many-to-one into a cluster), `resolutions` (before/after evidence). Full schema with column types and indexes is in `docs/schema.sql` (see the implementation plan, Section 8, for the canonical version).

## Setup Instructions

### Prerequisites
- Java 17+, Maven
- Node.js 18+
- PostgreSQL 15
- Python 3.10+

### 1. Database
```bash
createdb civicpulse
```

### 2. Environment variables
```bash
cp .env.example .env
# then fill in DB_URL, DB_USER, DB_PASSWORD, JWT_SECRET, and (optionally) GEMINI_API_KEY
```

### 3. Offline road graph (run once, or whenever you change the demo area)
```bash
cd graph-preprocessing
pip install -r requirements.txt
python build_graph.py --place "Nirma University, Ahmedabad, India" --out ../backend/src/main/resources/road_graph.json
```

### 4. Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

### 5. Frontend
```bash
cd frontend-citizen   # repeat for frontend-dashboard, frontend-worker if built as separate apps
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## How to Run the Project

1. Start PostgreSQL and create the `civicpulse` database.
2. Run the graph preprocessing script once (Step 3 above).
3. Start the backend, confirm it's up at `http://localhost:8080`.
4. Start the frontend(s), open `http://localhost:5173`.
5. Register a CITIZEN, AUTHORITY, and WORKER account, or use the seeded demo accounts below.
6. Submit a report from the Citizen App, then check the Authority Dashboard to see it appear, verify/assign it, and complete it from the Worker App.

## Third-Party APIs, Libraries & Datasets

- **OpenStreetMap / Overpass API** (via OSMnx) — road network data, no API key required
- **Google Gemini API** — issue classification (optional at runtime; keyword-based fallback included if no key is configured)
- **Leaflet.js + OpenStreetMap tiles** — mapping, no API key required
- **Open-Meteo** (if predictive alerts implemented) — weather forecast, no API key required
- **NetworkX** — Brandes' betweenness centrality implementation used in offline graph preprocessing

All licenses for the above are open-source/free-tier and compliant with the hackathon's third-party API/library rules. No API keys are committed to this repository — see `.env.example`.

## AI-Assisted Development Disclosure

*(Fill in honestly based on your actual process, e.g.:)* Boilerplate CRUD scaffolding, this README, and the overall implementation plan were AI-assisted. The core algorithms — duplicate detection, priority scoring, the risk-weighted routing cost functions, and worker assignment — were designed and implemented by the team, and every member can explain and defend their portion in a live walkthrough.

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Citizen | demo.citizen@civicpulse.test | *(set at seed time)* |
| Authority | demo.authority@civicpulse.test | *(set at seed time)* |
| Worker | demo.worker@civicpulse.test | *(set at seed time)* |

## Deployment

- Backend: *(Render/Railway URL)*
- Frontend: *(Vercel/Netlify URL)*

## Team

*(List team members and their primary contributions here — see the implementation plan's team task split for a suggested division of ownership.)*
