# 🏗️ ArchiTrack | Studio Management Platform

ArchiTrack is a professional SaaS platform designed for architects and design students to manage projects, portfolios, and deadlines in a centralized workspace.

## 🚀 Deployment Checklist (Get to 100%)

If you see "Failed to fetch" or 404 errors in production, follow these exact steps:

### 1. Vercel Dashboard Settings
- **Root Directory**: Leave this **EMPTY**.
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`

### 2. Required Environment Variables
Add these to your **Vercel Project Settings > Environment Variables**:
- `VITE_SUPABASE_URL`: Your Supabase Project URL (starts with `https://`)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
- `VITE_API_URL`: Your Railway Backend URL (e.g., `https://architrack-production.up.railway.app/api`)

### 3. Railway Backend Settings
- Ensure your Railway project has a "Root Directory" of `server`.
- Add your Vercel URL to the `FRONTEND_URL" environment variable on Railway.

## ✨ Features
- **Modern SaaS UI**: Dark/Light mode support with a premium aesthetic.
- **Project Management**: Track design iterations and deadlines.
- **Public Portfolios**: Generate a live architectural showcase with one click.
- **Secure Auth**: Powered by Supabase.

---
Built with ArchiTrack Studio Manager.

## ⚙️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/WEFAFA256/architrack.git
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
