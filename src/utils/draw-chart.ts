export function drawChart(node: HTMLCanvasElement | null, points: number[]) {
  if (node) {
    const ctx = node.getContext('2d')

    if (ctx) {
      ctx.clearRect(0, 0, node.width, node.height)

      const width = node.width
      const height = node.height

      const stepX = width / points.length

      const minValue = Math.min(...points)
      const maxValue = Math.max(...points)

      const scaleY = height / (maxValue - minValue)

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