/** @format */

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import * as React from 'react'

export interface ICheckboxListProps {
  title: string
  models: string[]
  onChange: (selected: string[]) => void
}

export default function CheckboxList({ title, models, onChange }: ICheckboxListProps) {
  const [checked, setChecked] = React.useState([-1])
  const [allSelected, setAllSelected] = React.useState(false)

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)

    // emit the selected items
    onChange(newChecked.filter(index => index !== -1).map(index => models[index]))
  }

  const selectAll = () => {
    setChecked(models.map((_, index) => index))
    setAllSelected(true)
    onChange(models)
  }

  const clearAll = () => {
    setChecked([])
    setAllSelected(false)
    onChange([])
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem
        secondaryAction={
          allSelected ? (
            <IconButton edge="end" aria-label="reset" color="primary" size="small" onClick={clearAll}>
              <DeleteSweepIcon />
            </IconButton>
          ) : (
            <IconButton edge="end" aria-label="select all" color="primary" size="small" onClick={selectAll}>
              <DoneAllIcon />
            </IconButton>
          )
        }
      >
        <Typography variant="overline" fontSize="1rem">
          {title}
        </Typography>
      </ListItem>
      <Divider />
      {models.map((value, index) => {
        const labelId = `checkbox-list-label-${value}`

        return (
          <ListItem key={value} disablePadding>
            <ListItemButton onClick={handleToggle(index)} dense>
              <Checkbox
                edge="start"
                checked={checked.indexOf(index) !== -1}
                tabIndex={-1}
                inputProps={{ 'aria-labelledby': labelId }}
              />

              <ListItemText id={labelId} primary={`${value}`} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}
