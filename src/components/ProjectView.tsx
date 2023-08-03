import type { Project } from './ProjectApp'
import ProjectEmbed from './ProjectEmbed'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import classNames from 'classnames'

interface ProjectViewProps {
  project: Project
  noJs?: boolean
}

const ProjectView = ({ project, noJs }: ProjectViewProps) => {
  const hasColumns = project.type !== 'youtube' && project.type !== 'vimeo'
  const analytics = {
    'data-analytics-category': 'Audio',
    'data-analytics-action': 'click',
    'data-analytics-label': `Listened to ${project.title}`,
  }

  return (
    <div
      id={project.slug}
      className={classNames(
        'relative w-full duration-1000 overflow-hidden no-backface {{ bg_img }}',
        {
          'hidden target:block': noJs,
        },
      )}
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
        className={classNames('container z-20 mx-auto px-md py-lg', {
          'grid-cols-2 gap-md laptop:grid': hasColumns,
        })}
        data-project-content
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
