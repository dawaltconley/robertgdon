import Image, { type ImageProps } from './Image'
import classNames from 'classnames'

interface ProjectButtonProps {
  slug: string
  title: string
  image: string | ImageProps
  handleClick: (slug: string | null) => void
  isActive?: boolean
  isLast?: boolean
}

const ProjectButton = ({
  slug,
  title,
  image,
  handleClick,
  isActive,
  isLast,
}: ProjectButtonProps) => {
  return (
    <a
      href={`#${slug}`}
      className={classNames('group delay-500 duration-500', {
        'flip-x': isActive,
        'preserve-3d': isActive || isLast,
      })}
      onClick={(e) => {
        e.preventDefault()
        handleClick(isActive ? null : slug)
      }}
      data-project-button
      data-analytics-category="Navigation"
      data-analytics-action="click"
      data-analytics-label="Opened {{ project_title_2 }} project"
    >
      <div
        className="layer-children relative aspect-square text-white delay-500 duration-500"
        data-project-button-content
      >
        {typeof image === 'string' ? (
          <div className="no-backface overflow-hidden">
            <img
              className="h-full w-full overflow-hidden object-cover duration-300 group-hover:blur-sm"
              src={image}
              alt={title}
            />
          </div>
        ) : (
          <Image
            {...image}
            className="no-backface overflow-hidden"
            imgProps={{
              className:
                'h-full w-full overflow-hidden object-cover duration-300 group-hover:blur-sm',
            }}
          />
        )}
        <div className="no-backface flex flex-col bg-neutral-900/75 p-xs text-center opacity-0 duration-300 group-hover:opacity-100">
          <span className="m-auto">{title}</span>
        </div>
        <div className="flip-x no-backface overlay-after flex flex-col bg-neutral-900 p-xs text-center duration-300 after:bg-transparent group-hover:after:bg-neutral-100/10">
          <span className="no-backface m-auto">Close</span>
        </div>
      </div>
    </a>
  )
}

export default ProjectButton
