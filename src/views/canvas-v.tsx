import { useEffect, useRef } from 'react'

import { selectStore } from '../stores'

import style from './canvas.module.css'


type CanvasProps = {
  points: number[]
}


export function Canvas({ points }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const years = selectStore.years

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas && points) {
      canvas.height = window.innerHeight - 104 // Нельзя взять и обойтись без костыля. :(
      canvas.width = window.innerWidth

      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const stepX = canvas.width / points.length

        const maxValue = Math.max(...points)
        const minValue = Math.min(...points)

        const scaleY = -canvas.height / (maxValue - minValue)

        ctx.beginPath()
        ctx.moveTo(0, canvas.height + (points[0] - minValue) * scaleY)

        let i = 1

        while (i < points.length) {
          ctx.lineTo(i * stepX, canvas.height + (points[i] - minValue) * scaleY)
          i++
        }

        ctx.lineWidth = 2
        ctx.stroke()

        
        const verticalLinesCount = years.length 
        const verticalLineInterval = canvas.width / verticalLinesCount

        ctx.beginPath()

        for (let x = 0; x <= canvas.width; x += verticalLineInterval) {
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
        }

        ctx.lineWidth = 1
        ctx.strokeStyle = 'hsl(99, 30%, 68%)'
        ctx.stroke()
      }
    }
  }, [points])

  return (
    <canvas className={style.canvas} ref={canvasRef} />
  )
}
