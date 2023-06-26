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
  
  const batchSizeRef = useRef(100)
  const firstIndexRef = useRef(0)
  const lastIndexRef = useRef(batchSizeRef.current)


  useEffect(() => {
    let animFrameID: number


    if (points) {
      const animate = () => {
        setGraph(points.slice(firstIndexRef.current, lastIndexRef.current))
  
        if (lastIndexRef.current < points.length) {
          animFrameID = requestAnimationFrame(animate)
        }
      }


      const getRenderTime = () => {
        let batchSize = batchSizeRef.current
        let lastIndex = firstIndexRef.current + batchSize

        const start = performance.now()

        while (lastIndex <= points.length) {
          setGraph(points.slice(firstIndexRef.current, lastIndex))

          const end = performance.now()
          const renderTime = end - start
  
          if (renderTime >= TARGET_TIME) {
            break
          }
  
          batchSize *= 2
          lastIndex = firstIndexRef.current + batchSize
        }
  
        batchSizeRef.current = Math.floor(batchSize / 2)
        lastIndexRef.current = firstIndexRef.current + batchSizeRef.current
      }


      getRenderTime()
      animate()
    }


    return () => cancelAnimationFrame(animFrameID)
  }, [firstIndexRef.current, lastIndexRef.current, points])


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
