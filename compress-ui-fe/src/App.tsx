/** @format */
import './App.scss'

import { PaletteMode } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import React from 'react'

import Home from './pages/Home'
import { ColorMode, ColorModeContext, getDesignTokens } from './themes/ThemeToggler'

function App() {
  const [mode, setMode] = React.useState<PaletteMode>(ColorMode.Light)
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === ColorMode.Light ? ColorMode.Dark : ColorMode.Light))
      },
      theme: theme.palette.mode as ColorMode,
    }),
    [],
  )

  return (
    <SnackbarProvider maxSnack={3}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <CssBaseline />
            <Home></Home>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SnackbarProvider>
  )
}

export default App
