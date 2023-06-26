type ItemProps = {
  t: string,
  v: number
}

interface ChartDataProps {
  precipitation: null | ItemProps[],
  temperature: null | ItemProps[],
}


export type { ChartDataProps, ItemProps }