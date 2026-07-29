# MindConnect - Student Mental Wellness Portal

**MindConnect** is a responsive React application built with Vite, Tailwind CSS v4.0, Chart.js, and React Icons. It is designed around Human-Computer Interaction (HCI) standards to provide university students with a confidential space to track daily moods, schedule counseling consultations, access wellness resources, and find emergency support.

---

## 🚀 Quick Start for Group Members

To run this project on your machine:

1. **Extract the ZIP file** to your preferred folder.
2. Open terminal/Command Prompt inside the `mindconnect` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🌟 Demo Credentials & Seed Data

- **Default Test Student**:
  - **Email**: `student@university.edu`
  - **Password**: `password`
- **Automatic Seed Data**:
  - Logging in as the test student (or registering a new account) automatically populates historical mood data so the **Mood Trend Chart** displays realistic weekly data immediately.

---

## 📂 Project Structure

```text
mindconnect/
├── public/
│   └── images/            # High-res student photography & portraits
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx           # Responsive public navigation
│   │   ├── Sidebar.jsx          # Collapsible student app navigation
│   │   ├── Footer.jsx           # Public page footer with crisis warnings
│   │   ├── MoodCard.jsx         # Confidential mood log card
│   │   ├── AppointmentCard.jsx  # Counseling appointment status card
│   │   └── ResourceCard.jsx     # Media & article reader card
│   ├── pages/             # Portal pages
│   │   ├── Home.jsx             # Animated landing page
│   │   ├── Login.jsx            # Glassmorphic sign-in page
│   │   ├── Register.jsx         # Student registration page
│   │   ├── Dashboard.jsx        # Analytics dashboard & weekly mood chart
│   │   ├── MoodTracker.jsx      # Daily emotional check-in & journal
│   │   ├── Resources.jsx        # Searchable guides & guided videos
│   │   ├── Counseling.jsx       # 3-step counselor booking wizard
│   │   ├── Appointments.jsx     # Scheduled session manager
│   │   ├── Profile.jsx          # Academic profile & notification settings
│   │   └── Emergency.jsx        # High-contrast crisis helpline center
│   ├── App.jsx            # Router, Public/Private Layouts, & Auth guards
│   ├── index.css          # Tailwind CSS v4 setup & float keyframes
│   └── main.jsx           # React root entry point
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration with @tailwindcss/vite
```

---

## 🎯 Presentation Demo Flow

During your group presentation, follow this flow:
1. **Landing Page**: Show the hero section with floating badges and realistic student images.
2. **Student Login**: Click **Student Login** and sign in using `student@university.edu` / `password`.
3. **Dashboard**: Highlight the welcome callout, weekly mood chart trend, and use the quick mood selector (😀).
4. **Mood Log**: Open **Mood Tracker** to show daily check-in options and confidential entries.
5. **Resource Library**: Open **Resources**, use the category filters (e.g. *Meditation*), and open an article or video.
6. **Book Counseling**: Go to **Book Counselor**, pick a counselor (Dr. Jane Smith), select a day and time slot, and confirm.
7. **Appointments**: Verify the new appointment appears on the **Appointments** page.
8. **Emergency**: Click the red **EMERGENCY HELP** button to demonstrate the high-contrast crisis assistance directory.
