# 🧠 MindConnect — Student Wellness & Counseling Portal

> **Confidential University Mental Health, Counseling & Analytics Web Portal**  
> *Developed with React 19, Vite, Tailwind CSS v4, Chart.js, and HCI Heuristic Design Standards.*

---

## 🌟 Live Demo & Quick Access

- **GitHub Repository**: [https://github.com/lewiitech-25/mindconnect](https://github.com/lewiitech-25/mindconnect)
- **Live Web Preview**: [https://lewiitech-25.github.io/mindconnect/](https://lewiitech-25.github.io/mindconnect/)

---

## ⚡ Instant Demo Credentials

You can test all 3 role perspectives on the login screen using the **1-Click Demo Buttons** or manual credentials:

| Role | Email Address | Password | Portal Features |
| :--- | :--- | :--- | :--- |
| **Student** | `student@university.edu` | `password` | Mood Tracker, Chart.js Trends, Counselor Booking Wizard, Self-Help Library |
| **Counselor** | `counselor@university.edu` | `password` | Student Consultation Queue, Shared Mood History Reviewer, Clinical Notes Form |
| **Admin** | `admin@university.edu` | `password` | Campus Stress Analytics Bar Chart, Counselor Capacity Roster, 988 Crisis Audit Logs |

---

## 🛠️ How to Clone & Run Locally from GitHub

Anyone cloning this repository can launch the project locally in under 60 seconds:

### Step 1: Clone Repository
```bash
git clone https://github.com/lewiitech-25/mindconnect.git
cd mindconnect
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/` (or the port shown in your terminal).

---

## 🏗️ Technical Architecture & Features

- **React 19 + Vite**: High-performance single page web app architecture.
- **Tailwind CSS v4 + Behance Medical SaaS Theme**: Deep navy-slate ambient canvas (`#0B0F19`) with glowing spotlights and 100% high-contrast readable typography (`#0F172A`).
- **Chart.js & React-Chartjs-2**: Interactive line & bar charts for mood analytics and department stress metrics.
- **Firebase Integration Modules**: Built-in support for Firebase Auth & Firestore (`src/firebase/`).
- **HCI Principles**: Built strictly following Nielsen's 10 Usability Heuristics (Low Cognitive Load, Clear Feedback, Instant Recovery).

---

## 📁 Project Structure

```
mindconnect/
├── public/
│   └── images/              # Realistic student portraits & campus media
├── src/
│   ├── components/          # Navbar, Sidebar, Footer, MoodCard, AppointmentCard
│   ├── firebase/            # Firebase config, user, mood, and appointment services
│   ├── pages/               # Home, Login, Register, Dashboard, Counselor, Admin, etc.
│   ├── App.jsx              # Role-Based Routing & Private Guards
│   └── index.css            # Behance SaaS design system & Tailwind styles
├── .github/workflows/       # GitHub Pages automated deployment workflow
├── vite.config.js           # Base relative path routing
└── package.json
```

---

## 📄 License & Academic Attribution
Developed for University HCI Project Presentation. All rights reserved © 2026.
