import { Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => (
  <div style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center', paddingInline: 16 }}>
    <Typography variant="h2" gutterBottom>
      404
    </Typography>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Page not found. The architecture workspace you requested is unavailable.
    </Typography>
    <Button component={RouterLink} to="/" variant="contained" color="primary">
      Go to Home
    </Button>
  </div>
)

export default NotFound
