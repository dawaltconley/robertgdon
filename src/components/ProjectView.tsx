import type { Project } from './ProjectGrid'
import ProjectEmbed from './ProjectEmbed'
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
