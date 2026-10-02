import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import MainLayout from './components/MainLayout'
import AuthLayout from './components/AuthLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ArchitectProfile from './pages/ArchitectProfile'
import Portfolio from './pages/Portfolio'
import CloudStorage from './pages/CloudStorage'
import Matching from './pages/Matching'
import ProjectUpload from './pages/ProjectUpload'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Deadlines from './pages/Deadlines'
import Library from './pages/Library'
import Notes from './pages/Notes'
import Profile from './pages/Profile'
import PublicPortfolio from './pages/PublicPortfolio'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'
import NotFound from './pages/NotFound'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="page-loading">Loading platform...</div>
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="callback" element={<AuthCallback />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="deadlines" element={<ProtectedRoute><Deadlines /></ProtectedRoute>} />
          <Route path="library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="architects/:id" element={<ProtectedRoute><ArchitectProfile /></ProtectedRoute>} />
          <Route path="portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="portfolio/:username" element={<PublicPortfolio />} />
          <Route path="cloud-storage" element={<ProtectedRoute><CloudStorage /></ProtectedRoute>} />
          <Route path="matching" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
          <Route path="project-upload" element={<ProtectedRoute><ProjectUpload /></ProtectedRoute>} />
          <Route path="not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
