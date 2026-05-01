import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerPhase = 'normal' | 'warning' | 'danger'

export interface UseCheckpointTimerResult {
  remaining : number
  phase     : TimerPhase
  pct       : number
  reset     : (seconds?: number) => void
  pause     : () => void
  resume    : () => void
}

export function useCheckpointTimer(
  initialSeconds: number,
  onExpire?: () => void,
): UseCheckpointTimerResult {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [paused,    setPaused]    = useState(false)

  const initialRef = useRef(initialSeconds)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const reset = useCallback((seconds?: number) => {
    const s = seconds ?? initialRef.current
    initialRef.current = s
    setRemaining(s)
    setPaused(false)
  }, [])

  const pause  = useCallback(() => setPaused(true),  [])
  const resume = useCallback(() => setPaused(false), [])

  useEffect(() => {
    if (paused || remaining <= 0) return

    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id)
          onExpireRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [paused, remaining])

  const phase: TimerPhase =
    remaining <= 10  ? 'danger' :
    remaining <= 30  ? 'warning' :
    'normal'

  const pct = Math.round((remaining / initialRef.current) * 100)

  return { remaining, phase, pct, reset, pause, resume }
}
