import type { Project } from './ProjectApp'
import ProjectEmbed from './ProjectEmbed'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { drawToCanvas } from '../lib/browser/drawToCanvas'
import classNames from 'classnames'
import { useEffect, useRef, RefObject } from 'react'
import throttle from 'lodash/throttle'

interface ProjectViewProps {
  project: Project
  projectRef?: RefObject<HTMLDivElement>
  noJs?: boolean
  onReady?: () => void
  onHeightChange?: (height: number | null) => void
  position?: 'center' | 'left' | 'right'
  timeout?: number
}

const nullFunc = () => {}

const ProjectView = ({
  project,
  noJs,
  onReady = nullFunc,
  onHeightChange = nullFunc,
  projectRef,
  position,
  timeout,
}: ProjectViewProps) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const body = projectRef || useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const image = useRef<HTMLImageElement>(new Image())

  const hasColumns = project.type !== 'youtube' && project.type !== 'vimeo'
  const analytics = {
    'data-analytics-category': 'Audio',
    'data-analytics-action': 'click',
    'data-analytics-label': `Listened to ${project.title}`,
  }

  useEffect(() => {
    const img = image.current
    img.addEventListener('load', () => {
      if (!canvas.current || !body.current || !content.current) return onReady()
      drawToCanvas(canvas.current, body.current, content.current, image.current)
      onReady()
      onHeightChange(content.current.scrollHeight)
    })
    img.src = project.image

    let timeout: number
    const onResize = throttle(
      () => {
        window.clearTimeout(timeout)
        onHeightChange(null)
        timeout = window.setTimeout(() => {
          if (!content.current) return
          onHeightChange(content.current.scrollHeight)
        }, 200)
      },
      150,
      { leading: true },
    )
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div
      ref={body}
      id={project.slug}
      className={classNames(
        'no-backface min-h-full w-full overflow-hidden',
        noJs ? 'relative hidden target:block' : 'absolute inset-0',
        {
          'translate-x-full': position === 'right',
          'translate-x-0': position === 'center',
          '-translate-x-full': position === 'left',
        },
      )}
      style={{
        transitionDuration: timeout ? timeout.toString() + 'ms' : '0s',
      }}
      data-project
      data-index="{{ include.index }}"
    >
      <canvas
        ref={canvas}
        width="400"
        height="300"
        className="absolute inset-0 z-10 h-full w-full"
        data-project-background
        data-image="{{ image_thumb }}"
      ></canvas>

      <div
        ref={content}
        className={classNames('container relative z-20 mx-auto px-md py-lg', {
          'grid-cols-2 gap-md laptop:grid': hasColumns,
        })}
      >
        {project.type === 'page' ? (
          <a
            className="group relative mb-md block overflow-hidden"
            href={project.link.toString()}
            target="_blank"
            {...analytics}
          >
            <img
              className="group-hover:blur-sm"
              src={project.image}
              alt={project.title}
            />
            <div className="absolute inset-0 flex flex-col bg-neutral-800/75 p-md text-center text-white opacity-0 group-hover:opacity-100">
              <span className="margin-auto">Visit Site</span>
            </div>
          </a>
        ) : (
          <ProjectEmbed
            title={project.title}
            link={project.link}
            type={project.type}
            tralbumId={project.tralbumId}
            loading="lazy"
            seamless
            {...analytics}
          />
        )}

        <div>
          <h3 className="font-caps text-[2em] uppercase">{project.title}</h3>

          <TinaMarkdown content={project.description} />
        </div>
      </div>
    </div>
  )
}

export default ProjectView
