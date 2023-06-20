import { asyncInterval, composeAsync } from './util'

interface Callback {
  (...args: any[]): void
  _c?: Callback
}

class HtmlUpdateListener {
  private oldScripts: string[]
  private newScripts: string[]
  private timer: number
  private event: Record<string, Callback[]>
  constructor(timer?: number) {
    this.oldScripts = []
    this.newScripts = []
    this.event = {}
    this.timer = timer || 1000

    this.init()
  }
  private async init() {
    try {
      await this.run()
    } catch (error) {
      console.log(error)
    }
  }
  private parserScript(html: string) {
    if (!html) return []
    const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi)
    return html.match(reg)
  }
  private getHTML() {
    return fetch('/').then((res) => res.text())
  }
  private getScripts() {
    return composeAsync(this.parserScript, this.getHTML)()
  }
  private async run() {
    this.oldScripts = await this.getScripts()
    window['__BA_DU_UPDATER'] = asyncInterval(async () => {
      this.newScripts = await this.getScripts()
      this.compare()
    }, this.timer)
  }
  private compare() {
    const oldScriptStr = this.oldScripts.join('')
    const newScriptStr = this.newScripts.join('')
    const oldIndexMap: Record<string, string> = {}
    Array.prototype.forEach.call(oldScriptStr, (char, index) => {
      oldIndexMap[index] = char
    })
    let updatable = false
    for (let i = 0; i < newScriptStr.length; i++) {
      if (oldIndexMap[i] !== newScriptStr[i]) {
        updatable = true
        break
      }
    }
    if (updatable) {
      this.emit('update', {
        destroy: () => {
          this.offAll('update')
        }
      })
    }
  }
  public on(eventName: string, callback: () => void) {
    if (!this.event[eventName]) {
      this.event[eventName] = []
    }
    this.event[eventName].push(callback)
  }
  public off(eventName: string, callback: () => void) {
    const callbacks = this.event[eventName]
    if (callbacks) {
      const index = callbacks.findIndex((cb) => cb === callback || cb._c === callback)
      console.log(index)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  public once(eventName: string, callback: (...args: any[]) => void) {
    const Wrap = (...args: any[]) => {
      callback(...args)
      this.off(eventName, Wrap)
    }
    Wrap._c = callback
    this.on(eventName, Wrap)
  }
  public emit(eventName: string, ...args: any[]) {
    const callbacks = this.event[eventName]
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args))
    }
  }
  public offAll(eventName: string) {
    if (this.event[eventName]) {
      this.event[eventName].length = 0
    }
  }
}

export { HtmlUpdateListener }

export default HtmlUpdateListener
