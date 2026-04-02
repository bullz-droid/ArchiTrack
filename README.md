# 🏗️ ArchiTrack

**The Digital Studio for Architecture Students.**

ArchiTrack is a minimalist, high-performance platform designed to bridge the gap between studio workflow and professional portfolio presentation.

## 🚀 Live Environment

* **Backend**: [Railway](https://railway.app)
* **Frontend**: [Vercel](https://vercel.com)
* **Database**: [Supabase](https://supabase.com)

## 📁 Core Features

* **STUDIO WORKSPACE**: Centralized dashboard with real-time deadline alerts and course-based project organization.
* **ARCHI LIBRARY**: A professional asset manager for CAD exports, high-res renders, and studio PDFs. Supports signed URLs for secure sharing.
* **DESIGN LOG**: A markdown-ready note system for capturing site analysis, concept iterations, and critique feedback.
* **PORTFOLIO GENERATOR**: Instantly turn curated studio projects into a professional, public-facing gallery with a unique URL.

## 🛠️ Tech Stack

* **Client**: React 18, Tailwind CSS (Custom Studio Theme), Lucide Icons, Axios.
* **Server**: Node.js, Express.js.
* **Auth & Data**: Supabase Auth (JWT), PostgreSQL (RLS enabled), Supabase Storage.
* **Deployment**: CI/CD via GitHub to Railway (API) and Vercel (UI).

## ⚙️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bullz-droid/ArchiTrack.git
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create .env with SUPABASE_URL and SUPABASE_ANON_KEY
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Create .env with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_API_URL
   npm run dev
   ```

## 🌍 Vision

ArchiTrack is built by architecture students, for architecture students. Our goal is to eliminate the friction of organizing a 5-year studio career into a portfolio, one project at a time.

## 👨‍💻 Author

Built by TURYATEMBA JOHN
