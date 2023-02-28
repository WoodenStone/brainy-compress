/** @format */

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import * as React from 'react'

export interface IModel {
  name: string
  /* 
    the first item in the metric array is the default selected metric
  */
  metric: string[]
  /* 
    the first item in the quality array is the default selected quality
  */
  quality: number[]
  selectedMetric: string
  selectedQuality: number
  paperName?: string
  paperLink?: string
}

export interface IModelChecked {
  name: string
  metric: string
  quality: number
}

export interface ICheckboxListProps {
  title: string
  modelList: IModel[]
  onChange: (selected: IModelChecked[]) => void
}

export default function ModelList({ title, modelList, onChange }: ICheckboxListProps) {
  const [checked, setChecked] = React.useState([-1])
  const [allSelected, setAllSelected] = React.useState(false)

  const [models, setModels] = React.useState(modelList)

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
    const checkedModel = newChecked.filter(index => index !== -1).map(index => models[index])
    onChange(
      checkedModel.map(model => ({ name: model.name, metric: model.selectedMetric, quality: model.selectedQuality })),
    )
  }

  const selectAll = () => {
    setChecked(models.map((_, index) => index))
    setAllSelected(true)
    onChange(models.map(model => ({ name: model.name, metric: model.selectedMetric, quality: model.selectedQuality })))
  }

  const clearAll = () => {
    setChecked([])
    setAllSelected(false)
    onChange([])
  }

  // modal
  const [visible, setVisible] = React.useState(false)
  const handleModalOpen = () => {
    setVisible(true)
  }
  const handleModalClose = () => setVisible(false)

  const [currentModel, setCurrentModel] = React.useState<IModel>(models?.[0])

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper', paddingX: 0 }}>
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
          }>
          <ListItemText primary={title}></ListItemText>
        </ListItem>
        <Divider />
        {models.map((model, index) => {
          const labelId = `checkbox-list-label-${model}`

          return (
            <ListItem
              key={model.name}
              disablePadding
              secondaryAction={
                <>
                  <Tooltip
                    placement="left"
                    title={
                      <Link href={model.paperLink} underline="always" color="inherit" target="_blank">
                        {model.paperName}
                      </Link>
                    }>
                    <IconButton edge="end" aria-label="info">
                      <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip placement="right" title="advanced settings">
                    <IconButton
                      edge="end"
                      aria-label="setting"
                      onClick={() => {
                        setCurrentModel(model)
                        handleModalOpen()
                      }}>
                      <SettingsOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }>
              <ListItemButton onClick={handleToggle(index)} dense>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(index) !== -1}
                  tabIndex={-1}
                  inputProps={{ 'aria-labelledby': labelId }}
                />

                <ListItemText
                  id={labelId}
                  primary={`${model.name}`}
                  secondary={`metric: ${model.selectedMetric}, quality: ${model.selectedQuality}`}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      {/* unmount the modal each time when it closes */}
      {visible ? (
        <SettingModal
          visible={true}
          onClose={handleModalClose}
          model={currentModel}
          onConfirm={model => {
            // update the model
            const newModels = models.map(m => (m.name === model.name ? model : m))
            setModels(newModels)
            // check if the current model is selected
            const index = models.findIndex(m => m.name === model.name)
            if (checked.indexOf(index) !== -1) {
              // emit the selected items
              const checkedModel = checked
                .filter(index => index !== -1)
                .map(index => newModels[index])
                .map(model => ({ name: model.name, metric: model.selectedMetric, quality: model.selectedQuality }))
              onChange(checkedModel)
            }
          }}
        />
      ) : null}
    </>
  )
}

interface ISettingModalProps {
  model: IModel
  visible: boolean
  onClose: () => void
  onConfirm: (model: IModel) => void
}

function SettingModal({ model, visible, onClose, onConfirm }: ISettingModalProps) {
  const originalValue = Object.assign({}, model)
  const [formValue, setFormValue] = React.useState(model)
  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, selectedMetric: e.target.value })
  }

  const handleQualityChange = (e: Event | React.SyntheticEvent<Element, Event>, value: number | number[]) => {
    setFormValue({ ...formValue, selectedQuality: value as number })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(formValue)
    onClose()
  }

  const handleCancel = () => {
    setFormValue(originalValue)
    onClose()
  }

  return (
    <Modal open={visible} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50vw',
          bgcolor: 'background.paper',
          borderRadius: '0.5rem',
          boxShadow: 10,
          p: 4,
        }}>
        <Typography variant="h6" component="h2" pb={2}>
          Advanced Settings
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl onChange={handleMetricChange}>
            <FormLabel>Metric</FormLabel>
            <FormLabel component="legend">Optimized for the selected metric.</FormLabel>
            <RadioGroup row value={formValue.selectedMetric}>
              <FormControlLabel value="mse" control={<Radio />} label="MSE" />
              <FormControlLabel value="ms-ssim" control={<Radio />} label="MS-SSIM" />
            </RadioGroup>
            <FormLabel>Quality</FormLabel>
            <FormLabel component="legend">The higher the quality of the image, the higher the bit-rate.</FormLabel>
            <Slider
              value={formValue.selectedQuality}
              aria-label="quality-slider"
              step={1}
              marks={formValue.quality.map(q => {
                return {
                  value: q,
                  label: q.toString(),
                }
              })}
              valueLabelDisplay="auto"
              min={formValue.quality[0]}
              max={formValue.quality[formValue.quality.length - 1]}
              onChange={handleQualityChange}
            />
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <ButtonGroup variant="outlined">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button variant="contained" type="submit">
                Confirm
              </Button>
            </ButtonGroup>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
