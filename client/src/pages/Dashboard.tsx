import { Card, CardContent, Grid, Stack, Typography, Chip, Avatar } from '@mui/material'
import { useConnections } from '@/hooks/useConnections'
import { useProjects } from '@/hooks/useProjects'
import { EmptyState, LoadingSpinner } from '@/components/ui/FeedbackComponents'

const Dashboard = () => {
  const { connections, loading: connectionsLoading, error: connectionsError } = useConnections()
  const { projects, loading: projectsLoading, error: projectsError } = useProjects()

  const recentProjects = projects.slice(0, 3)

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <Typography variant="h4">Client dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active connections
              </Typography>
              {connectionsLoading ? (
                <LoadingSpinner />
              ) : connectionsError ? (
                <Typography color="error">{connectionsError}</Typography>
              ) : connections.length === 0 ? (
                <EmptyState title="No active connections" description="Start matching with architects to build your team." />
              ) : (
                <Stack spacing={2}>
                  {connections.map((connection) => (
                    <Card key={connection.id} variant="outlined" sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                          <Stack>
                            <Typography variant="subtitle1">{connection.architectName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {connection.status === 'connected' ? 'Connected' : 'Pending approval'}
                            </Typography>
                          </Stack>
                          <Chip label={connection.status} color={connection.status === 'connected' ? 'secondary' : 'default'} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {connection.lastMessage || 'Project briefing available.'}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent project views
              </Typography>
              {projectsLoading ? (
                <LoadingSpinner />
              ) : projectsError ? (
                <Typography color="error">{projectsError}</Typography>
              ) : recentProjects.length === 0 ? (
                <EmptyState title="No recent projects" description="Upload a new project or browse architect portfolios." />
              ) : (
                <Stack spacing={2}>
                  {recentProjects.map((project) => (
                    <div key={project.id} style={{ padding: 16, border: '1px solid', borderColor: 'rgba(145, 158, 171, 0.24)', borderRadius: 24 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="subtitle1">{project.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.location} · {project.year}
                          </Typography>
                        </Stack>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{project.title.charAt(0)}</Avatar>
                      </Stack>
                    </div>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard
