import type { SiteQuery } from '@tina/__generated__/types'

export type ProjectData = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<SiteQuery['site']['projects']>[number]
      >['projects']
    >[number]
  >['project']
>

export const ProjectType = [
  'bandcamp',
  'soundcloud',
  'youtube',
  'vimeo',
  'page',
] as const

export type ProjectType = (typeof ProjectType)[number]

export const isProjectType = (s: string): s is ProjectType =>
  ProjectType.includes(s as ProjectType)
