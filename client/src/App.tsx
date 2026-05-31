import { Routes, Route, Navigate } from 'react-router-dom'
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
import Login from './pages/Login'
import Register from './pages/Register'
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
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="architects/:id" element={<ProtectedRoute><ArchitectProfile /></ProtectedRoute>} />
        <Route path="portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="cloud-storage" element={<ProtectedRoute><CloudStorage /></ProtectedRoute>} />
        <Route path="matching" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
        <Route path="project-upload" element={<ProtectedRoute><ProjectUpload /></ProtectedRoute>} />
        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  )
}

export default App
