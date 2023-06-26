// React Fiber стремится обновлять компонент с частотой 60 FPS.
// Код внутри useEffect рассчитывает максимальное количество точек (batchSize),
// которое возможно отрисовать за 16.7 мс (TARGET_TIME), т.е. как раз для частоты 60 FPS.
// Для планирования обновлений используется requestAnimationFrame.


import { useEffect, useRef, useState } from 'react'

import style from './canvas.module.css'


type CanvasProps = { points: number[] | undefined }


const TARGET_TIME = 16.7


export function Canvas({ points }: CanvasProps) {
  const [graph, setGraph] = useState<number[]>()
  
  const batchSizeRef = useRef(365)
  const firstIndexRef = useRef(0)
  const lastIndexRef = useRef<number>()


  useEffect(() => {
    let animFrameID: number

    if (points) {
      const animate = () => {
        const start = performance.now()
        setGraph(points.slice(firstIndexRef.current, lastIndexRef.current))
        const end = performance.now()

        const renderTime = end - start

        renderTime < TARGET_TIME && (batchSizeRef.current = Math.min(batchSizeRef.current * 2, points.length))
        renderTime > TARGET_TIME && (batchSizeRef.current = Math.max(batchSizeRef.current / 2, points.length))

        lastIndexRef.current = batchSizeRef.current

        if (lastIndexRef.current < points.length) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
    
    return () => cancelAnimationFrame(animFrameID)
  }, [points])


  const canvasRef = useRef<HTMLCanvasElement | null>(null)


  useEffect(() => {
    const node = canvasRef.current;

    if (node && graph) {
      const ctx = node.getContext('2d')

      if (ctx) {
        ctx.clearRect(0, 0, node.width, node.height)

        const width = node.width
        const height = node.height

        const stepX = width / graph.length

        const minValue = Math.min(...graph)
        const maxValue = Math.max(...graph)

        const scaleY = height / (maxValue - minValue)

        ctx.beginPath();
        ctx.moveTo(0, (graph[0] - minValue) * scaleY)

        for (let i = 1; i < graph.length; i++) {
          const x = i * stepX
          const y = (graph[i] - minValue) * scaleY

          ctx.lineTo(x, y)
        }

        ctx.stroke()
      }
    }
  }, [graph])


  return (
    <canvas className={style.canvas} ref={canvasRef} />
  )
}
