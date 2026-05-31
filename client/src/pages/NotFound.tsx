import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => (
  <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}>
    <Typography variant="h2" gutterBottom>
      404
    </Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Page not found. The architecture workspace you requested is unavailable.
    </Typography>
    <Button component={RouterLink} to="/" variant="contained" color="primary">
      Go to Home
    </Button>
  </Box>
)

export default NotFound
