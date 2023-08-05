import type { SiteQuery } from '@tina/__generated__/types'
import { useTina, tinaField } from 'tinacms/dist/react'
import '@styles/_splash.scss'

interface SplashProps {
  site: Parameters<typeof useTina<SiteQuery>>[0]
}

const Splash = ({ site }: SplashProps) => {
  const { data } = useTina(site)
  const { title, description } = data.site

  return (
    <a
      href="/"
      className="full-shadow radial-shadow no-select m-auto text-center"
    >
      <h1
        className="title m-0 border-b-2 border-white"
        data-tina-field={tinaField(data.site, 'title')}
      >
        {title}
      </h1>
      <p
        className="subtitle font-caps uppercase"
        data-tina-field={tinaField(data.site, 'description')}
      >
        {description}
      </p>
    </a>
  )
}

export default Splash
