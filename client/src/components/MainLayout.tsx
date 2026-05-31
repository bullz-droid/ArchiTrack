import { useState } from 'react'
import { Outlet, Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { default as MenuIcon } from '@mui/icons-material/Menu'
import { default as DashboardIcon } from '@mui/icons-material/Dashboard'
import { default as PersonSearchIcon } from '@mui/icons-material/PersonSearch'
import { default as CloudUploadIcon } from '@mui/icons-material/CloudUpload'
import { default as FolderSharedIcon } from '@mui/icons-material/FolderShared'
import { default as WalletIcon } from '@mui/icons-material/Wallet'
import { default as AddCircleIcon } from '@mui/icons-material/AddCircle'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

// (debug logs removed)

const drawerWidth = 280

// Some optimized deps export a module object with the real component on `.default`.
const unwrapIcon = (mod: any) => (mod && (mod.default || mod.$$typeof)) ? mod.default ?? mod : mod

const navItems = [
  { label: 'Dashboard', component: unwrapIcon(DashboardIcon), path: '/dashboard' },
  { label: 'Architects', component: unwrapIcon(PersonSearchIcon), path: '/' },
  { label: 'Matching', component: unwrapIcon(FolderSharedIcon), path: '/matching' },
  { label: 'Cloud Storage', component: unwrapIcon(CloudUploadIcon), path: '/cloud-storage' },
  { label: 'Upload Project', component: unwrapIcon(AddCircleIcon), path: '/project-upload' },
]

const MainLayout = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { matchNotifications, connectionRequests } = useSocket()

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

  const drawer = (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        ArchiConnect
      </Typography>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        Build architect-client relationships, manage files, and launch designs.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        {navItems.map((item) => {
          const IconComp = item.component
          return (
            <ListItemButton component={RouterLink} to={item.path} key={item.label} sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon>{IconComp ? <IconComp /> : null}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  const WalletComp = unwrapIcon(WalletIcon)
  const FolderComp = unwrapIcon(FolderSharedIcon)
  const MenuComp = unwrapIcon(MenuIcon)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={1} sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMdUp && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                {MenuComp ? <MenuComp /> : null}
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              ArchiConnect
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={matchNotifications.length} color="secondary">
              {WalletComp ? <WalletComp /> : null}
            </Badge>
            <Badge badgeContent={connectionRequests.length} color="secondary">
              {FolderComp ? <FolderComp /> : null}
            </Badge>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar alt={user?.name} src={user?.avatarUrl} sx={{ width: 36, height: 36 }}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body2">{user?.name || 'Guest'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role === 'architect' ? 'Architect' : 'Client'}
                </Typography>
              </Box>
            </Box>
            <Box component="button" onClick={logout} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <Typography variant="button" color="secondary">
                Sign Out
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {isMdUp ? (
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderRight: '1px solid rgba(145, 158, 171, 0.24)',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: 10 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
