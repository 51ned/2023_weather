import cn from 'classnames'

import { HeadingProps } from '../lib/interfaces'


export function Heading({
  children,
  level,
  withColor,
  withSize}: HeadingProps) {
    
  const Tag: keyof JSX.IntrinsicElements = `h${level}`
  
  const className = cn({
    [`${withSize}-font-size`]: withSize,
    [`${withColor}-color`]: withColor
  })

  return (
    <Tag className={className}>
      { children }
    </Tag>
  )
}
