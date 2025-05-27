export class ListenerHandler<T> {
  private listeners: ((data: T) => void)[] = [];

  add: (callback: (data: T) => void) => void = (callback) => {
    this.listeners.push(callback);
  };

  trigger: (data: T) => void = (data) => {
    this.listeners.forEach((listener) => listener(data));
  };
}
