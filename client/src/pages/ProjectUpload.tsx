import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Stack, MenuItem } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { projectsApi } from '@/services/api'
import FileUploader from '@/components/ui/FileUploader'
import { LoadingSpinner } from '@/components/ui/FeedbackComponents'

const categories = ['Residential', 'Commercial', 'Interior', 'Landscape', 'Urban']

const ProjectUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      location: '',
      year: '',
      budget: '',
      area: '',
      tags: '',
      challenges: '',
      collaboration: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      category: Yup.string().required('Category is required'),
      location: Yup.string().required('Location is required'),
      year: Yup.string().required('Completion year is required'),
      budget: Yup.number().required('Budget is required').min(0),
      area: Yup.number().required('Area is required').min(0),
    }),
    onSubmit: async (values) => {
      setSubmitting(true)
      try {
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('description', values.description)
        formData.append('category', values.category)
        formData.append('location', values.location)
        formData.append('year', values.year)
        formData.append('budget', values.budget.toString())
        formData.append('area', values.area.toString())
        formData.append('tags', values.tags)
        formData.append('challenges', values.challenges)
        formData.append('collaboration', values.collaboration)
        files.forEach((file) => formData.append('media', file))

        await projectsApi.upload(formData)
        setSuccess(true)
        navigate('/portfolio')
      } catch (err) {
        console.error(err)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Typography variant="h4">Upload new project</Typography>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Submit your latest architectural work with rich media, budget details, and design story.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Project title" name="title" value={formik.values.title} onChange={formik.handleChange} error={Boolean(formik.touched.title && formik.errors.title)} helperText={formik.touched.title && formik.errors.title} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth select label="Category" name="category" value={formik.values.category} onChange={formik.handleChange} error={Boolean(formik.touched.category && formik.errors.category)} helperText={formik.touched.category && formik.errors.category}>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Location" name="location" value={formik.values.location} onChange={formik.handleChange} error={Boolean(formik.touched.location && formik.errors.location)} helperText={formik.touched.location && formik.errors.location} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Completion year" name="year" type="date" value={formik.values.year} onChange={formik.handleChange} InputLabelProps={{ shrink: true }} error={Boolean(formik.touched.year && formik.errors.year)} helperText={formik.touched.year && formik.errors.year} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Budget (USD)" name="budget" type="number" value={formik.values.budget} onChange={formik.handleChange} error={Boolean(formik.touched.budget && formik.errors.budget)} helperText={formik.touched.budget && formik.errors.budget} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Total area (sq ft)" name="area" type="number" value={formik.values.area} onChange={formik.handleChange} error={Boolean(formik.touched.area && formik.errors.area)} helperText={formik.touched.area && formik.errors.area} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Short description" name="description" multiline minRows={3} value={formik.values.description} onChange={formik.handleChange} error={Boolean(formik.touched.description && formik.errors.description)} helperText={formik.touched.description && formik.errors.description} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Design challenges" name="challenges" multiline minRows={3} value={formik.values.challenges} onChange={formik.handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Collaboration notes" name="collaboration" multiline minRows={2} value={formik.values.collaboration} onChange={formik.handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Tags (comma separated)" name="tags" value={formik.values.tags} onChange={formik.handleChange} />
              </Grid>
            </Grid>
            <FileUploader files={files} onFilesAdded={(incoming) => setFiles((prev) => [...prev, ...incoming])} />
            <Button variant="contained" size="large" disabled={submitting} onClick={() => formik.handleSubmit()}>
              {submitting ? <LoadingSpinner /> : 'Submit project'}
            </Button>
            {success && <Typography color="success.main">Project uploaded successfully.</Typography>}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProjectUpload
