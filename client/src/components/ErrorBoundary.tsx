import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React tree:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: 24, backgroundColor: '#F8FAFC', color: '#0F172A', textAlign: 'center' }}>
          <div style={{ maxWidth: 480, background: '#FFFFFF', padding: 32, borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: '#2C3E50' }}>ArchiTrack Workspace</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: 24 }}>Something unexpected occurred while loading this view.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              style={{ padding: '10px 24px', backgroundColor: '#2C3E50', color: '#FFFFFF', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Reload Studio
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
