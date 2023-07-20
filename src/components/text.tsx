import cn from 'classnames'

import type { TextProps } from '../lib/interfaces'


export function Text({
  children,
  tag: Tag = 'p',
  withColor = 'dark',
  withSize = 'regular'}: TextProps) {
  
  const className = cn({
    [`${withColor}-color`]: withColor,
    [`${withSize}-font-size`]: withSize
  })  

  return (
    <Tag className={className}>
      { children }
    </Tag>
  )  
}
