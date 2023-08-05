import type { SiteQuery } from '@tina/__generated__/types'
import { useTina, tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import Image, { ImageProps } from './Image'
import '../styles/_bio.scss'

interface BioProps {
  site: Parameters<typeof useTina<SiteQuery>>[0]
  responsiveImages?: Record<string, ImageProps>
}

const Bio = ({ site, responsiveImages = {} }: BioProps) => {
  const { data } = useTina<SiteQuery>(site)
  const { title, bio, image } = data.site.about
  const responsive = responsiveImages[image]

  return (
    <div id="bio" className="container mx-auto my-lg laptop:flex">
      <div
        className="mb-md max-w-prose"
        data-tina-field={tinaField(data.site.about, 'bio')}
      >
        <h2
          className="border-b-2 border-b-neutral-800 pb-xs font-caps text-[2em] uppercase"
          data-tina-field={tinaField(data.site.about, 'title')}
        >
          {title}
        </h2>

        <TinaMarkdown content={bio} />
      </div>

      {responsive ? (
        <Image
          {...responsive}
          className="headshot-container relative ml-md"
          imgProps={{
            className: 'laptop:absolute inset-0 w-full h-full object-fit-rob',
          }}
          data-tina-field={tinaField(data.site.about, 'image')}
        />
      ) : (
        <div
          className="headshot-container relative ml-md"
          data-tina-field={tinaField(data.site.about, 'image')}
        >
          <img
            src={image}
            className="object-fit-rob inset-0 h-full w-full laptop:absolute"
            alt="headshot photo"
          />
        </div>
      )}
    </div>
  )
}

export default Bio
