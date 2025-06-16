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

type EmbedType = 'bandcamp' | 'soundcloud' | 'youtube' | 'vimeo'

interface ProjectEmbedProps extends ComponentPropsWithoutRef<'iframe'> {
  title: string
  link: string | URL
  type: EmbedType
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
            src={getBandcampEmbedSrc(url, tralbumId)}
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
            src={getSoundcloudEmbedSrc(url)}
            {...props}
          ></iframe>
        </Container>
      )
    case 'youtube':
      return (
        <Container aspect="video">
          <iframe
            className="w-full"
            src={getYoutubeEmbedSrc(url)}
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
            src={getVimeoEmbedSrc(url)}
            allowFullScreen
            {...props}
          ></iframe>
        </Container>
      )
  }
}

export default ProjectEmbed

function getBandcampEmbedSrc(link: string | URL, tralbumId: string): string {
  const url = new URL(link)
  if (url.pathname.startsWith('/EmbeddedPlayer/')) {
    // if embed link, return unmodified
    return url.href
  } else {
    // e.g. https://moretongues.bandcamp.com/track/keep-it-in
    const type = url.pathname.split('/').find(Boolean) // e.g. track, album
    return `https://bandcamp.com/EmbeddedPlayer/${type}=${tralbumId}/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/`
  }
}

function getSoundcloudEmbedSrc(link: string | URL): string {
  const url = new URL(link)
  if (
    url.hostname === 'w.soundcloud.com' &&
    url.pathname.startsWith('/player/')
  ) {
    // if embed link, return unmodified
    return url.href
  } else {
    // e.g. https://soundcloud.com/user-311803244/ink-the-octopus-humanly-possible?in=user-311803244/sets/ink-the-octopus
    return `https://w.soundcloud.com/player/?url=${url.href}&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true`
  }
}

function getYoutubeEmbedSrc(link: string | URL): string {
  const url = new URL(link)
  return url.href.replace('/watch?v=', '/embed/')
}

function getVimeoEmbedSrc(link: string | URL): string {
  const url = stripSearchParams(new URL(link))
  if (url.hostname === 'player.vimeo.com') {
    // if embed, return with modified search params
    url.searchParams.set('title', '0')
    url.searchParams.set('byline', '0')
    url.searchParams.set('portrait', '0')
    return url.href
  } else {
    // else, return embed url using video code
    // e.g. https://vimeo.com/1075423559
    return `https://player.vimeo.com/video${url.pathname}?title=0&byline=0&portrait=0`
  }
}

function stripSearchParams(url: URL): URL {
  const urlCopy = new URL(url)
  for (const param of urlCopy.searchParams.keys()) {
    urlCopy.searchParams.delete(param)
  }
  return urlCopy
}
