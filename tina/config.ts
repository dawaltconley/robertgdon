import { defineConfig } from 'tinacms'

const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

export default defineConfig({
  branch,
  clientId: '***REMOVED***', // Get this from tina.io
  token: '***REMOVED***', // Get this from tina.io

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
            required: true,
          },
          {
            type: 'string',
            label: 'Media',
            name: 'media',
            required: true,
            options: [
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
            ],
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
          },
          {
            type: 'boolean',
            label: 'Published',
            name: 'published',
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
        },
        fields: [
          {
            type: 'string',
            label: 'Site Title',
            name: 'title',
          },
          {
            type: 'string',
            label: 'Site Description',
            name: 'description',
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
                required: true,
                ui: {
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
                    required: true,
                    collections: ['project'],
                  },
                ],
              },
            ],
          },
          {
            type: 'rich-text',
            label: 'Bio',
            name: 'bio',
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
