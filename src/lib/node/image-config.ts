import type { Value as SassValue, LegacyValue, LegacyAsyncFunction } from 'sass'
import { ResponsiveImages } from '@dawaltconley/responsive-images'
import * as modern from 'sass-cast'
import * as legacy from 'sass-cast/legacy'

const cfg = new ResponsiveImages({
  scalingFactor: 0.5,
  defaults: {
    formats: ['webp', null],
    outputDir: './dist/_responsive-images/',
    urlPath: import.meta.env.PROD
      ? '/_responsive-images/'
      : '/dist/_responsive-images/',
  },
  disable: !import.meta.env.PROD,
})

const legacyToModern = (value: LegacyValue): SassValue =>
  modern.toSass(legacy.fromSass(value))

const modernToLegacy = (value: SassValue): LegacyValue =>
  legacy.toSass(modern.fromSass(value))

export const sassLegacyFunctions = Object.entries(cfg.sassFunctions).reduce<
  Record<string, LegacyAsyncFunction>
>(
  (fn, [name, modernFn]) => ({
    ...fn,
    [name]: (...args: any[]): void => {
      const done = args.pop()
      Promise.resolve(modernFn(args.map(legacyToModern))).then(done)
    },
  }),
  {},
)

export default cfg
