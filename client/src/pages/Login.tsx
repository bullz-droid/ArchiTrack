import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, TextField, Typography, Stack, Divider } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '@/context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values)
        navigate('/dashboard')
      } catch {
        // handled by api interceptor or form validation
      }
    },
  })

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary">Continue to your architect-client workspace.</Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} error={Boolean(formik.touched.email && formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Password" name="password" type="password" value={formik.values.password} onChange={formik.handleChange} error={Boolean(formik.touched.password && formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained" size="large">
              Sign in
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button variant="outlined">Continue with Google</Button>
              <Button variant="outlined">Continue with LinkedIn</Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              New to ArchiConnect? <Button onClick={() => navigate('/auth/register')} color="secondary">Create account</Button>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default Login
