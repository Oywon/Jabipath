# ♿ AccessJU — Accessible Campus Navigation for Jahangirnagar University

> A public, no-login accessible navigation system for Jahangirnagar University (JU) students and visitors — featuring wheelchair-friendly routes, real-time elevator/ramp detection, voice-guided navigation, and fare information between campus locations.

![AccessJU Logo](./public/logo.png)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [What's New](#whats-new)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About the Project

Students with disabilities at Jahangirnagar University face significant challenges navigating the campus — inaccessible routes, no ramp/elevator information, and no guidance system tailored to their needs.

**AccessJU** solves this by providing a fully public, zero-friction navigation tool:
- No account or login needed — just open and navigate
- Smart accessible route planner built specifically for JU's real campus map
- Fare information between any two campus locations
- Voice-guided turn-by-turn navigation
- Community-driven issue reporting (anonymous)

---

## 🆕 What's New

| Update | Details |
|---|---|
| 🔓 Public Access | Removed authentication — no login required, open to everyone |
| 🗺️ Updated JU Map | Real updated campus map of Jahangirnagar University as the base layer |
| 🏷️ JU Logo | Official logo added to the navbar/header |
| 💰 Fare Chart | Fare information between any origin and destination on campus |

---

## ✨ Features

### 🔓 Public & Instant Access
- Zero friction — the map loads immediately with no sign-in
- Works for students, visitors, staff, and anyone on campus
- Anonymous issue reporting supported

### 🗺️ Real JU Campus Map
- Updated Jahangirnagar University campus map as the base layer
- Interactive nodes overlaid on the real map (buildings, elevators, ramps)
- JU logo displayed in the top navigation bar

### ♿ Wheelchair-Friendly Navigation
- Node-based routing with Dijkstra's algorithm
- Route filters: wheelchair accessible / has ramp / has elevator
- Avoids stairs automatically when accessibility mode is on
- Data-driven from Supabase `nodes` and `edges` tables

### 💰 Fare Chart
- Select origin → destination to instantly view the fare
- Fare card displayed alongside route directions
- Powered by Supabase `fares` table
- Supports multiple currency formats

### 🔊 Voice-Guided Navigation
- Turn-by-turn voice instructions via Web Speech API
- Announces ramps, elevators, fares, and landmarks
- Toggle on/off from the UI at any time

### 🚧 Infrastructure Status & Reporting
- Real-time elevator/ramp status (working / out of service)
- Anyone can submit anonymous issue reports
- Reports stored in Supabase for admin review

### 📊 Analytics (PostHog)
- Tracks route searches, fare lookups, feature usage, and issue reports
- Helps identify the most-used paths and underserved campus areas

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Map | Real JU Campus Map Image + SVG Node Overlay |
| Routing Algorithm | Dijkstra's (client-side) |
| Voice Navigation | Web Speech API |
| Analytics | PostHog |
| UI Prototyping | Bolt.new |

> 🔐 Authentication has been removed. The app is fully public.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────┐
│                  React Frontend                   │
│                                                   │
│  ┌───────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Map UI   │  │  Fare Chart  │  │ Voice Nav │ │
│  │ (Real JU) │  │  (Origin →   │  │(Web Speech│ │
│  │   Map)    │  │   Dest Fare) │  │   API)    │ │
│  └─────┬─────┘  └──────┬───────┘  └─────┬─────┘ │
└────────┼───────────────┼────────────────┼────────┘
         │               │                │
         ▼               ▼                │
   ┌───────────────────────────┐          │
   │         Supabase          │          │
   │  nodes / edges / fares /  │          │
   │         reports           │          │
   └───────────────────────────┘          │
                                          ▼
                                   ┌─────────────┐
                                   │   PostHog   │
                                   │ (Analytics) │
                                   └─────────────┘
```

---

## 🗄️ Database Schema

### `nodes`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | Building or point name |
| type | TEXT | building / elevator / ramp / path |
| lat | FLOAT | Latitude coordinate |
| lng | FLOAT | Longitude coordinate |
| accessible | BOOLEAN | Whether the node is accessible |

### `edges`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| from_node | UUID | FK → nodes.id |
| to_node | UUID | FK → nodes.id |
| distance | FLOAT | Distance in meters |
| is_accessible | BOOLEAN | Wheelchair accessible route |
| has_elevator | BOOLEAN | Route includes elevator |
| has_ramp | BOOLEAN | Route includes ramp |

### `fares`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| from_node | UUID | FK → nodes.id (origin) |
| to_node | UUID | FK → nodes.id (destination) |
| fare_amount | NUMERIC | Cost of travel |
| currency | TEXT | Default: BDT |

### `reports`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| node_id | UUID | FK → nodes.id |
| issue_description | TEXT | Description of the problem |
| status | TEXT | open / in_progress / resolved |
| created_at | TIMESTAMP | Report submission time |

> ✅ No `users` table needed — authentication has been removed.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Supabase account
- PostHog account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/accessju.git
cd accessju

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and PostHog keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the campus map loads immediately, no login needed.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostHog
VITE_POSTHOG_API_KEY=your_posthog_api_key
VITE_POSTHOG_HOST=https://app.posthog.com
```

> ⚠️ Firebase keys removed — no authentication in this version.
> ⚠️ Never commit your `.env.local` file. It is already listed in `.gitignore`.

---

## 📁 Project Structure

```
accessju/
├── public/
│   ├── logo.png                # JU official logo
│   └── ju-campus-map.png       # Updated JU campus map image
├── src/
│   ├── components/
│   │   ├── Map/                # Campus map + node overlay
│   │   ├── Navigation/         # Route display and directions
│   │   ├── FareChart/          # Fare lookup UI and display card
│   │   ├── VoiceNav/           # Web Speech API controls
│   │   └── Reports/            # Anonymous issue reporting UI
│   ├── hooks/
│   │   ├── useNavigation.js    # Routing logic hook
│   │   ├── useVoice.js         # Web Speech API hook
│   │   └── useFare.js          # Fare lookup hook
│   ├── lib/
│   │   ├── supabase.js         # Supabase client
│   │   ├── posthog.js          # PostHog config
│   │   └── dijkstra.js         # Pathfinding algorithm
│   ├── pages/
│   │   ├── Home.jsx            # Loads directly to map
│   │   └── Map.jsx             # Main navigation page
│   └── App.jsx
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🗺️ Roadmap

- [x] Project planning and architecture design
- [x] Removed authentication — fully public app
- [x] Updated real JU campus map integration
- [x] JU logo added to navbar
- [x] Fare chart (origin → destination) design
- [ ] Supabase schema setup and JU campus data seeding
- [ ] Interactive map with accessible node overlay
- [ ] Dijkstra's routing algorithm integration
- [ ] Fare lookup connected to Supabase
- [ ] Voice-guided navigation (Web Speech API)
- [ ] Elevator/ramp real-time status
- [ ] Anonymous issue reporting system
- [ ] PostHog analytics integration
- [ ] WCAG 2.1 AA accessibility audit
- [ ] Mobile PWA support
- [ ] Offline map caching

---

## 🤝 Contributing

Contributions are welcome — especially from JU students who know the campus layout well!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow WCAG 2.1 accessibility guidelines in all contributions.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
CSE Student, Jahangirnagar University
GitHub: [@your-username](https://github.com/oywon)

---

> Built with ❤️ to make Jahangirnagar University more accessible for everyone — no barriers, no login, just navigate.
