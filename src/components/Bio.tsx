import type { SiteQuery } from '@tina/__generated__/types'
import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import Image, { ImageProps } from './Image'
import '../styles/_bio.scss'

interface BioProps {
  site: Parameters<typeof useTina<SiteQuery>>[0]
  responsiveImages?: Record<string, ImageProps>
}

const Bio = ({ site, responsiveImages = {} }: BioProps) => {
  const { title, bio, image } = useTina<SiteQuery>(site).data.site.about
  const responsive = responsiveImages[image]

  return (
    <div id="bio" className="bio container mx-auto my-lg flex">
      <div className="mb-md max-w-prose">
        <h2 className="border-b-2 border-b-neutral-800 pb-xs font-caps text-[2em] uppercase">
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
        />
      ) : (
        <div className="headshot-container relative ml-md">
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
