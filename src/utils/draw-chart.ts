export function createChartDrawer(node: HTMLCanvasElement | null) {
  let ctx: CanvasRenderingContext2D | null = null
  let height = 0
  let maxValue = 0
  let minValue = 0
  let scaleY = 0
  let width = 0
  

  if (node) {
    ctx = node.getContext('2d')
    height = node.height
    width = node.width
  }

  return function drawChart(points: number[]) {
    if (ctx && points.length > 0) {
      ctx.clearRect(0, 0, width, height)

      const stepX = width / points.length

      minValue = Math.min(...points)
      maxValue = Math.max(...points)

      scaleY = height / (maxValue - minValue)

      ctx.beginPath()
      ctx.moveTo(0, (points[0] - minValue) * scaleY)

      for (let i = 1; i < points.length; i++) {
        const x = i * stepX
        const y = (points[i] - minValue) * scaleY

        ctx.lineTo(x, y)
      }

      ctx.stroke()
    }
  }
}
