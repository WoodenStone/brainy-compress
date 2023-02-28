/** @format */
import ReactPlayer from 'react-player'

export interface IVideoAttrs {
  videoName: string
  src: string
}

export interface IVideoProps {
  videoProps: IVideoAttrs
}

function VideoPlayer(props: IVideoProps) {
  const { videoProps } = props
  return <ReactPlayer url={videoProps.src} controls width={'100%'} height={'100%'}></ReactPlayer>
}

export default VideoPlayer
