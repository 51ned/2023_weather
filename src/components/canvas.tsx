import { forwardRef } from 'react'

import style from './canvas.module.css'


export const Canvas = forwardRef((props, ref) => {
  return (
    <canvas
      className={style.canvas}
      ref={ref as React.RefObject<HTMLCanvasElement>}
      width={window.innerWidth}
    />
  )
})
