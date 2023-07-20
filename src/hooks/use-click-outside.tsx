import { useEffect, RefObject } from 'react'


export function useClickOutside(ref: RefObject<HTMLElement>, callback: () => void) {
  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [ref, callback])
}
