import { Box, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, #F5F6FA 0%, #FFFFFF 100%)',
        px: 2,
      }}
    >
      <Paper elevation={12} sx={{ width: '100%', maxWidth: 520, p: 4, borderRadius: 4 }}>
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
