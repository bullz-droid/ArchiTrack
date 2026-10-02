import { Box, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import AntiGravityScene from '@/components/auth/AntiGravityScene'

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, #F5F6FA 0%, #FFFFFF 100%)',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AntiGravityScene />
      <Paper elevation={12} sx={{ width: '100%', maxWidth: 520, p: 4, borderRadius: 4, position: 'relative', zIndex: 10, backdropFilter: 'blur(8px)', bgcolor: 'rgba(255,255,255,0.92)' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to ArchiConnect
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Connect with architects and manage portfolios, storage, and real-time matches in one elegant workspace.
        </Typography>
        <Outlet />
      </Paper>
    </Box>
  )
}

export default AuthLayout
