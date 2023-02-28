/** @format */

import CompressOutlinedIcon from '@mui/icons-material/CompressOutlined'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import RestorePageIcon from '@mui/icons-material/RestorePage'
import { Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import React from 'react'

import { autoCompressImage, compressImage, IAutoImageCompressRequest, IImageCompressRequest } from '../../api'
import { FileList } from '../../components/fileList/FileList'
import FileUploader from '../../components/fileUploader'
import { ImageCard } from '../../components/imageCard'
import { Loading } from '../../components/loading'
import ModelList, { IModel, IModelChecked } from '../../components/modelList'
import { AutoModelList, IAutoModelSelected } from '../../components/modelList/automatic'
import { useNotification } from '../../components/notification'
import { createDownloadLink } from '../../utils/utils'

const acceptFileTypes = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/tiff': ['.tiff', '.tif'],
  'image/webp': ['.webp'],
  'image/bmp': ['.bmp'],
}

const modelList: IModel[] = [
  {
    name: 'bmshj2018-factorized',
    metric: ['mse', 'ms-ssim'],
    quality: [...Array(8).keys()].map(x => ++x),
    selectedMetric: 'mse',
    selectedQuality: 1,
    paperName: 'Variational image compression with a scale hyperprior',
    paperLink: 'https://arxiv.org/abs/1802.01436',
  },
  {
    name: 'bmshj2018-hyperprior',
    metric: ['mse', 'ms-ssim'],
    quality: [...Array(8).keys()].map(x => ++x),
    selectedMetric: 'mse',
    selectedQuality: 1,
    paperName: 'Variational image compression with a scale hyperprior',
    paperLink: 'https://arxiv.org/abs/1802.01436',
  },
  {
    name: 'mbt2018-mean',
    metric: ['mse', 'ms-ssim'],
    quality: [...Array(8).keys()].map(x => ++x),
    selectedMetric: 'mse',
    selectedQuality: 1,
    paperName: 'Joint Autoregressive and Hierarchical Priors for Learned Image Compression',
    paperLink: 'https://arxiv.org/abs/1809.02736',
  },
  {
    name: 'mbt2018',
    metric: ['mse', 'ms-ssim'],
    quality: [...Array(8).keys()].map(x => ++x),
    selectedMetric: 'mse',
    selectedQuality: 1,
    paperName: 'Joint Autoregressive and Hierarchical Priors for Learned Image Compression',
    paperLink: 'https://arxiv.org/abs/1809.02736',
  },
  {
    name: 'cheng2020-anchor',
    metric: ['mse', 'ms-ssim'],
    quality: [...Array(6).keys()].map(x => ++x),
    selectedMetric: 'mse',
    selectedQuality: 1,
    paperName: 'Learned Image Compression with Discretized Gaussian Mixture Likelihoods and Attention Modules',
    paperLink: 'https://arxiv.org/abs/2001.01568',
  },
  {
    name: 'cheng2020-attn',
    metric: ['mse', 'ms-ssim'],
    quality: [...Array(6).keys()].map(x => ++x),
    selectedMetric: 'mse',
    selectedQuality: 1,
    paperName: 'Learned Image Compression with Discretized Gaussian Mixture Likelihoods and Attention Modules',
    paperLink: 'https://arxiv.org/abs/2001.01568',
  },
]

const defaultAutoSelected: IAutoModelSelected = {
  metric: 'ms-ssim',
  quality: 'auto',
}

interface ICompressResult {
  compressedImg: Blob
  metrics: Record<string, string>
  originalImg: Blob
  fileName: string
  fileType: string
  model: string
  reqMetric: string
  reqQuality: number | string
}

async function compressOneImage(params: IImageCompressRequest): Promise<ICompressResult> {
  const res = await compressImage(params)

  const { fileName, fileType, file, model, metric, quality } = params
  const result = {
    compressedImg: res?.data,
    metrics: res?.metrics,
    originalImg: file,
    fileName: fileName,
    fileType: fileType,
    model,
    reqMetric: metric,
    reqQuality: quality,
  }
  return result
}

