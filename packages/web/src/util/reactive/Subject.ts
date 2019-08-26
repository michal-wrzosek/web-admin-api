export type Subscription = {
  unsubscribe: () => void;
};

export type Subscriber<T> = (value: T) => any;

export class Subject<T> {
  counter = 0;
  initialValue: T = null as any;
  value: T = null as any;
  subscribers: { [key: string]: Subscriber<T> } = {};
  constructor(value: T) {
    this.initialValue = value;
    this.value = value;
  }

  next = (nextValue: T) => {
    this.value = nextValue;
    Object.values(this.subscribers).forEach((subscriber: Subscriber<T>) => subscriber(nextValue));
  };

  subscribe = (fn: Subscriber<T>): Subscription => {
    const index = `${this.counter++}`;
    this.subscribers[index] = fn;
    return {
      unsubscribe: () => {
        delete this.subscribers[index];
      },
    };
  };

  destroy = () => {
    this.value = this.initialValue;
    this.subscribers = {};
  };

  getValue = () => this.value;
}
