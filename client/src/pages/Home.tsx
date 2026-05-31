import { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ArchitectCard from '@/components/ui/ArchitectCard'
import SearchBar from '@/components/ui/SearchBar'
import { EmptyState, LoadingSpinner } from '@/components/ui/FeedbackComponents'
import { useArchitects } from '@/hooks/useArchitects'

const Home = () => {
  const navigate = useNavigate()
  const { architects, loading, error } = useArchitects()
  const [search, setSearch] = useState('')

  const featuredArchitects = useMemo(() => {
    const results = architects.filter((architect) =>
      `${architect.name} ${architect.firm} ${architect.location}`.toLowerCase().includes(search.toLowerCase()),
    )
    return results.slice(0, 6)
  }, [architects, search])

  const statistics = [
    { label: 'Architects onboarded', value: '1,200+' },
    { label: 'Project uploads', value: '4,500+' },
    { label: 'Real-time matches', value: '980+' },
  ]

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'grid', gap: 4, pt: 2 }}>
        <Stack spacing={2} maxWidth={720}>
          <Typography variant="h2">Architecture collaboration made effortless.</Typography>
          <Typography variant="body1" color="text.secondary">
            Discover architects, manage portfolios, upload files securely, and receive matches in real time.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" size="large" onClick={() => navigate('/matching')}>
              Find an architect
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/cloud-storage')}>
              Open cloud storage
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          {statistics.map((item) => (
            <Grid item xs={12} sm={4} key={item.label}>
              <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h5">{item.value}</Typography>
                  <Typography color="text.secondary">{item.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search architects, locations, or specialities" />
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : featuredArchitects.length === 0 ? (
        <EmptyState title="No architects found" description="Try a broader search or adjust your filters." />
      ) : (
        <Grid container spacing={3}>
          {featuredArchitects.map((architect) => (
            <Grid item xs={12} md={6} lg={4} key={architect.id}>
              <ArchitectCard architect={architect} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default Home
