/** @format */

import CompareOutlinedIcon from '@mui/icons-material/CompareOutlined'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import PhotoFilterOutlinedIcon from '@mui/icons-material/PhotoFilterOutlined'
import { Button, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import ReactCompareImage from 'react-compare-image'

import { createDownloadLink } from '../../utils/download'

export interface IImageCardProps {
  imageSrc: string
  imageName: string
  metrics: Record<string, string>
  model: string
  fileType: string
  originalImgSrc: string
  reqMetric: string
  reqQuality: number | string
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  sx?: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      sx={{
        width: '100%',
        height: '100%',
        ...sx,
      }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  )
}

export function ImageCard({
  imageSrc,
  imageName,
  metrics,
  originalImgSrc,
  model,
  reqMetric,
  reqQuality,
}: IImageCardProps) {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleDownloadImg = () => {
    createDownloadLink(imageSrc, `${imageName.split('.')[0]}_compressed_${model}.${imageName.split('.')[1]}`)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        boxShadow: 2,
        borderRadius: '0.5rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      <Box
        sx={{
          width: '100%',
          maxHeight: '3rem',
        }}>
        <Tooltip title="download compressed image">
          <Button size="small" fullWidth onClick={handleDownloadImg}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '1rem',
              }}>
              {model}
            </Typography>
          </Button>
        </Tooltip>
        <Typography align="center">{`metric: ${reqMetric} | quality: ${reqQuality}`}</Typography>
      </Box>
      <Divider></Divider>

      <Tabs
        value={value}
        onChange={handleChange}
        centered
        variant="fullWidth"
        scrollButtons="auto"
        sx={{
          position: 'absolute',
          bottom: '0',
          margin: 'auto',
          zIndex: 1,
        }}>
        <Tooltip title="compressed image">
          <Tab icon={<PhotoFilterOutlinedIcon />} aria-label="compressed Image" />
        </Tooltip>
        <Tooltip title="metrics">
          <Tab icon={<InsightsOutlinedIcon />} aria-label="metrics" />
        </Tooltip>
        <Tooltip title="compare">
          <Tab icon={<CompareOutlinedIcon />} aria-label="compare with the original one" />
        </Tooltip>
      </Tabs>

      {/* 压缩后的图片 */}
      <TabPanel
        value={value}
        index={0}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Box
          sx={{
            xs: {
              width: '30vw',
            },
            width: '25vw',
            height: '35vh',
          }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}></Box>
        </Box>
      </TabPanel>
      {/* 展示指标的表格 */}
      <TabPanel
        value={value}
        index={1}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        <TableContainer
          sx={{
            width: '100%',
            height: '40vh',
          }}>
          <Table aria-label="metrics table" size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  variant="head"
                  sx={{
                    fontWeight: 'bold',
                  }}>
                  Metric Name
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 'bold',
                  }}>
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(metrics).map(([metric, value]) => (
                <TableRow key={metric} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {metric}
                  </TableCell>
                  <TableCell align="right">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      {/* 滑动比较器 */}
      <TabPanel
        value={value}
        index={2}
        sx={{
          xs: {
            width: '60vw',
            height: '40vh',
          },
          width: '20vw',
          height: '20vh',
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute',
          top: '5rem',
        }}>
        <Box
          sx={{
            xs: {
              width: '60vw',
              height: '40vh',
            },
            width: '20vw',
            height: '20vh',
          }}>
          <ReactCompareImage
            rightImage={imageSrc}
            leftImage={originalImgSrc}
            leftImageLabel="before"
            rightImageLabel="after"></ReactCompareImage>
        </Box>
      </TabPanel>
    </Box>
  )
}
