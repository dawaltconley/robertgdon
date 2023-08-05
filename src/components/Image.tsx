import type { ComponentPropsWithoutRef, Ref } from 'react'
import type { ImageMetadata } from '@dawaltconley/responsive-images'

export interface ImageProps
  extends ImageMetadata,
    ComponentPropsWithoutRef<'picture'> {
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
  const smallest = metaValues[0][0]
  const biggest = metaValues[0][metaValues[0].length - 1]

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
