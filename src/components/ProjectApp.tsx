import type { ImageProps } from './Image'
import ProjectView from '../components/ProjectView'
import ProjectButton from './ProjectButton'
import { useState, useRef, memo } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'

export interface Project {
  slug: string
  index: number
  date?: string | Date
  title: string
  description: any
  image: ImageProps
  link: string | URL
  type: 'bandcamp' | 'soundcloud' | 'youtube' | 'vimeo' | 'page'
  tralbumId?: string
}

export interface Category {
  name: string
  projects: string[]
}

interface ProjectAppProps {
  projects: Record<string, Project>
  categories: Category[]
  transition?: number
}

const ProjectApp = ({
  projects,
  categories,
  transition = 1000,
}: ProjectAppProps) => {
  const view = useRef<HTMLDivElement>(null)
  const [category, setCategory] = useState(categories[0])
  const [current, setCurrent] = useState<Project>()
  const [last, setLast] = useState<Project>()
  const [isReady, setIsReady] = useState(false)
  const [viewHeight, setViewHeight] = useState<number | null>(0)

  const handlePickProject = (slug: string | null): void => {
    const selected = slug ? projects[slug] : undefined
    setLast(selected && current)
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

  const projectsFlat = categories
    .map((c) => c.projects)
    .flat()
    .map((p) => projects[p])

  return (
    <>
      <div
        ref={view}
        id="project-view"
        className={classNames(
          'no-backface transform-gpu overflow-hidden duration-1000 ease-out',
          {
            'layer-children': viewHeight !== null,
          },
        )}
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
          {projectsFlat.map((p) => {
            const isCurrent = current && p.slug === current.slug
            const isLast = last && p.slug === last.slug
            return (
              (isCurrent || (isLast && !isReady)) && (
                <Transition key={p.slug} timeout={transition}>
                  {(state) => {
                    let position: 'center' | 'left' | 'right'
                    let relativeTo: Project = p

                    if (isCurrent && last) {
                      relativeTo = last
                    } else if (isLast && current && state === 'exiting') {
                      relativeTo = current
                    }

                    if ((isCurrent && isReady) || p.slug === relativeTo.slug) {
                      position = 'center'
                    } else {
                      position =
                        p.index - relativeTo.index < 0 ? 'left' : 'right'
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
        <NoScriptFallback projects={projectsFlat} />
      </noscript>

      <div id="projects" className="container mx-auto my-lg mb-md">
        <h2 className="mb-0 border-b-2 border-neutral-800 pb-xs font-caps text-[2em] uppercase">
          Projects
        </h2>

        <div className="mb-md flex justify-center">
          {categories.map((c) => {
            const isActive = c.name === category.name
            return (
              <button
                className={classNames(
                  'group px-3 pb-3 pt-2 font-caps text-2xl leading-none duration-300',
                  isActive
                    ? 'bg-neutral-800 text-neutral-100'
                    : 'hover:decoration-b-2 bg-transparent',
                )}
                onClick={() => setCategory(c)}
              >
                <span
                  className={classNames(
                    'brand-underline inline-block text-center duration-[inherit] after:-bottom-1 after:border-b-2',
                    {
                      'group-hover:brand-underline--active': !isActive,
                    },
                  )}
                >
                  {c.name}
                </span>
              </button>
            )
          })}
        </div>

        <div className="contains-3d-deep grid grid-cols-2 gap-xs mobile:grid-cols-3 laptop:grid-cols-4 large:grid-cols-5">
          {category.projects.map((p) => (
            <ProjectButton
              key={p}
              handleClick={handlePickProject}
              isActive={p === current?.slug}
              {...projects[p]}
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
