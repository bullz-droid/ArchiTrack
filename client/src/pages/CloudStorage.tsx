import { useMemo, useState } from 'react'
import { Button, Card, CardContent, Grid, LinearProgress, Stack, Typography } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload'

const _icon = (m: any) => (m && m.default) ? m.default : m
const FileUploadComp = _icon(FileUploadIcon)
import { useStorage } from '@/hooks/useStorage'
import FileUploader from '@/components/ui/FileUploader'
import { EmptyState, LoadingSpinner, ConfirmDialog } from '@/components/ui/FeedbackComponents'
import { humanFileSize } from '@/utils/format'

const CloudStorage = () => {
  const { files, stats, loading, error, refreshStorage, uploadFiles, removeFile } = useStorage()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const usedPercent = useMemo(() => Math.round((stats.used / stats.total) * 100), [stats])

  const handleUpload = async () => {
    const formData = new FormData()
    selectedFiles.forEach((file) => formData.append('files', file))
    await uploadFiles(formData)
    setSelectedFiles([])
    refreshStorage()
  }

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div>
        <Typography variant="h4">Cloud storage</Typography>
        <Typography color="text.secondary">Manage your architectural assets in one secure workspace.</Typography>
      </div>

      <Card sx={{ borderRadius: 3, p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1">Storage usage</Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography>{humanFileSize(stats.used)} used of {humanFileSize(stats.total)}</Typography>
            <Typography>{usedPercent}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={usedPercent} sx={{ height: 10, borderRadius: 5 }} />
        </Stack>
      </Card>

      <Card sx={{ borderRadius: 3, p: 3 }}>
        <FileUploader files={selectedFiles} onFilesAdded={(files) => setSelectedFiles(files)} />
        <Button startIcon={FileUploadComp ? <FileUploadComp /> : undefined} variant="contained" disabled={selectedFiles.length === 0} onClick={handleUpload}>
          Upload selected files
        </Button>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : files.length === 0 ? (
        <EmptyState title="No files uploaded" description="Drag files into the zone above to store them and share with your team." />
      ) : (
        <Grid container spacing={3}>
          {files.map((file) => (
            <Grid key={file.id} item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, p: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1">{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {file.type.toUpperCase()} · {humanFileSize(file.size)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                    <Button size="small" variant="outlined" href={file.url} target="_blank">
                      Download
                    </Button>
                    <Button size="small" color="error" onClick={() => setConfirmDelete(file.id)}>
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete file"
        message="Are you sure you want to remove this file from storage? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (confirmDelete) {
            await removeFile(confirmDelete)
            setConfirmDelete(null)
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default CloudStorage
