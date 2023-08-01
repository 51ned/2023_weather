import { useEffect, useRef } from 'react'

import style from './canvas.module.css'


type CanvasProps = {
  points: number[]
}


export function Canvas({ points }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
console.log(points)
  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas && points) {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth

      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.clearRect(0, 0, canvas.height, canvas.width)

        const stepX = canvas.width / points.length

        const maxValue = Math.max(...points)
        const minValue = Math.min(...points)

        const scaleY = canvas.height / (maxValue - minValue)

        ctx.beginPath()
        ctx.moveTo(0, (points[0] - minValue) * scaleY)

        let i = 1

        while (i < points.length) {
          ctx.lineTo(i * stepX, (points[i] - minValue) * scaleY)
          i++
        }

        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
  }, [points])


  return (
    <div className={style.frame}>
      <canvas className={style.canvas} ref={canvasRef} />
    </div>
  )
}