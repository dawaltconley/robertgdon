import type { ComponentPropsWithoutRef, Ref } from 'react'
import type { Metadata, MetadataEntry } from '11ty__eleventy-img'

export interface ImageProps extends ComponentPropsWithoutRef<'picture'> {
  metadata: Metadata
  alt: string
  sizes?: string
  pictureRef?: Ref<HTMLPictureElement>
  imgRef?: Ref<HTMLImageElement>
  imgProps?: ComponentPropsWithoutRef<'img'>
}

export default function Image({
  metadata,
  alt,
  sizes,
  pictureRef,
  imgRef,
  imgProps = {},
  ...picture
}: ImageProps) {
  const metaValues = Object.values(metadata)
  const smallest: MetadataEntry = metaValues[0][0]
  const biggest: MetadataEntry = metaValues[0][metaValues[0].length - 1]

  return (
    <picture ref={pictureRef} {...picture}>
      {metaValues.map((imageFormat) => (
        <source
          key={imageFormat[0].sourceType}
          type={imageFormat[0].sourceType}
          srcSet={imageFormat.map((img) => img.srcset).join(', ')}
          sizes={sizes}
        />
      ))}
      <img
        ref={imgRef}
        src={smallest.url}
        width={biggest.width}
        height={biggest.height}
        alt={alt}
        loading="lazy"
        decoding="async"
        {...imgProps}
      />
    </picture>
  )
}
