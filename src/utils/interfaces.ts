type ItemProps = {
  t: string,
  v: number
}

interface ChartDataProps {
  precipitation: number[] | null,
  temperature: number[] | null
}


export type { ChartDataProps, ItemProps }