async function autoCompressOneImage(params: IAutoImageCompressRequest): Promise<ICompressResult> {
  const res = await autoCompressImage(params)

  const { fileName, fileType, file, metric, quality } = params
  const result = {
    compressedImg: res?.data,
    metrics: res?.metrics,
    originalImg: file,
    fileName: fileName,
    fileType: fileType,
    model: 'auto',
    reqMetric: metric,
    reqQuality: quality,
  }
  return result
}

const CLEAR_RESULTS = 'clear'
const DOWNLOAD_ALL = 'download'

const actions = [
  { icon: <RestorePageIcon />, tooltip: 'Clear all results', name: CLEAR_RESULTS },
  {
    icon: <LibraryAddIcon />,
    tooltip: 'Download all compressed images',
    name: DOWNLOAD_ALL,
  },
]

function Main() {
  const { notice } = useNotification()

  const [files, setFiles] = useState<File[]>([])
  const [selectedModels, setSelectedModels] = useState<IModelChecked[]>([])
  const [compressedResult, setCompressedResult] = useState<ICompressResult[][]>([])
  const [isCompressing, setIsCompressing] = useState<boolean>(false)
  const [tabIndex, setTabIndex] = React.useState(0)
  const [autoSelected, setAutoSelected] = useState<IAutoModelSelected>(defaultAutoSelected)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  const removeCurrentFile = (i: number) => {
    const newFiles = [...files]
    newFiles.splice(i, 1)
    setFiles(newFiles)
  }

  const resetAllFiles = () => {
    setFiles([])
  }

  const useHandleSelectedModels = (selected: IModelChecked[]) => {
    setSelectedModels(selected)
  }

  const handleAutoSelection = (s: IAutoModelSelected) => {
    setAutoSelected(s)
  }

  const handleFABClick = (name: string) => {
    switch (name) {
      case CLEAR_RESULTS:
        setCompressedResult([])
        break
      case DOWNLOAD_ALL:
        compressedResult.forEach(results => {
          results.forEach(result => {
            const { compressedImg, fileName, model } = result
            const imageSrc = URL.createObjectURL(compressedImg)
            createDownloadLink(imageSrc, `${fileName.split('.')[0]}_compressed_${model}.${fileName.split('.')[1]}`)
          })
        })
        break
      default:
        break
    }
  }

  const handleCompress = async () => {
    if (selectedModels.length === 0) {
      notice('Please select at least one model', 'warning')
      return
    }
    if (files.length === 0) {
      notice('Please upload at least one image', 'warning')
      return
    }

    setCompressedResult([])

    setIsCompressing(true)

    try {
      const results = await Promise.all(
        files.map(file =>
          Promise.all(
            selectedModels.map(model =>
              compressOneImage({
                file,
                fileName: file.name,
                fileType: file.type,
                model: model.name,
                quality: model.quality,
                metric: model.metric as 'mse' | 'ms-ssim',
              }),
            ),
          ),
        ),
      )
      setCompressedResult(results)
    } catch (e) {
      notice('Compress failed, please try again later', 'error')
      console.error(e)
      return
    } finally {
      setIsCompressing(false)
    }
  }

  const handleAutoCompress = async () => {
    if (files.length === 0) {
      notice('Please upload at least one image', 'warning')
      return
    }

    setCompressedResult([])

    setIsCompressing(true)

    try {
      const results = await Promise.all(
        files.map(file =>
          Promise.all(
            ['auto'].map(() =>
              autoCompressOneImage({
                file,
                fileName: file.name,
                fileType: file.type,
                metric: autoSelected?.metric as 'mse' | 'ms-ssim',
                quality: autoSelected?.quality as 'auto' | 'low' | 'medium' | 'high',
              }),
            ),
          ),
        ),
      )
      setCompressedResult(results)
    } catch (e) {
      notice('Compress failed, please try again later', 'error')
      console.error(e)
      return
    } finally {
      setIsCompressing(false)
    }
  }

  const startCompress = () => {
    if (tabIndex === 0) {
      handleCompress()
    } else {
      handleAutoCompress()
    }
  }

  return (
    <Grid container columns={1} width={'70vw'} height="100%" paddingY={'1rem'} spacing={2} flexDirection="column">
      {/* 上传框部分*/}
      <Grid item className="upload">
        <FileUploader
          value={files}
          onChange={setFiles}
          accept={acceptFileTypes}
          maxFiles={10}
          maxSize={1024 * 5 * 1024}
        />
      </Grid>
      {/* 模型选择和文件列表部分 */}
      <Grid item container columns={{ xs: 6, md: 12 }} justifyContent="space-evenly" alignItems="stretch" spacing={2}>
        <Grid item xs={6} sm={8}>
          <Box
            sx={{
              display: 'flex',
            }}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                marginBottom: 1,
              }}>
              <Tabs
                orientation="vertical"
                variant="fullWidth"
                value={tabIndex}
                onChange={handleChange}
                aria-label="Manual or Auto"
                sx={{ borderRight: 1, borderColor: 'divider', flexGrow: 1, height: '100%' }}>
                <Tab label="Manually" />
                <Tab label="Auto" />
              </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
              <Box
                sx={{
                  flexGrow: 1,
                  paddingBottom: 1,
                }}>
                <ModelList title="Select Models" modelList={modelList} onChange={useHandleSelectedModels} />
              </Box>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Box
                sx={{
                  flexGrow: 1,
                  paddingBottom: 1,
                }}>
                <AutoModelList
                  title="Automatic Selection"
                  selected={defaultAutoSelected}
                  onChange={handleAutoSelection}
                />
              </Box>
            </TabPanel>
          </Box>
          <Tooltip title="start compressing">
            <Button
              startIcon={<CompressOutlinedIcon />}
              color="secondary"
              variant="contained"
              fullWidth
              onClick={startCompress}>
              Go
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={4}>
          {files?.length > 0 && <FileList files={files} remove={removeCurrentFile} reset={resetAllFiles} />}
        </Grid>
      </Grid>
      {/* Loading 动画部分，加载时显示 */}
      {isCompressing && (
        <Grid item marginY={'2rem'}>
          <Loading />
        </Grid>
      )}
      {/* 压缩图片结果显示，一行两列，响应式，小尺寸时一行一列，一个图片对应一个标题 */}
      {!isCompressing &&
        compressedResult !== undefined &&
        compressedResult?.length > 0 &&
        compressedResult?.map(imageResult => {
          return (
            <Grid
              item
              container
              columns={1}
              spacing={3}
              key={imageResult[0].fileName}
              sx={{
                marginY: '1rem',
              }}>
              <Typography variant="h5" pl={3}>
                {imageResult[0].fileName}
              </Typography>
              <Grid
                item
                container
                columns={{ xs: 1, md: 2 }}
                justifyContent="space-between"
                alignItems="flex-start"
                columnSpacing={2}
                spacing={2}>
                {imageResult.map((item: ICompressResult) => {
                  const {
                    compressedImg,
                    metrics,
                    originalImg,
                    fileName,
                    fileType,
                    model,
                    reqMetric: metric,
                    reqQuality: quality,
                  } = item

                  const compressedImgUrl = URL.createObjectURL(compressedImg)
                  const originalImgUrl = URL.createObjectURL(originalImg)
                  return (
                    <Grid
                      item
                      xs={1}
                      sm={1}
                      width="33vw"
                      height={'50vh'}
                      key={`${fileName}-${model}-${quality}-${metric}`}>
                      {/* 压缩结果的卡片 */}
                      <ImageCard
                        imageName={fileName}
                        imageSrc={compressedImgUrl}
                        metrics={metrics}
                        model={model}
                        fileType={fileType}
                        originalImgSrc={originalImgUrl}
                        reqMetric={metric}
                        reqQuality={quality}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          )
        })}
      {compressedResult?.length > 0 && (
        <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1, position: 'fixed', top: '95vh', right: '5vw' }}>
          <SpeedDial
            ariaLabel="Actions"
            sx={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
            icon={<SpeedDialIcon />}>
            {actions.map(action => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.tooltip}
                onClick={() => {
                  handleFABClick(action.name)
                }}
              />
            ))}
          </SpeedDial>
        </Box>
      )}
    </Grid>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      style={{ display: 'flex', flexGrow: value === index ? 1 : 0 }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && children}
    </div>
  )
}

export default Main
