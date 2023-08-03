import ProjectButton from './ProjectButton'

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

interface ProjectGridProps {
  projects: Project[]
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  return (
    <div className="contains-3d-deep grid grid-cols-2 gap-xs mobile:grid-cols-3 laptop:grid-cols-4 large:grid-cols-5">
      {projects.map((p) => (
        <ProjectButton {...p} />
      ))}
    </div>
  )
}

export default ProjectGrid
