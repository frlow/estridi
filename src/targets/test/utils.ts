export const partialHandles = <T extends Object>(handles: Partial<T>): T => new Proxy(handles, {
  get(target, name: string) {
    if (target[name]) return target[name]
    if (name.startsWith('serviceCall')) return async () => {
    }
    throw `${name} is not implemented!`
  }
}) as T

export class CallHandler {
  private calls: Record<string, any[]> = {}
  private waitingCalls: { url: string; resolver: (data: any) => void }[] = []

  public waitForCall: (url: string) => Promise<any> = async (url) => {
    if (this.calls[url])
      return this.calls[url].splice(this.calls[url].length - 1, 1)[0]
    return new Promise((resolve) =>
      this.waitingCalls.push({ url, resolver: resolve })
    )
  }

  public handleCall: (url: string, data: any) => void = (url, data) => {
    this.calls[url] = [...(this.calls[url] || []), data]
    const waitingCallsForUrl = this.waitingCalls.filter(
      (call) => call.url === url
    )
    this.waitingCalls = this.waitingCalls.filter((call) => call.url !== url)
    waitingCallsForUrl.forEach((waitingCall) => waitingCall.resolver(data))
  }
}
