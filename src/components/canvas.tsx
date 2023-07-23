import { useEffect, useRef } from 'react'

import style from './canvas.module.css'


type CanvasProps = {
  points: number[]
}


export function Canvas({points}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)


  useEffect(() => {
    const node = canvasRef.current

    if (node && points) {
      const ctx = node.getContext('2d')

      if (ctx) {
        ctx.clearRect(0, 0, node.width, node.height)

        const height = node.height
        const width = node.width

        const stepX = width / points.length

        const maxValue = Math.max(...points)
        const minValue = Math.min(...points)

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
  }, [points])


  return (
    <canvas
      className={style.canvas}
      ref={canvasRef}
      width={window.innerWidth}
    />  
  )
}

