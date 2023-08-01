import style from './placeholder.module.css'


export function Placeholder() {
  return (
    <div className={style.wrap}>
      <p className={style.blink}>Chart is forming, please wait...</p>
    </div>
  )
}