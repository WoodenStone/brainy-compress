/** @format */

import Grid from '@mui/material/Grid'

import Header from '../../components/header'
import Main from './Main'

function Home() {
  return (
    <div className="Home">
      <Header></Header>
      <Grid sx={{ marginTop: '10vh', display: 'flex', justifyContent: 'center' }}>
        <Main></Main>
      </Grid>
    </div>
  )
}

export default Home
