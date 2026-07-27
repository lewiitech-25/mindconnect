# 🧠 MindConnect - University Student Mental Wellness Portal

> **Course Project**: Human-Computer Interaction (HCI) & Web Engineering  
> **Repository Owner**: [lewiitech-25](https://github.com/lewiitech-25)  
> **Project Status**: Completed & Verified  

---

## 📌 Executive Summary

**MindConnect** is a web-based student mental health and wellness management portal. Built using **React**, **Vite**, **Tailwind CSS v4.0**, and **Chart.js**, the application addresses the academic stress, anxiety, and burnout experienced by university students.

The primary objective of this project is to test whether applying **Human-Computer Interaction (HCI)** best practices—such as low-friction navigation, high-contrast visual hierarchy, calm color palettes, and privacy-first local data storage—improves student willingness to log emotional health and schedule campus counseling.

---

## 🎨 HCI Design Principles & Usability Features

This application was designed around five core HCI usability heuristics:

| HCI Heuristic | Implementation in MindConnect |
| :--- | :--- |
| **1. Minimal Cognitive Load** | 3-click maximum path to complete any task (e.g., booking a counseling session or recording daily mood). |
| **2. Visibility of System Status** | Real-time visual feedback badges, toast alerts, and automated weekly line charts tracking mood shifts over time. |
| **3. Privacy-First Architecture** | All personal notes, journal logs, and appointment records are stored locally on the student's device (`localStorage`), giving students complete data sovereignty and erasure control. |
| **4. Calm Visual Design & Aesthetic Comfort** | Uses curated HSL color tokens (Blue `#3B82F6` primary, Emerald `#10B981` secondary, Yellow `#FACC15` accent) paired with smooth 3D floating keyframe micro-animations to create a relaxing experience. |
| **5. Accessibility & Emergency Readiness** | Prominent red Emergency Help trigger on all private screens providing 1-click access to crisis helplines (988), campus security, and medical dispatch. |

---

## 🗺️ Website Flow & System Architecture

```text
Landing Page (Public) ──► Login / Register ──► Student Dashboard
                                                  ├── Mood Tracker (Chart Analytics & Logs)
                                                  ├── Resource Library (Videos & Articles)
                                                  ├── Counselor Booking (3-Step Wizard)
                                                  ├── Active Appointments Manager
                                                  ├── Profile & Privacy Settings
                                                  └── Emergency Help Center (24/7 Hotlines)
```

---

## 📱 Pages & Features Overview

### 1. Landing Page (`/`)
- **Hero Section**: Realistic student photography with floating 3D glassmorphic badges (`😀 Mood Status`, `📅 Counseling Booked`, `🔒 100% Encrypted`).
- **Features Grid**: Visual breakdown of core services (Mood Logging, Counseling, Resources, Crisis Assistance).
- **HCI Principles Showcase**: Explains privacy-first design and accessibility standards.
- **Student Testimonials**: Real student reviews with high-resolution portraits.

### 2. Authentication (`/login` & `/register`)
- Glassmorphic forms with real-time field validation.
- Auto-seeding of sample mood trend history for demonstration upon first sign-in.

### 3. Student Analytics Dashboard (`/dashboard`)
- **Dynamic Welcome Banner**: Personal greeting customized with student credentials.
- **Today's Mood Check-in**: Quick-click emoji check-in bar.
- **Weekly Mood Trend Chart**: Interactive Line Chart powered by **Chart.js**.
- **Upcoming Consultation Panel**: Displays next confirmed counseling session.
- **Tip of the Day**: Randomized daily mental health tips curated by campus clinicians.

### 4. Mood Tracker (`/mood`)
- Emoji emotional scale selector (Happy 😀, Good 🙂, Okay 😐, Stressed 😟, Sad 😢).
- Thought journal text area for recording stress triggers.
- History log entries rendered as responsive `MoodCard` components.
- Permanent history erasure control.

### 5. Wellness Resource Library (`/resources`)
- Categorized guides: *Stress Management*, *Anxiety*, *Depression*, *Meditation*, *Study Tips*.
- Interactive search bar and category filter tabs.
- Embedded YouTube mindfulness video player and article reader modals.

### 6. Counseling Booking (`/counseling`)
- **3-Step Wizard**:
  - *Step 1*: Select counselor bio (Dr. Jane Smith, Dr. John Doe, Dr. Karen Vance).
  - *Step 2*: Choose upcoming date (Monday, Tuesday, Wednesday) and time slot.
  - *Step 3*: Choose session mode (*Telehealth Video* or *In-Person*) and fill optional notes.

### 7. Appointments Manager (`/appointments`)
- View active confirmed consultations.
- Attendance policy guidelines.
- Instant session cancellation trigger with confirmation dialogs.

### 8. Emergency Help Center (`/emergency`)
- High-contrast, high-visibility emergency red layout.
- Immediate call triggers for National Crisis Line (988), Campus Security, Clinic Coordinator, and Peer Support.
- Step-by-step crisis stabilization instructions.

### 9. Profile & Settings (`/profile`)
- Displays registered student details (Student ID, Course, Year).
- Password change module.
- Notification toggles (SMS, Email, Reminders).
- Nuclear account data erasure button.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 (JavaScript)
- **Build Tool**: Vite 8
- **Styling & Theme**: Tailwind CSS v4.0 (via `@tailwindcss/vite` plugin)
- **Data Visualization**: Chart.js & React-Chartjs-2
- **Icons**: React Icons (FontAwesome / Feather)
- **Routing**: React Router DOM v7
- **Storage**: Browser LocalStorage (No backend server required for testing)

---

## 🎓 Lecturer Grading Guide & Setup Instructions

To test and grade this application locally:

### 1. Clone & Install
```bash
git clone https://github.com/lewiitech-25/mindconnect.git
cd mindconnect
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in Google Chrome or any modern browser.

### 3. Test Credentials for Grading
| Credential | Value |
| :--- | :--- |
| **Demo Email** | `student@university.edu` |
| **Demo Password** | `password` |

*(You can also register a new account on the `/register` page. All data will persist locally).*

---

## 👥 Group Project Contributions

| Member Name | Role / Tasks |
| :--- | :--- |
| **Lewis Mwangi** | HCI Design, Component Engineering, Tailwind CSS Styling, Routing & Chart Integration |
| **[Group Member 2]** | User Research, Usability Testing & Documentation |
| **[Group Member 3]** | Content Curation, Emergency Protocols & Presentation Preparation |
| **[Group Member 4]** | |



---

## 📄 License & Academic Integrity

This project is submitted in fulfillment of academic coursework. All student photographs and imagery used are high-resolution media generated for educational demonstration purposes.
