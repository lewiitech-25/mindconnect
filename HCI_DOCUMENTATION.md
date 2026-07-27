# 📚 Human-Computer Interaction (HCI) Project Documentation

## Project Name: MindConnect - Student Mental Wellness Portal
**Course**: Human-Computer Interaction (HCI)  
**Target User Group**: University Undergraduate & Postgraduate Students  
**Platform**: Responsive Web Application (Desktop, Tablet, Mobile)  

---

## 1. Problem Statement & Need Analysis

University students experience elevated levels of academic stress, exam anxiety, and sleep disruption. Despite campus counseling resources existing, student utilization remains low due to three major HCI friction points:
1. **Intimidating / Complex Interfaces**: University portals are often bloated, requiring many clicks to find counseling contacts.
2. **Privacy Concerns**: Students fear their personal mental health struggles will be exposed to faculty or logged in public databases.
3. **Lack of Immediate Self-Help Options**: When crisis strikes after office hours, traditional portals offer no interactive guidance.

### MindConnect Solution
MindConnect directly addresses these barriers by utilizing a **calm UI palette**, **3-click navigation paths**, **local-only data encryption**, and **24/7 self-service wellness tools**.

---

## 2. Nielsen's 10 Usability Heuristics Applied

| Heuristic | Application in MindConnect |
| :--- | :--- |
| **1. Visibility of System Status** | Clear feedback alerts on mood saving, appointment booking confirmation popups, and automated visual line charts. |
| **2. Match Between System & Real World** | Uses intuitive emotional terminology and universal emojis (😀, 🙂, 😐, 😟, 😢) that map directly to student feelings. |
| **3. User Control & Freedom** | One-click session cancellation, journal entry deletion, and an "Erase Account" privacy control. |
| **4. Consistency & Standards** | Uniform glassmorphic cards, standard icon sets (`React-Icons`), and consistent sidebar layout across all private pages. |
| **5. Error Prevention** | Form validation on registration/login, confirm dialogs before data deletion, and required field highlights. |
| **6. Recognition Rather than Recall** | Counselor bios, available time slots, and resource categories are visually presented as clickable cards rather than text inputs. |
| **7. Flexibility & Efficiency of Use** | Quick-action mood buttons on the dashboard for returning users vs. detailed journal entries on the Mood Tracker page. |
| **8. Aesthetic & Minimalist Design** | Uncluttered layouts, soft slate background (`#F8FAFC`), deep navy typography (`#1E293B`), and micro-animations. |
| **9. Help Users Recognize & Recover from Errors** | Descriptive inline error messages (e.g. "Passwords do not match" or "Please select a time slot"). |
| **10. Help & Documentation** | Comprehensive "Tip of the Day" cards, clinical self-help articles, and emergency crisis steps. |

---

## 3. Color Theory & Accessibility Rationale

- **Primary Blue (`#3B82F6`)**: Promotes feelings of tranquility, trust, and professional medical reliability.
- **Secondary Emerald Green (`#10B981`)**: Associated with balance, wellness, positive progress, and success.
- **Accent Yellow (`#FACC15`)**: Used for lighthearted badges and tip highlights to draw gentle attention without causing alarm.
- **Emergency Red (`#DC2626`)**: High-contrast, vibrant red reserved exclusively for urgent crisis helplines and immediate call triggers.
- **Typography (`Inter` & `Poppins`)**: Modern, high-legibility Google Fonts optimized for screen readability across high and low resolution displays.

---

## 4. Presentation & Defense Script for Students

When presenting this project to your lecturer, use this structured overview:

1. **Introduction (1 min)**:
   > "Good morning/afternoon, Lecturer. Our project is **MindConnect**, an HCI-focused mental wellness portal designed specifically to lower student friction when seeking emotional support during university."

2. **Demonstrating Usability & Aesthetics (2 mins)**:
   > "Notice our landing page uses calm color psychology, glassmorphism, and floating badges to create an inviting, stress-free first impression. According to HCI principles of cognitive load, a student in distress should never navigate complex menus. Our interface ensures any core task can be completed in under 3 clicks."

3. **Demonstrating the Core Features (3 mins)**:
   > - *Log in as `student@university.edu`*.
   > - *Show the Dashboard*: Point out the Chart.js mood trend visualization and daily tips.
   > - *Log a mood*: Click an emoji on the Mood Tracker to demonstrate system visibility.
   > - *Book Counseling*: Walk through the 3-step wizard (Counselor -> Date/Time -> Mode).
   > - *Highlight Emergency Page*: Show how the red high-contrast Emergency page provides immediate 1-click access to helplines.

4. **Conclusion & Privacy Highlight (1 min)**:
   > "Finally, MindConnect is privacy-first. All entries are stored locally on the user's browser, giving students complete confidence that their data remains confidential."
