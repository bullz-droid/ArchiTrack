import { Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography, Button, Avatar } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import StarsIcon from '@mui/icons-material/Stars'

const _icon = (m: any) => (m && m.default) ? m.default : m
const StarsComp = _icon(StarsIcon)
import type { User } from '@/types'

interface ArchitectCardProps {
  architect: User
}

const ArchitectCard = ({ architect }: ArchitectCardProps) => {
  return (
    <Card elevation={1} sx={{ borderRadius: 3, minHeight: 320, display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={<Avatar src={architect.avatarUrl} alt={architect.name}>{architect.name?.charAt(0)}</Avatar>}
        title={architect.name}
        subheader={architect.firm || architect.location || 'Architecture Studio'}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          {StarsComp ? <StarsComp color="secondary" fontSize="small" /> : null}
          <Typography variant="body2" color="text.secondary">
            {architect.rating?.toFixed(1) ?? '4.8'} · {architect.reviewCount ?? 28} reviews
          </Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {(architect.specialties || ['Residential', 'Commercial', 'Interiors']).slice(0, 3).map((item) => (
            <Chip key={item} label={item} color="secondary" size="small" />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {architect.bio || 'Detail-oriented architect delivering high-performance design, portfolio storytelling, and client-first communication.'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 3 }}>
        <Button component={RouterLink} to={`/architects/${architect.id}`} size="small" variant="contained">
          View Profile
        </Button>
      </CardActions>
    </Card>
  )
}

export default ArchitectCard
