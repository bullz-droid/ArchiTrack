import { Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography, Button } from '@mui/material'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const image = project.images?.[0] ?? 'https://via.placeholder.com/420x280?text=Project+Preview'

  return (
    <Card elevation={1} sx={{ borderRadius: 3, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
      <CardMedia component="img" height="220" image={image} alt={project.title} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.location} · {project.year} · {project.category}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {project.tags?.slice(0, 3).map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
        <Typography variant="subtitle2" color="text.primary">
          ${project.budget.toLocaleString()} Budget
        </Typography>
        <Button size="small" variant="outlined">
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProjectCard
