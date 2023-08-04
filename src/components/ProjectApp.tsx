import ProjectView from '../components/ProjectView'
import ProjectButton from './ProjectButton'
import { useState, useRef, memo } from 'react'

export interface Project {
  slug: string
  date?: string | Date
  title: string
  description: any
  image: string
  link: string | URL
  type: 'bandcamp' | 'soundcloud' | 'youtube' | 'vimeo' | 'page'
  tralbumId?: string
}

interface ProjectAppProps {
  projects: Project[]
}

const ProjectApp = ({ projects }: ProjectAppProps) => {
  const view = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState<Project>()
  const [viewHeight, setViewHeight] = useState<number | null>(0)

  const handlePickProject = (slug: string | null): void => {
    const selected = projects.find((p) => p.slug === slug)
    setCurrent(selected)
    if (!selected) close()
    if (!view.current) return
    const { top } = view.current.getBoundingClientRect()
    window.scrollTo(0, top + window.scrollY)
  }

  const close = () => setViewHeight(0)

  const handleHeightChange = (h: number | null): void => {
    setViewHeight(h)
  }

  return (
    <>
      <div
        ref={view}
        id="project-view"
        className="no-backface transform-gpu overflow-hidden duration-1000 ease-out"
        style={
          viewHeight === null
            ? {
                transitionDuration: '0s',
              }
            : {
                height: viewHeight,
              }
        }
        data-project-view
      >
        {current && (
          <ProjectView
            key={current.slug}
            project={current}
            onHeightChange={handleHeightChange}
          />
        )}
        <noscript>
          <NoScriptFallback projects={projects} />
        </noscript>
      </div>

      <div id="projects" className="container mx-auto my-lg">
        <h2 className="border-b border-neutral-800 pb-xs font-caps text-[2em] uppercase">
          Projects
        </h2>

        <div className="contains-3d-deep grid grid-cols-2 gap-xs mobile:grid-cols-3 laptop:grid-cols-4 large:grid-cols-5">
          {projects.map((p) => (
            <ProjectButton
              key={p.slug}
              handleClick={handlePickProject}
              isActive={p.slug === current?.slug}
              {...p}
            />
          ))}
        </div>
      </div>
    </>
  )
}

const NoScriptFallback = memo(({ projects }: { projects: Project[] }) => (
  <>
    {projects.map((p) => (
      <ProjectView key={p.slug} project={p} noJs />
    ))}
  </>
))

export default ProjectApp
