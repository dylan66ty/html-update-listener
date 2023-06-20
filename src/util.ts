interface IntervalId {
  flag: boolean
  timer: number | undefined
}

export const asyncInterval = (callback: (...args: any[]) => void, wait: number, ...args: any[]) => {
  const intervalId: IntervalId = {
    flag: true,
    timer: undefined
  }
  const next = async () => {
    clearTimeout(intervalId.timer)
    if (!intervalId.flag) return
    try {
      await callback(...args)
    } catch (error) {
      console.log(error)
    }
    intervalId.timer = setTimeout(next, wait)
  }
  intervalId.timer = setTimeout(next, wait)
  return intervalId
}

export const composeAsync = (...fns: any[]) =>
  fns.reduce(
    (a, v) =>
      async (...args: any[]) =>
        a(await v(...args))
  )
