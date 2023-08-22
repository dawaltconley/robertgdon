import type { ImageMetadata } from '@dawaltconley/responsive-images'
import path from 'node:path'
import imageConfig from './image-config'

export interface ImageData {
  path: string
  sizes?: string
  alt?: string
}

export type ResponsiveImageData = Record<string, ImageMetadata>

const processImageData = async ({
  path: image,
  sizes,
  alt = '',
}: ImageData): Promise<ImageMetadata> => {
  const imagePath = import.meta.env.PROD
    ? image
    : path.resolve('./public', `.${image}`)
  return imageConfig.metadataFromSizes(imagePath, {
    sizes,
    alt,
  })
}

export const makeResponsive = async (
  images: ImageData[],
): Promise<ResponsiveImageData> =>
  Object.fromEntries(
    await Promise.all(
      images.map((i) => Promise.all([i.path, processImageData(i)])),
    ),
  )
