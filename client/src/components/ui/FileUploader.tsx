import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import { UploadCloud } from 'lucide-react'

interface FileUploaderProps {
  files: File[]
  onFilesAdded: (files: File[]) => void
}

const FileUploader = ({ files, onFilesAdded }: FileUploaderProps) => {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const allowed = acceptedFiles.filter((file) => file.size <= 100 * 1024 * 1024)
      if (allowed.length !== acceptedFiles.length) {
        setError('Each file must be 100MB or smaller.')
      } else {
        setError(null)
      }
      onFilesAdded(allowed)
    },
    [onFilesAdded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
      'application/octet-stream': ['.dwg', '.skp', '.rvt'],
    },
    maxSize: 100 * 1024 * 1024,
  })

  return (
    <Box>
      <Paper {...getRootProps()} elevation={0} sx={{ p: 4, border: '2px dashed', borderColor: isDragActive ? 'primary.main' : 'divider', textAlign: 'center', cursor: 'pointer', mb: 3 }}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <UploadCloud size={48} className="text-primary-main" />
        </Box>
        <Typography variant="h6" gutterBottom>
          Drag & drop architectural files here
        </Typography>
        <Typography color="text.secondary">Accepts images, PDF, DWG, SKP, RVT files (100MB max)</Typography>
        <Button variant="contained" sx={{ mt: 3 }}>
          Select Files
        </Button>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <List disablePadding>
        {files.map((file) => (
          <ListItem key={file.name} divider>
            <ListItemText primary={file.name} secondary={`${Math.round(file.size / 1024)} KB`} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default FileUploader
