import { useEffect, useRef } from 'react'


export function useDynamicEffect(deps: string, callback: () => void) {
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      callback()
    }
  }, [])

  useEffect(() => {
    !isFirstMount.current && callback()
  }, [deps])
}
