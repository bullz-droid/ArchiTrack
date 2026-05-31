import { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Stack, Typography, Chip, LinearProgress } from '@mui/material'
import { useMatching } from '@/hooks/useMatching'
import FilterPanel from '@/components/ui/FilterPanel'
import { EmptyState, LoadingSpinner } from '@/components/ui/FeedbackComponents'
import type { ArchitectFilters } from '@/types'

const defaultFilters: ArchitectFilters = {
  styles: [],
  budgetRange: [0, 100000],
  experience: '',
  location: '',
  projectType: '',
}

const Matching = () => {
  const [filters, setFilters] = useState<ArchitectFilters>(defaultFilters)
  const { matches, loading, error, findMatches } = useMatching()

  const compatibility = useMemo(
    () => ({ score: matches[0]?.compatibility ?? 72, label: matches[0] ? 'Updated' : 'Ready' }),
    [matches],
  )

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Typography variant="h4">Architect matching</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
          <Card sx={{ borderRadius: 3, mt: 3, p: 3, bgcolor: 'background.paper' }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Match readiness</Typography>
              <LinearProgress variant="determinate" value={compatibility.score} sx={{ height: 10, borderRadius: 5 }} />
              <Typography>{compatibility.label} by your preference selections.</Typography>
              <Button variant="contained" size="large" onClick={() => findMatches(filters)}>
                Refresh matches
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : matches.length === 0 ? (
            <EmptyState title="No matches yet" description="Build your preferences and start matching with architects." />
          ) : (
            <Stack spacing={3}>
              {matches.map((result) => (
                <Card key={result.architect.id} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
                      <Box>
                        <Typography variant="h6">{result.architect.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {result.architect.location}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                          {result.architect.specialties?.slice(0, 3).map((tag) => (
                            <Chip key={tag} label={tag} size="small" />
                          ))}
                        </Stack>
                      </Box>
                      <Stack alignItems="flex-end" spacing={1}>
                        <Typography variant="subtitle2" color="secondary">
                          {result.compatibility}%
                        </Typography>
                        <Button variant="contained">Connect</Button>
                      </Stack>
                    </Stack>
                    <Typography sx={{ mt: 2 }} color="text.secondary">
                      Match score: {result.score}. Recommended fee range: {result.feeRange}.
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Matching
