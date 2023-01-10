/** @format */

import { Box, Grid } from '@mui/material'

import styles from './index.module.scss'

const shapeAnimation: any = {
  One: styles.shapeOne,
  Two: styles.shapeTwo,
  Three: styles.shapeThree,
  Four: styles.shapeFour,
}

export function Loading() {
  return (
    <Box
      sx={{
        display: 'block',
      }}
    >
      <Grid container spacing={5} justifyContent="center" className="loading">
        {['One', 'Two', 'Three', 'Four'].map((key, index) => (
          <Grid
            item
            key={index}
            className={shapeAnimation[key]}
            sx={{
              margin: '0 0.7rem',
            }}
          ></Grid>
        ))}
      </Grid>
    </Box>
  )
}
