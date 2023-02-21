/** @format */

import { AppBar, Box, Toolbar, Typography } from '@mui/material'

import ThemeToggler from '../../themes/ThemeToggler'

function Header() {
  return (
    <AppBar
      component="nav"
      sx={{
        boxShadow: 'none',
      }}>
      <Toolbar sx={{ height: '10vh' }}>
        <Typography variant="h1" sx={{ flexGrow: 1, display: 'block', fontSize: '2rem' }}>
          Compress AI - Demo
          {/* <Typography variant="caption" component="div">
            Online Movie Restoration Platform
          </Typography> */}
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ThemeToggler />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
