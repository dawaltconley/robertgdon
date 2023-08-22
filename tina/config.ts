import type { Site } from './__generated__/types'
import { defineConfig } from 'tinacms'
import { ProjectType } from '../src/lib/projects'
import { isNotEmpty } from '../src/lib/utils'

const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

type MediaOption = {
  value: ProjectType
  label: string
}

const mediaOptions: MediaOption[] = [
  {
    value: 'bandcamp',
    label: 'Bandcamp',
  },
  {
    value: 'soundcloud',
    label: 'Soundcloud',
  },
  {
    value: 'youtube',
    label: 'YouTube',
  },
  {
    value: 'vimeo',
    label: 'Vimeo',
  },
  {
    value: 'page',
    label: 'Web Page',
  },
]

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_CONTENT_TOKEN,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'media',
      publicFolder: 'public',
    },
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
    },
  },
  schema: {
    collections: [
      {
        name: 'project',
        label: 'Projects',
        path: 'content/projects',
        fields: [
          {
            type: 'string',
            label: 'Title',
            name: 'title',
            isTitle: true,
            required: true,
          },
          {
            type: 'datetime',
            label: 'Date',
            name: 'date',
          },
          {
            type: 'string',
            label: 'Media',
            name: 'media',
            required: true,
            options: mediaOptions,
          },
          {
            type: 'string',
            label: 'Link',
            name: 'link',
            required: true,
            ui: {
              description:
                'Full url linking to the relevant vimeo or bandcamp page.',
              validate: (url: string) => {
                try {
                  new URL(url)
                } catch (e) {
                  return `${url} is not a valid URL.`
                }
              },
            },
          },
          {
            type: 'string',
            label: 'Track/Album Id',
            name: 'tralbum_id',
            ui: {
              description:
                'Bandcamp only. A number associated with the linked track or album.',
            },
          },
          {
            type: 'image',
            label: 'Image',
            name: 'image',
            required: true,
            ui: {
              description:
                'For best results, images should be at least 960px wide and cropped to a square. If uncropped, their aspect ratio should be no wider than 16/9.',
            },
          },
          {
            type: 'rich-text',
            label: 'Description',
            name: 'description',
            isBody: true,
            required: true,
          },
        ],
      },
      {
        name: 'site',
        label: 'Global',
        path: 'content/data',
        match: {
          include: 'site',
        },
        format: 'yml',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          router: async ({ document }) => {
            if (document._sys.filename === 'site') return '/'
            return undefined
          },
        },
        fields: [
          {
            type: 'string',
            label: 'Site Title',
            name: 'title',
            required: true,
          },
          {
            type: 'string',
            label: 'Site Description',
            name: 'description',
            required: true,
          },
          {
            type: 'string',
            label: 'Project Heading',
            name: 'project_heading',
            required: true,
          },
          {
            type: 'object',
            label: 'Project Order',
            name: 'projects',
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item.category ?? 'New Category',
              }),
            },
            fields: [
              {
                type: 'string',
                label: 'Category',
                name: 'category',
                required: true,
              },
              {
                type: 'object',
                label: 'Projects',
                name: 'projects',
                list: true,
                ui: {
                  description:
                    "Projects that belong to this category. Categories won't show up unless they have at least one project.",
                  itemProps: (item) => {
                    return {
                      label: item.project ?? 'Select Project',
                    }
                  },
                },
                fields: [
                  {
                    type: 'reference',
                    label: 'Project',
                    name: 'project',
                    collections: ['project'],
                    ui: {
                      validate: (_value: string, data: Site) => {
                        const allProjects = data.projects
                          ?.filter(isNotEmpty)
                          .map(
                            ({ projects, category }) =>
                              projects?.map(
                                (p) =>
                                  p && p.project && category + '__' + p.project,
                              ),
                          )
                          .flat()
                          .filter(isNotEmpty)
                        if (
                          allProjects &&
                          allProjects.some(
                            (p, i, projects) => projects.indexOf(p) !== i,
                          )
                        ) {
                          return 'This project has already been added to this category. All projects in a category must be unique.'
                        }
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            label: 'About',
            name: 'about',
            required: true,
            fields: [
              {
                type: 'string',
                label: 'Section Heading',
                name: 'title',
                isTitle: true,
                required: true,
              },
              {
                type: 'rich-text',
                label: 'Bio',
                name: 'bio',
                required: true,
              },
              {
                type: 'image',
                label: 'Headshot',
                name: 'image',
                required: true,
              },
            ],
          },
          {
            type: 'object',
            label: 'Contact Info',
            name: 'contact',
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item.icon,
              }),
            },
            fields: [
              {
                type: 'string',
                label: 'Icon',
                name: 'icon',
                required: true,
                options: [
                  {
                    label: 'Email',
                    value: 'email',
                  },
                  {
                    label: 'Phone',
                    value: 'phone',
                  },
                  {
                    label: 'LinkedIn',
                    value: 'linkedin',
                  },
                  {
                    label: 'Facebook',
                    value: 'facebook',
                  },
                  {
                    label: 'Instagram',
                    value: 'instagram',
                  },
                  {
                    label: 'Twitter',
                    value: 'twitter',
                  },
                  {
                    label: 'Google Plus',
                    value: 'google-plus',
                  },
                  {
                    label: 'Youtube',
                    value: 'youtube',
                  },
                  {
                    label: 'Vimeo',
                    value: 'vimeo',
                  },
                  {
                    label: 'Bandcamp',
                    value: 'bandcamp',
                  },
                ],
              },
              {
                type: 'string',
                label: 'Link',
                name: 'link',
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
})
