export default class Timer {
  _start: Record<string, ReturnType<typeof performance.now>> = {};

  start(name: string) {
    this._start[name] = performance.now();
  }

  end(name: string) {
    if (!this._start[name]) {
      return 0
    }
    const time = performance.now() - this._start[name];
    delete this._start[name];
    return time;
  }
}