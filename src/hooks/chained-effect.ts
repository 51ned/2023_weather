import { useEffect, useRef } from 'react'


export function useChainedEffect(toggle: boolean, deps: string[], callback: () => void) {
  const trigger = useRef<string | null>(null)

  useEffect(() => {
    trigger.current = 'hit me in the streets'
  }, [toggle])

  useEffect(() => {
    if (trigger.current) {
      callback()
    }
  }, [...deps])

  return () => trigger.current = null
}