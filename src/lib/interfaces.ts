type HeaderLevelEnum = '1' | '2' | '3'

type TextColorEnum = 'dark' | 'light'
type TextSizeEnum = 'smallest' | 'regular'

type ItemProps = {
  t: string,
  v: number
}


interface TextProps {
  children: React.ReactNode,
  id?: string;
  tag?: keyof JSX.IntrinsicElements,
  withColor?: TextColorEnum,
  withSize?: TextSizeEnum
}

interface HeadingProps {
  children: React.ReactNode,
  level: HeaderLevelEnum,
  withColor?: TextColorEnum,
  withSize?: TextSizeEnum
}


export type {
  HeaderLevelEnum,
  TextColorEnum,
  TextSizeEnum,
  ItemProps,
  TextProps,
  HeadingProps
}