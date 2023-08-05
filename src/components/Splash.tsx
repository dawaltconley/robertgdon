import type { SiteQuery } from '@tina/__generated__/types'
import { useTina } from 'tinacms/dist/react'
import '../styles/_splash.scss'

interface SplashProps {
  site: Parameters<typeof useTina<SiteQuery>>[0]
}

const Splash = ({ site }: SplashProps) => {
  const { title, description } = useTina(site).data.site
  return (
    <a
      href="/"
      className="full-shadow radial-shadow no-select m-auto text-center"
    >
      <h1 className="title m-0 border-b-2 border-white">{title}</h1>
      <p className="subtitle font-caps uppercase">{description}</p>
    </a>
  )
}

export default Splash
