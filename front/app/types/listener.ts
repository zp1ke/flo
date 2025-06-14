type ListenerEvent<T> = {
  type: 'fetched' | 'added' | 'updated' | 'deleted';
  data: T;
};

type Listener<T> = {
  id: string;
  handler: (event: ListenerEvent<T>) => void;
};

export class ListenerManager<T> {
  private listeners: Map<string, Listener<T>> = new Map();

  addListener(id: string, handler: (event: ListenerEvent<T>) => void): void {
    this.listeners.set(id, { id, handler });
  }

  removeListener(id: string): void {
    if (this.listeners.has(id)) {
      this.listeners.delete(id);
    }
  }

  notify(event: ListenerEvent<T>): void {
    for (const listener of this.listeners.values()) {
      listener.handler(event);
    }
  }
}
