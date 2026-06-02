import { useMemo, useState } from 'react'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/ui/ProjectCard'
import { EmptyState, LoadingSpinner } from '@/components/ui/FeedbackComponents'

const Portfolio = () => {
  const { projects, loading, error } = useProjects()
  const [category, setCategory] = useState('')

  const categories = useMemo(() => Array.from(new Set(projects.map((project) => project.category || 'Other'))), [projects])
  const filteredProjects = useMemo(
    () => (category ? projects.filter((project) => project.category === category) : projects),
    [category, projects],
  )

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="h4">Portfolio gallery</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Button variant={category === '' ? 'contained' : 'outlined'} onClick={() => setCategory('')}>
            All categories
          </Button>
          {categories.map((name) => (
            <Button key={name} variant={category === name ? 'contained' : 'outlined'} onClick={() => setCategory(name)}>
              {name}
            </Button>
          ))}
        </Stack>
      </Stack>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredProjects.length === 0 ? (
        <EmptyState title="No projects yet" description="Upload a project or remove the filter to see more work." />
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  )
}

export default Portfolio
