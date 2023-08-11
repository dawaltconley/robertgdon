import type { SiteQuery } from '@tina/__generated__/types'
import type { ImageProps } from './Image'
import ProjectView from './ProjectView'
import ProjectButton from './ProjectButton'
import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { useTina, tinaField } from 'tinacms/dist/react'
import { Transition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'
import pick from 'lodash/pick'
import { isNotEmpty } from '@lib/utils'

const ProjectType = [
  'bandcamp',
  'soundcloud',
  'youtube',
  'vimeo',
  'page',
] as const

type ProjectType = (typeof ProjectType)[number]

const isProjectType = (s: string): s is ProjectType =>
  ProjectType.includes(s as ProjectType)

const getCategories = ({ site }: SiteQuery): Category[] => {
  let projectIndex = 0
  return (
    site.projects
      ?.filter(isNotEmpty)
      .map<Category>(({ category, projects }) => ({
        name: category,
        projects:
          projects
            ?.map((p) => p?.project)
            .filter(isNotEmpty)
            .map((p) => {
              const slug = p._sys.filename

              return {
                ...pick(p, ['title', 'description', 'image', 'link']),
                slug,
                index: projectIndex++, // map side effect: increment project index
                type: isProjectType(p.media) ? p.media : 'page',
                tralbumId: p.tralbum_id || undefined,
                __raw: p,
              }
            }) || [],
      }))
      .filter(({ projects }) => projects.length > 0) || []
  )
}

type ProjectData = NonNullable<
  NonNullable<
    NonNullable<NonNullable<SiteQuery['site']['projects']>[number]>['projects']
  >[number]
>['project']

export interface Project {
  slug: string
  index: number
  date?: string | Date
  title: string
  description: any
  image: string
  link: string | URL
  type: ProjectType
  tralbumId?: string
  __raw: ProjectData
}

export interface Category {
  name: string
  projects: Project[]
}

interface ProjectAppProps {
  site: Parameters<typeof useTina<SiteQuery>>[0]
  responsiveImages?: Record<string, ImageProps>
  transition?: number
}

const ProjectApp = ({
  site,
  responsiveImages = {},
  transition = 1000,
}: ProjectAppProps) => {
  const { data } = useTina<SiteQuery>(site)
  const categories = useMemo(() => getCategories(data), [data])
  const projectsFlat = useMemo(
    () => categories.map((c) => c.projects).flat(),
    [categories],
  )
  const projects = useMemo(
    () =>
      projectsFlat.reduce<Record<string, Project>>(
        (dict, p) => ({
          ...dict,
          [p.slug]: p,
        }),
        {},
      ),
    [projectsFlat],
  )

  const view = useRef<HTMLDivElement>(null)
  const animating = useRef(0)

  const [catIndex, setCatIndex] = useState(0)
  const [current, setCurrent] = useState<Project>()
  const [last, setLast] = useState<Project>()
  const [isReady, setIsReady] = useState(false)
  const [viewHeight, setViewHeight] = useState<number | null>(0)

  const category = categories[catIndex]

  const handlePickProject = (slug: string | null): void => {
    if (animating.current > 0) return
    history.replaceState({ project: slug }, '', `#${slug || ''}`)

    const selected = slug ? projects[slug] : undefined
    setLast(selected && current)
    setCurrent(selected)
    setIsReady(false) // should probably use setCurrent or setNext or something instead
    if (!selected) close()
    if (!slug || !view.current) return
    const { top } = view.current.getBoundingClientRect()
    window.scrollTo(0, top + window.scrollY)
  }

  const close = () => setViewHeight(0)

  const handleHeightChange = (h: number | null): void => {
    setViewHeight(h)
  }

  const updateProjectFromHash = (): void => {
    const slug = location.hash.slice(1)
    if (slug) {
      handlePickProject(slug)
    }
  }

  useEffect(() => {
    updateProjectFromHash()
    window.addEventListener('hashchange', updateProjectFromHash)
    return () => {
      window.removeEventListener('hashchange', updateProjectFromHash)
    }
  }, [])

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
                <Transition
                  key={p.slug}
                  timeout={transition + 100} // add 100ms buffer to ensure animation finished before unmount
                  onEnter={() => animating.current++}
                  onEntered={() => animating.current--}
                  onExit={() => animating.current++}
                  onExited={() => {
                    animating.current--
                    setLast(undefined)
                  }}
                >
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
                        responsiveImages={responsiveImages}
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
        <NoScriptFallback projects={projectsFlat} images={responsiveImages} />
      </noscript>

      <div id="projects" className="container mx-auto my-lg mb-md">
        <h2
          className="mb-0 border-b-2 border-neutral-800 pb-xs font-caps text-[2em] uppercase"
          data-tina-field={tinaField(data.site, 'project_heading')}
        >
          {data.site.project_heading}
        </h2>

        <div className="mb-md flex justify-center">
          {categories.map((c, i) => {
            const isActive = c.name === category.name
            return (
              <button
                key={c.name}
                className={classNames(
                  'group px-3 pb-3 pt-2 font-caps text-2xl leading-none duration-300',
                  isActive
                    ? 'bg-neutral-800 text-neutral-100'
                    : 'hover:decoration-b-2 bg-transparent',
                )}
                onClick={() => setCatIndex(i)}
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

        <div className="contains-3d grid grid-cols-2 gap-xs mobile:grid-cols-3 laptop:grid-cols-4 large:grid-cols-5">
          {categories[catIndex].projects.map((project) => {
            const image = responsiveImages[project.image] ?? project.image
            return (
              <ProjectButton
                key={project.slug}
                handleClick={handlePickProject}
                isActive={project.slug === current?.slug}
                isLast={project.slug === last?.slug}
                {...project}
                image={image}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

const NoScriptFallback = memo(
  ({
    projects,
    images,
  }: {
    projects: Project[]
    images: Record<string, ImageProps>
  }) => (
    <>
      {projects.map((p) => (
        <ProjectView key={p.slug} project={p} responsiveImages={images} noJs />
      ))}
    </>
  ),
)

export default ProjectApp
