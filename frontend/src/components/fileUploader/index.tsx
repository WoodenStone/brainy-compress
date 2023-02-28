/** @format */

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { ButtonProps, TypographyProps } from '@mui/material'
import { Box, Button, FormControl, FormHelperText, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/system'
import * as React from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'

export interface IFileUploadProps extends Omit<DropzoneOptions, 'onDrop' | 'onDropAccepted'> {
  fileListBox?: React.ReactNode
  sx?: SxProps<Theme>
  typographyProps?: TypographyProps
  buttonProps?: Omit<ButtonProps, 'onClick'>
  title?: string
  buttonText?: string
  value: File[]
  onChange: (files: File[]) => void
}

const FileUploader = ({
  onChange,
  sx,
  title,
  buttonText,
  typographyProps,
  buttonProps,
  disabled,
  maxSize = 1024 * 1024,
  maxFiles,
  ...options
}: IFileUploadProps) => {
  const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
    ...options,
    disabled,
    maxSize,
    onDropAccepted: onChange,
    noClick: true,
    noKeyboard: true,
    maxFiles,
  })

  const isFileTooLarge = maxSize !== undefined && fileRejections.length > 0 && fileRejections[0].file.size > maxSize

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
      }}>
      <Box
        {...getRootProps()}
        sx={{
          paddingY: 3,
          paddingX: 1,
          border: 1,
          borderRadius: 1,
          borderColor: 'primary.main',
          '&:hover': {
            borderColor: disabled ? undefined : 'text.primary',
          },
          '&:focus-within': {
            borderColor: 'primary.main',
          },
          justifyContent: 'center',
          height: '100%',
          display: 'flex',
          ...sx,
        }}>
        <FormControl
          error={isFileTooLarge}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 40 }} color={disabled ? 'disabled' : 'primary'} />
          <Typography variant="h6" textAlign="center" sx={{ paddingY: 1 }} {...typographyProps}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ paddingBottom: 1 }}>
            Only <strong>images</strong> are supported | single file size not exceed{' '}
            <strong>{maxSize / 1024 / 1024}MB</strong> | <strong>{maxFiles}</strong> files at most
          </Typography>
          <Button variant="contained" onClick={open} disabled={disabled} sx={{ marginBottom: 1 }} {...buttonProps}>
            {buttonText}
          </Button>
          <FormHelperText> {fileRejections[0]?.errors[0]?.message} </FormHelperText>
        </FormControl>
      </Box>
    </Box>
  )
}

FileUploader.defaultProps = {
  buttonText: 'Upload',
  title: 'Drag and drop your files here or click to upload files',
}

export default FileUploader
