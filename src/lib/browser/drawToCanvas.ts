import { canvasRGBA } from 'stackblur-canvas'
import { drawImageProp } from './drawImageProp'

export const drawToCanvas = (
  canvas: HTMLCanvasElement,
  body: HTMLElement,
  content: HTMLElement,
  image: HTMLImageElement,
) => {
  var ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('bad canvas context')
  var w = body.clientWidth
  var h = content.scrollHeight
  canvas.width = w
  canvas.height = h
  drawImageProp(ctx, image, 0, 0, w, h)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.fillRect(0, 0, w, h)
  canvasRGBA(canvas, 0, 0, w, h, 100) // requires modified function; takes canvas object, not canvas id
}
