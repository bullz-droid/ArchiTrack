import { useNavigate } from 'react-router-dom'
import { Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '@/context/AuthContext'
import type { RegisterPayload, UserRole } from '@/types'

const roles: { value: UserRole; label: string }[] = [
  { value: 'architect', label: 'Architect' },
  { value: 'client', label: 'Client' },
]

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const formik = useFormik<RegisterPayload>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'client',
      firm: '',
      location: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().min(6, 'Password should be at least 6 characters').required('Password is required'),
      role: Yup.string().required('Role is required'),
    }),
    onSubmit: async (values) => {
      try {
        await register(values)
        navigate('/dashboard')
      } catch {
        // handled by API interceptor or form validation
      }
    },
  })

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <Typography variant="h4">Create account</Typography>
        <Typography color="text.secondary">Choose your role and start managing client collaborations.</Typography>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full name" name="name" value={formik.values.name} onChange={formik.handleChange} error={Boolean(formik.touched.name && formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="email" value={formik.values.email} onChange={formik.handleChange} error={Boolean(formik.touched.email && formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Password" name="password" type="password" value={formik.values.password} onChange={formik.handleChange} error={Boolean(formik.touched.password && formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Role" name="role" value={formik.values.role} onChange={formik.handleChange} error={Boolean(formik.touched.role && formik.errors.role)} helperText={formik.touched.role && formik.errors.role}>
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Firm / Studio" name="firm" value={formik.values.firm} onChange={formik.handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Location" name="location" value={formik.values.location} onChange={formik.handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained" size="large">
              Create account
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Already a member? <Button onClick={() => navigate('/auth/login')} color="secondary">Sign in</Button>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default Register
