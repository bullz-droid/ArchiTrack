import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import { architectsApi } from '@/services/api'
import { EmptyState, LoadingSpinner } from '@/components/ui/FeedbackComponents'
import RatingStars from '@/components/ui/RatingStars'
import ProjectCard from '@/components/ui/ProjectCard'
import type { Project, User } from '@/types'

const ArchitectProfile = () => {
  const { id } = useParams()
  const [architect, setArchitect] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return
      setLoading(true)
      try {
        const profileResponse = await architectsApi.getProfile(id)
        setArchitect(profileResponse.data)
        const portfolioResponse = await architectsApi.getPortfolio(id)
        setPortfolio(portfolioResponse.data)
        setError(null)
      } catch (err) {
        setError('Unable to load architect profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <Typography color="error">{error}</Typography>
  if (!architect) return <EmptyState title="Architect not found" description="Check the profile link or try another architect." />

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Card sx={{ borderRadius: 3, p: 3 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="h3">{architect.name}</Typography>
              <Typography color="text.secondary">{architect.firm || 'Independent Architecture Studio'}</Typography>
              <Typography>{architect.location || 'Remote'}</Typography>
              <RatingStars value={architect.rating ?? 4.8} />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(architect.specialties || ['Residential', 'Urban Design']).map((tag) => (
                  <Chip key={tag} label={tag} color="secondary" size="small" />
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">About</Typography>
              <Typography color="text.secondary">
                {architect.bio || 'Architect with expertise in sustainable studio workflows, cloud portfolio management and real-time client collaboration.'}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained">Connect</Button>
                <Button variant="outlined">Message</Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            <Typography color="text.secondary">{architect.experience || '10+ years delivering award-winning architectural projects.'}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Education
            </Typography>
            {(architect.education || ['M.Arch, Design School']).map((item) => (
              <Typography key={item} variant="body2" color="text.secondary">
                • {item}
              </Typography>
            ))}
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Certifications
            </Typography>
            {(architect.certifications || ['LEED AP', 'RIBA']).map((item) => (
              <Typography key={item} variant="body2" color="text.secondary">
                • {item}
              </Typography>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio
            </Typography>
            {portfolio.length === 0 ? (
              <EmptyState title="Portfolio in progress" description="This architect has not published portfolio items yet." />
            ) : (
              <Grid container spacing={2}>
                {portfolio.slice(0, 4).map((project) => (
                  <Grid item xs={12} sm={6} key={project.id}>
                    <ProjectCard project={project} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ArchitectProfile
