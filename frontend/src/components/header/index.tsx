/** @format */

import { AppBar, Box, Toolbar } from '@mui/material'

import image from '../../brainy.png'
import ThemeToggler from '../../themes/ThemeToggler'

function Header() {
  return (
    <AppBar
      component="nav"
      sx={{
        boxShadow: 'none',
      }}>
      <Toolbar sx={{ height: '80px', display: 'flex' }}>
        <Box
          sx={{
            flexGrow: 1,
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
          }}>
          <img src={image} width="300px" height="75px" alt="compression"></img>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ThemeToggler />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
