// React Fiber стремится обновлять компонент с частотой 60 FPS.
// Код внутри useEffect рассчитывает максимальное количество точек (batchSize),
// которое возможно отрисовать за 16.7 мс (TARGET_TIME), т.е. как раз для частоты 60 FPS.
// Для планирования обновлений используется requestAnimationFrame.


import { useContext, useEffect, useRef, useState } from 'react'

import { WeatherContext } from '../../stores/context'

import style from './canvas.module.css'


type CanvasProps = { points: number[] | undefined }


const TARGET_TIME = 16.7

const BATCH_SIZE = 365
const FIRST_INDEX = 0


export function Canvas({ points }: CanvasProps) {
  const { globalState } = useContext(WeatherContext)
  const { chartType } = globalState

  const [graph, setGraph] = useState<number[]>()
  
  const batchSizeRef = useRef(BATCH_SIZE)
  const firstIndexRef = useRef<number | undefined>(FIRST_INDEX)
  const lastIndexRef = useRef<number>()


  useEffect(() => {
    batchSizeRef.current = 365
    firstIndexRef.current = 0
    lastIndexRef.current = undefined
  }, [points?.length, chartType])


  useEffect(() => {
    let animFrameID: number

    if (points) {
      const animate = () => {
        const currentFirstIndex = firstIndexRef.current
        const currentLastIndex = lastIndexRef.current

        const start = performance.now()
        setGraph(points.slice(currentFirstIndex, currentLastIndex))
        const end = performance.now()
  
        const renderTime = end - start
  
        renderTime < TARGET_TIME && (batchSizeRef.current = Math.min(batchSizeRef.current * 2, points.length))
        renderTime > TARGET_TIME && (batchSizeRef.current = Math.max(batchSizeRef.current / 2, points.length))
  
        firstIndexRef.current = currentLastIndex
        lastIndexRef.current = batchSizeRef.current
        
        console.log(`last index: ${lastIndexRef.current}`)
        console.log(`batch size: ${batchSizeRef.current}`)
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
