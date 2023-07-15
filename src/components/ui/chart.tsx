import { useContext, useState } from 'react'
import { useChainedEffect, useDynamicEffect } from '../../hooks'

import { ChartContext, YearsContext } from '../../stores'


export function Chart() {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [toggle, setToggle] = useState(false)


  useDynamicEffect(chartName, () => {
    if (localStorage.getItem(`${chartName}StoreFilled`) === 'true') {
      setToggle(!toggle)
    }
  })


  useChainedEffect(toggle, [chartName, firstYear, lastYear], () => {
    console.log(`${chartName} storage exists`)
  })


  return null
}