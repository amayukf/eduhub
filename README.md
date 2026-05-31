# Learning Management System (LMS)

A full-featured Learning Management System built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🔐 Authentication
- Login / Register with Supabase Auth
- Role-based access control (Teacher / Student)
- Session persistence

### 👩‍🏫 Teacher Portal
- **Dashboard**: Overview with stats
- **Courses**: Create, edit, publish courses
- **Notes**: Rich text editor to create lecture notes
- **Worksheets**: Upload and manage PDF worksheets
- **Quizzes**: Quiz builder with multiple question types (MCQ, True/False, Short Answer)
- **Submissions**: Grade student submissions

### 🎓 Student Portal
- **Dashboard**: Progress tracking, upcoming deadlines
- **Courses**: Browse and enroll in courses
- **Notes**: Read lecture notes, mark as read
- **Worksheets**: View and submit assignments
- **Quizzes**: Timed quiz interface with auto-grading
- **Results**: View quiz results and feedback

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **Zustand** for state management
- **TipTap** for rich text editing
- **Lucide React** for icons
- **Supabase** for backend (Auth, Database, Storage)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account (https://supabase.com)

### Supabase Setup

1. **Create a new project** on Supabase (https://supabase.com/dashboard)

2. **Copy your project URL and anon/public key** - you'll find these in your Supabase project's API settings

3. **Create a `.env` file** in the root of your project with:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. **Run the database schema** - copy the contents of `supabase-schema.sql` and execute it in your Supabase SQL Editor (go to your project → SQL Editor → New query → paste and run)

5. **Create demo users** (optional):
   - Go to Supabase → Authentication → Add user
   - Create a user with email `demo@teacher.com` and password `demo123`
   - Create a user with email `demo@student.com` and password `demo123`
   - The profiles table will be automatically populated via the trigger (check Supabase → Table Editor → `profiles`)

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

Then open your browser and go to `http://localhost:5173` (or the URL shown in your terminal).

## Project Structure

```
src/
├── components/       # Reusable components
│   └── Sidebar.tsx
├── pages/           # Page components
│   ├── teacher/     # Teacher portal pages
│   ├── student/     # Student portal pages
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── store/           # Zustand store
│   └── useStore.ts
├── lib/             # Libraries
│   └── supabase.ts  # Supabase client
├── types.ts         # TypeScript definitions
├── App.tsx
├── main.tsx
└── index.css        # Global styles with Tailwind
```

## License

MIT
