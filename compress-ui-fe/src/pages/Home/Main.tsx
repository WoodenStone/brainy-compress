/** @format */

import CompressOutlinedIcon from '@mui/icons-material/CompressOutlined'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import RestorePageIcon from '@mui/icons-material/RestorePage'
import { Box, Button, Grid, Typography } from '@mui/material'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'

import { compressImage, IImageCompressRequest } from '../../api'
import CheckboxList from '../../components/checkbox'
import { FileList } from '../../components/fileList/FileList'
import FileUploader from '../../components/fileUploader'
import { ImageCard } from '../../components/imageCard'
import { Loading } from '../../components/loading'
import { useNotification } from '../../components/notification'
import { createDownloadLink } from '../../utils/download'
const acceptFileTypes = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
}

const models = [
  'bmshj2018-factorized',
  'bmshj2018-hyperprior',
  'mbt2018',
  'mbt2018-mean',
  'cheng2020-anchor',
  'cheng2020-attn',
]

interface ICompressResult {
  compressedImg: Blob
  metrics: Record<string, string>
  originalImg: Blob
  fileName: string
  fileType: string
  model: string
}

async function compressOneImage(params: IImageCompressRequest): Promise<ICompressResult> {
  const res = await compressImage(params)
  const { fileName, fileType, file, model } = params
  const result = {
    compressedImg: new Blob([res?.data], { type: fileType }),
    metrics: res?.metrics,
    originalImg: file,
    fileName: fileName,
    fileType: fileType,
    model,
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
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [compressedResult, setCompressedResult] = useState<ICompressResult[][]>([])
  const [isCompressing, setIsCompressing] = useState<boolean>(false)

  const removeCurrentFile = (i: number) => {
    const newFiles = [...files]
    newFiles.splice(i, 1)
    setFiles(newFiles)
  }

  const resetAllFiles = () => {
    setFiles([])
  }

  const useHandleSelectedModels = (selected: string[]) => {
    setSelectedModels(selected)
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
                model,
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
      {/* 模型选择和文件列表部分，一行两列，响应式，小尺寸时一行一列 */}
      <Grid item container columns={{ xs: 1, md: 2 }} justifyContent="space-evenly" alignItems="flex-start" spacing={2}>
        <Grid item xs={1} sm={1}>
          <CheckboxList title="Select Models" models={models} onChange={useHandleSelectedModels} />
          <Tooltip title="start compressing">
            <Button
              startIcon={<CompressOutlinedIcon />}
              color="secondary"
              variant="contained"
              fullWidth
              onClick={handleCompress}>
              Go
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={1} sm={1}>
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
        compressedResult?.length > 0 &&
        compressedResult.map(imageResult => {
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
                  const { compressedImg, metrics, originalImg, fileName, fileType, model } = item
                  const compressedImgUrl = URL.createObjectURL(compressedImg)
                  const originalImgUrl = URL.createObjectURL(originalImg)
                  return (
                    <Grid item xs={1} sm={1} width="33vw" height={'50vh'} key={`${fileName}-${model}`}>
                      {/* 压缩结果的卡片 */}
                      <ImageCard
                        imageName={fileName}
                        imageSrc={compressedImgUrl}
                        metrics={metrics}
                        model={model}
                        fileType={fileType}
                        originalImgSrc={originalImgUrl}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          )
        })}
      {compressedResult?.length > 0 && (
        <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
          <SpeedDial
            ariaLabel="Actions"
            sx={{ position: 'absolute', bottom: '1rem', right: -100 }}
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

export default Main
