/** @format */

import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
} from '@mui/material'
import React from 'react'

export interface IAutoModelSelected {
  metric: string
  quality: 'high' | 'medium' | 'low' | 'auto'
}

export interface IAutoModelProps {
  title: string
  selected: IAutoModelSelected
  onChange: (s: IAutoModelSelected) => void
}

export function AutoModelList({ selected, title, onChange }: IAutoModelProps) {
  const [formValue, setFormValue] = React.useState(selected)

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = {
      ...formValue,
      metric: e.target.value,
    }
    setFormValue(newVal)
    onChange(newVal)
  }

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = {
      ...formValue,
      quality: e.target.value as 'high' | 'medium' | 'low' | 'auto',
    }
    setFormValue(newVal)
    onChange(newVal)
  }

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper', paddingX: 0 }}>
        <ListItem>
          <ListItemText
            primary={title}
            secondary=" Automatically select the best model based on the features of the image."
          />
        </ListItem>
        <Divider />
        <Box
          sx={{
            p: 2,
          }}>
          <form>
            <FormGroup>
              <FormControl onChange={handleMetricChange}>
                <FormLabel
                  sx={{
                    fontWeight: 'bold',
                  }}>
                  Metric
                </FormLabel>
                <FormLabel component="legend">Optimized for the selected metric.</FormLabel>
                <RadioGroup row value={formValue.metric}>
                  <FormControlLabel value="ms-ssim" control={<Radio />} label="MS-SSIM" />
                  <FormControlLabel value="mse" control={<Radio />} label="MSE" />
                </RadioGroup>
              </FormControl>
              <FormControl onChange={handleQualityChange}>
                <FormLabel
                  sx={{
                    fontWeight: 'bold',
                  }}>
                  Quality
                </FormLabel>
                <FormLabel component="legend">Setting quality will override the default behavior.</FormLabel>
                <RadioGroup row value={formValue.quality}>
                  <FormControlLabel value="auto" control={<Radio />} label="AUTO" />
                  <FormControlLabel value="high" control={<Radio />} label="HIGH" />
                  <FormControlLabel value="medium" control={<Radio />} label="MEDIUM" />
                  <FormControlLabel value="low" control={<Radio />} label="LOW" />
                </RadioGroup>
              </FormControl>
            </FormGroup>
          </form>
        </Box>
      </List>
    </>
  )
}
