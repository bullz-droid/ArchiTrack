import { Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, #F5F6FA 0%, #FFFFFF 100%)',
        paddingInline: 16,
      }}
    >
      <Paper elevation={12} style={{ width: '100%', maxWidth: 520, padding: 32, borderRadius: 24 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to ArchiConnect
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Connect with architects and manage portfolios, storage, and real-time matches in one elegant workspace.
        </Typography>
        <Outlet />
      </Paper>
    </div>
  )
}

export default AuthLayout
