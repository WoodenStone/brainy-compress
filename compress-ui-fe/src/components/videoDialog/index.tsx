/** @format */

import CloseIcon from '@mui/icons-material/Close'
import { DialogContent, IconButton, styled } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { ReactNode } from 'react'

import VideoPlayer, { IVideoAttrs } from './VideoPlayer'

export interface IVideoDialogProps {
  open: boolean
  onClose: () => void
  children?: ReactNode
  videoProps: IVideoAttrs
}

export interface IDialogTitleProps {
  id: string
  children?: ReactNode
  onClose: () => void
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

function VideoDialogTitle(props: IDialogTitleProps) {
  const { onClose, children, ...other } = props

  return (
    <DialogTitle sx={{ marginRight: 2, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

function VideoDialog(props: IVideoDialogProps) {
  const { onClose, videoProps, children, open } = props

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog"
      open={open}
      maxWidth={false}
      fullWidth={true}
      sx={{
        width: '80%',
        margin: 'auto',
      }}
    >
      <VideoDialogTitle id="customized-dialog-title" onClose={onClose}>
        {children}
        {videoProps.videoName}
      </VideoDialogTitle>
      <DialogContent dividers>
        <VideoPlayer videoProps={videoProps} />
      </DialogContent>
    </BootstrapDialog>
  )
}

export default VideoDialog
