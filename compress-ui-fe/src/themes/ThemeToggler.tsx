/** @format */

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { IconButton, PaletteMode } from '@mui/material'
import { blue, blueGrey, cyan, grey, indigo, lightBlue } from '@mui/material/colors'
import React, { useContext } from 'react'

export const enum ColorMode {
  Light = 'light',
  Dark = 'dark',
}

export const ColorModeContext = React.createContext({ theme: ColorMode.Light, toggleColorMode: () => {} })
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    ...(mode === 'light'
      ? {
          primary: indigo,
          divider: indigo[200],
          secondary: {
            main: blue[400],
          },
          background: {
            default: blueGrey[50],
            paper: blueGrey[100],
          },
          text: {
            primary: '#000',
            secondary: cyan[900],
          },
        }
      : {
          primary: grey,
          secondary: {
            main: lightBlue[900],
          },
          divider: blueGrey['500'],
          background: {
            default: '#0c1929',
            paper: '#0c1933',
          },
          text: {
            primary: '#eee',
            secondary: blueGrey[500],
          },
        }),
  },
})

function ThemeToggler() {
  const toggle = useContext(ColorModeContext)

  return (
    <IconButton sx={{ mr: 1 }} onClick={toggle.toggleColorMode} color="inherit">
      {toggle.theme === ColorMode.Dark ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  )
}

export default ThemeToggler
