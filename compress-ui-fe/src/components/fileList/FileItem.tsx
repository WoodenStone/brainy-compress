/** @format */

import DeleteIcon from '@mui/icons-material/Delete'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { Box, IconButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import { useState } from 'react'
import ImageViewer from 'react-simple-image-viewer'

export interface IFileListItemProps {
  name: string
  onDelete: () => void
  preview: string
  file: Blob
}

const FileItem = ({ name, onDelete, preview }: IFileListItemProps) => {
  const [open, setOpen] = useState(false)
  const [isRestoring] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const [fileProps] = useState({
    fileName: name,
    src: preview,
  })

  return (
    <Box>
      <ListItem
        sx={{
          marginBottom: 3,
        }}
        disablePadding
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="remove the image"
            onClick={onDelete}
            disabled={isRestoring}
            color="primary">
            <DeleteIcon />
          </IconButton>
        }>
        <ListItemIcon>
          <Tooltip title="preview">
            <IconButton edge="end" aria-label="preview the image" onClick={handleClickOpen} disabled={isRestoring}>
              <ImageOutlinedIcon />
            </IconButton>
          </Tooltip>
        </ListItemIcon>
        <ListItemText
          primary={fileProps.fileName}
          sx={{
            flexWrap: 'wrap',
          }}
        />
      </ListItem>
      {open && (
        <ImageViewer
          backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          src={[preview]}
          currentIndex={0}
          disableScroll={true}
          onClose={handleClose}
          closeOnClickOutside={true}
        />
      )}
    </Box>
  )
}

export default FileItem
