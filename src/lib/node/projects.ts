import type { ProjectConnectionQuery } from '@tina/__generated__/types'
import type { ProjectData } from '@lib/projects'
import type { ImageData } from './images'
import { client } from '@tina/__generated__/client'
import { isNotEmpty } from '@lib/utils'

export const getProjectImageData = ({
  image,
  media,
  title,
}: ProjectData): ImageData => ({
  path: image,
  sizes:
    media === 'page' // projects with this media type display a larger image
      ? '(min-width: 2000px) 25vw, (min-width: 1000px) 455px, (min-width: 800px) 355px, (min-width: 600px) 540px, 100vw'
      : '(min-width: 2000px) 18vw, (min-width: 1000px) 285px, (min-width: 600px) 318px, 89vw',
  alt: title,
})

export const getProjectsImageData = ({
  projectConnection,
}: ProjectConnectionQuery): ImageData[] =>
  projectConnection.edges
    ?.map((c) => c?.node)
    .filter(isNotEmpty)
    .map(getProjectImageData) || []

export const getAllProjectsImageData = async (
  after?: string,
): Promise<ImageData[]> => {
  let query = await client.queries.projectConnection({ after })
  let { pageInfo } = query.data.projectConnection
  const images = getProjectsImageData(query.data)
  if (pageInfo.hasNextPage) {
    const nextImages = await getAllProjectsImageData(pageInfo.endCursor)
    images.push(...nextImages)
  }
  return images
}
