import { useState, type ReactElement } from 'react'
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
import {
  Menu as MenuIcon,
  LayoutDashboard as DashboardIcon,
  Users as PersonSearchIcon,
  Folder as ProjectsIcon,
  FolderKanban as FolderSharedIcon,
  UploadCloud as CloudUploadIcon,
  Library as LibraryIcon,
  PenTool as NotesIcon,
  Calendar as DeadlinesIcon,
  Globe as PortfolioIcon,
  PlusCircle as AddCircleIcon,
  Wallet as WalletIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const drawerWidth = 280

const navItems = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { label: 'Architects', icon: PersonSearchIcon, path: '/' },
  { label: 'Projects', icon: ProjectsIcon, path: '/projects' },
  { label: 'Architect Matching', icon: FolderSharedIcon, path: '/matching' },
  { label: 'Cloud Storage', icon: CloudUploadIcon, path: '/cloud-storage' },
  { label: 'Archi Library', icon: LibraryIcon, path: '/library' },
  { label: 'Design Log', icon: NotesIcon, path: '/notes' },
  { label: 'Deadlines', icon: DeadlinesIcon, path: '/deadlines' },
  { label: 'Portfolio Gallery', icon: PortfolioIcon, path: '/portfolio' },
  { label: 'Upload Project', icon: AddCircleIcon, path: '/project-upload' },
]

function DrawerContent() {
  return (
    <Box style={{ padding: '24px 16px' }}>
      <Typography variant="h6" color="primary" gutterBottom>
        ArchiConnect
      </Typography>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        Build architect-client relationships, manage files, and launch designs.
      </Typography>
      <Divider style={{ margin: '16px 0' }} />
      <List>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.label}
              component={RouterLink as any}
              to={item.path}
              style={{ borderRadius: 8, marginBottom: 4 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}

const MainLayout = (): ReactElement => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { matchNotifications, connectionRequests } = useSocket()

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

  const drawer = <DrawerContent />

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={1} sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMdUp && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon size={22} />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              ArchiConnect
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={matchNotifications.length} color="secondary">
              <WalletIcon size={20} />
            </Badge>
            <Badge badgeContent={connectionRequests.length} color="secondary">
              <FolderSharedIcon size={20} />
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
