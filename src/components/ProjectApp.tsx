import ProjectView from '../components/ProjectView'
import ProjectButton from './ProjectButton'
import { useState, useRef } from 'react'

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

  const handlePickProject = (slug: string): void => {
    const selected = projects.find((p) => p.slug === slug)
    setCurrent(selected)
    if (!view.current) return
    const { top } = view.current.getBoundingClientRect()
    window.scrollTo(0, top + window.scrollY)
  }

  return (
    <>
      <div
        ref={view}
        id="project-view"
        className="t-project-view no-backface transform-gpu overflow-hidden"
        data-project-view
      >
        <div
          id="project-view"
          className="t-project-view no-backface transform-gpu overflow-hidden"
          data-project-view
        >
          {current && <ProjectView project={current} />}
        </div>
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

export default ProjectApp
