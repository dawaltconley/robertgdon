import type { Project } from './ProjectGrid'
import type { FunctionComponent, ReactNode } from 'react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'

interface ProjectViewProps {
  project: Project
}

const ProjectView = ({ project }: ProjectViewProps) => {
  const hasColumns = project.type === 'youtube' || project.type === 'vimeo'
  return (
    <div
      id="project-view"
      className="t-project-view no-backface transform-gpu overflow-hidden"
      data-project-view
    >
      <div
        id={project.slug}
        className="relative w-full hidden target:block duration-1000 overflow-hidden no-backface {{ bg_img }}"
        data-project
        data-index="{{ include.index }}"
      >
        <canvas
          width="400"
          height="300"
          className="absolute inset-0 z-10"
          data-project-background
          data-image="{{ image_thumb }}"
        ></canvas>

        <div
          className={`container z-20 mx-auto px-md py-lg ${
            hasColumns ? 'grid-cols-2 laptop:grid' : ''
          }`}
          data-project-content
        >
          <ProjectEmbed
            title={project.title}
            link={project.link}
            type={project.type}
            tralbumId={project.tralbumId}
          />

          <div>
            <h3 className="font-caps text-[2em] uppercase">{project.title}</h3>

            <TinaMarkdown content={project.description} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectView

interface ContainerProps {
  aspect: 'square' | 'video'
  children: ReactNode
}

const Loader = () => (
  <div className="flex flex-col items-center justify-center bg-neutral-800/75 text-white">
    <i className="fa fa-spinner fa-pulse fa-3x" aria-hidden="true"></i>
  </div>
)

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
