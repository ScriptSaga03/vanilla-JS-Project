# 🎓 Student Pro Dashboard (MERN Stack Journey - Part 1)

A feature-rich **Student Management System** built with pure Vanilla JavaScript. This project focuses on complex logic building, data manipulation, and persistent state management without using any external libraries.

## 🚀 Live Demo : https://student-pro-dashboard.onrender.com/

## ✨ Key Features
- **CRUD Operations:** Create, Read, Update, and Delete student records.
- **Smart Search:** Debounced search functionality (500ms) to filter by Name, City, ID, or Grade.
- **Advanced Filtering:** Instant toggles for 'Pass', 'Fail', and 'All' students with active state management.
- **Data Normalization:** Automatically formats names and cities (e.g., "meHtAb" -> "Mehtab").
- **Dynamic Stats:** Real-time calculation of Total Students and Class Average.
- **Special Logic:** - **Grace Marks:** Auto-apply +5 marks to failing students.
  - **Topper Logic:** Find the overall class topper or city-specific topper using `Array.reduce`.
- **Persistence:** - **localStorage:** Saves student data across browser restarts.
  - **sessionStorage:** Remembers UI filters and form drafts (auto-save on input).

## 🛠️ Technical Stack
- **HTML5:** Semantic structure.
- **CSS3:** Responsive layout (Flexbox/Grid) with CSS variables.
- **JavaScript (ES6+):** - Object-Oriented approach.
  - Event Delegation.
  - Higher-Order Functions (`map`, `filter`, `reduce`, `sort`).
  - Debouncing technique for performance optimization.

## 📂 Project Structure
```text
├── index.html      # Application structure
├── styles.css      # Custom styling & Responsive Design
└── script.js       # Core application logic (Modular Object approach)



##Author : Mehtab
