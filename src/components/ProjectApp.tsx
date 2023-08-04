import ProjectView from '../components/ProjectView'
import ProjectButton from './ProjectButton'
import { useState, useRef, memo } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'

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
  transition?: number
}

const ProjectApp = ({ projects, transition = 1000 }: ProjectAppProps) => {
  const view = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState<Project>()
  const [last, setLast] = useState<Project>()
  const [isReady, setIsReady] = useState(false)
  const [viewHeight, setViewHeight] = useState<number | null>(0)

  const handlePickProject = (slug: string | null): void => {
    const selected = projects.find((p) => p.slug === slug)
    setLast(current)
    setCurrent(selected)
    setIsReady(false) // should probably use setCurrent or setNext or something instead
    if (!selected) close()
    if (!view.current) return
    const { top } = view.current.getBoundingClientRect()
    window.scrollTo(0, top + window.scrollY)
  }

  const close = () => setViewHeight(0)

  const handleHeightChange = (h: number | null): void => {
    setViewHeight(h)
  }

  const getRelativeIndex = (from: Project, to: Project): number => {
    const slugs = projects.map((p) => p.slug)
    return slugs.indexOf(from.slug) - slugs.indexOf(to.slug)
  }

  return (
    <>
      <div
        ref={view}
        id="project-view"
        className="no-backface layer-children transform-gpu overflow-hidden duration-1000 ease-out"
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
        <TransitionGroup component={null}>
          {projects.map((p) => {
            const isCurrent = current && p.slug === current.slug
            const isLast = last && p.slug === last.slug
            return (
              (isCurrent || (isLast && !isReady)) && (
                <Transition key={p.slug} timeout={transition}>
                  {(state) => {
                    let position: 'center' | 'left' | 'right'
                    let relativeTo: Project | undefined

                    if (isCurrent) {
                      relativeTo = last
                    } else if (isLast && state === 'exiting') {
                      relativeTo = current
                    }
                    let relative = getRelativeIndex(p, relativeTo ?? p)

                    if (isCurrent && isReady) {
                      position = 'center'
                    } else if (relative > 0) {
                      position = 'right'
                    } else if (relative < 0) {
                      position = 'left'
                    } else {
                      position = 'center'
                    }

                    return (
                      <ProjectView
                        key={p.slug}
                        project={p}
                        position={position}
                        timeout={transition}
                        onReady={() => isCurrent && setIsReady(true)}
                        onHeightChange={
                          isCurrent ? handleHeightChange : undefined
                        }
                      />
                    )
                  }}
                </Transition>
              )
            )
          })}
        </TransitionGroup>
      </div>

      <noscript>
        <NoScriptFallback projects={projects} />
      </noscript>

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
