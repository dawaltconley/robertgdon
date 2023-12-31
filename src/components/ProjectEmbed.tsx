import type {
  FunctionComponent,
  ReactNode,
  ComponentPropsWithoutRef,
} from 'react'
import Loader from './Loader'

interface ContainerProps {
  aspect: 'square' | 'video'
  children: ReactNode
}

const Container = ({ aspect, children }: ContainerProps) => (
  <div
    className={`layer-children mb-md ${
      aspect === 'video' ? 'aspect-video' : 'aspect-square'
    }`}
  >
    <Loader />
    {children}
  </div>
)

interface ProjectEmbedProps extends ComponentPropsWithoutRef<'iframe'> {
  title: string
  link: string | URL
  type: 'bandcamp' | 'soundcloud' | 'youtube' | 'vimeo'
  tralbumId?: string
}

const ProjectEmbed: FunctionComponent<ProjectEmbedProps> = ({
  title,
  link,
  type,
  tralbumId,
  ...props
}) => {
  const url = new URL(link)

  switch (type) {
    case 'bandcamp':
      if (!tralbumId)
        throw new Error('tralbumId is required for bandcamp projects')
      return (
        <Container aspect="square">
          <iframe
            className="w-full"
            src={`https://bandcamp.com/EmbeddedPlayer/${url.pathname
              .split('/')
              .find(
                Boolean,
              )}=${tralbumId}/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/`}
            {...props}
          >
            <a href={url.href}>{title}</a>
          </iframe>
        </Container>
      )
    case 'soundcloud':
      return (
        <Container aspect="square">
          <iframe
            className="w-full"
            src={`https://w.soundcloud.com/player/?url=${url.href}&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true`}
            {...props}
          ></iframe>
        </Container>
      )
    case 'youtube':
      return (
        <Container aspect="video">
          <iframe
            className="w-full"
            src={url.href.replace('/watch?v=', '/embed/')}
            allowFullScreen
            {...props}
          ></iframe>
        </Container>
      )
    case 'vimeo':
      return (
        <Container aspect="video">
          <iframe
            className="w-full"
            src={`https://player.vimeo.com/video${url.pathname}?title=0&byline=0&portrait=0`}
            allowFullScreen
            {...props}
          ></iframe>
        </Container>
      )
  }
}

export default ProjectEmbed
