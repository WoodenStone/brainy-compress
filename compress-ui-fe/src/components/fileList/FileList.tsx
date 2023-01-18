/** @format */

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { Box, Divider, IconButton, List, ListItem, Typography } from '@mui/material'

import FileItem from './FileItem'

export interface IFileListProps {
  /**
   * file list to display
   */
  files: File[]
  reset: () => void
  /**
   *
   * @param i index of file to remove
   */
  remove: (i: number) => void
}

export function FileList({ files, remove, reset }: IFileListProps) {
  return (
    <List sx={{ maxHeight: '50vh' }}>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="reset" color="primary" size="small" onClick={reset}>
            <DeleteSweepIcon />
          </IconButton>
        }>
        <Typography variant="overline" fontSize="1rem">
          Files
        </Typography>
      </ListItem>
      <Divider />

      <Box sx={{ maxHeight: '40vh', overflowX: 'hidden' }}>
        {files.map((file, i) => (
          <FileItem
            key={file.name}
            name={file.name}
            preview={URL.createObjectURL(file)}
            onDelete={() => remove(i)}
            file={file}
          />
        ))}
      </Box>
    </List>
  )
}
