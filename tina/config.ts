import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
// const branch =
//   import.meta.env.HEAD || import.meta.env.VERCEL_GIT_COMMIT_REF || 'main'
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

export default defineConfig({
  branch,
  clientId: '***REMOVED***', // Get this from tina.io
  token: null, // Get this from tina.io

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
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
            type: 'boolean',
            label: 'Published',
            name: 'published',
          },
          {
            type: 'rich-text',
            label: 'Body',
            name: 'body',
            isBody: true,
          },
        ],
      },
    ],
  },
})
