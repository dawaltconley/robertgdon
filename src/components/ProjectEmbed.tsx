import type { FunctionComponent, ReactNode } from 'react'
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

interface ProjectEmbedProps {
  title: string
  link: string | URL
  type: 'bandcamp' | 'soundcloud' | 'youtube' | 'vimeo' | 'page'
  tralbumId?: string
}

const ProjectEmbed: FunctionComponent<ProjectEmbedProps> = ({
  title,
  link,
  type,
  tralbumId,
}) => {
  const url = new URL(link)
  const analytics = {
    'data-analytics-category': 'Audio',
    'data-analytics-action': 'click',
    'data-analytics-label': `Listened to ${title}`,
  }

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
            seamless
            loading="lazy"
            {...analytics}
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
            seamless
            loading="lazy"
            {...analytics}
          ></iframe>
        </Container>
      )
    case 'youtube':
      return (
        <Container aspect="video">
          <iframe
            className="w-full"
            src={url.href.replace('/watch?v=', '/embed/')}
            loading="lazy"
            allowFullScreen
            seamless
            {...analytics}
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
            seamless
            loading="lazy"
            {...analytics}
          ></iframe>
        </Container>
      )
    case 'page':
      return (
        <a
          className="group relative mb-md block overflow-hidden"
          href={url.href}
          target="_blank"
          {...analytics}
        >
          <img
            className="group-hover:blur-sm"
            src="{{ image_display }}"
            alt={title}
          />
          <div className="absolute inset-0 flex flex-col bg-neutral-800/75 p-md text-center text-white opacity-0 group-hover:opacity-100">
            <span className="margin-auto">Visit Site</span>
          </div>
        </a>
      )
  }
}

export default ProjectEmbed
