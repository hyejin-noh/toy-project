type Listener = () => void;

export type LocalStore<T> = {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: Listener) => () => void;
  set: (value: T) => void;
};

/**
 * localStorage처럼 React 밖에 있는 값을 useSyncExternalStore로 구독할 수 있게 만든다.
 * 새로고침이나 다른 탭에서의 변경(storage 이벤트)도 반영한다.
 */
export function createLocalStore<T>(key: string, defaultValue: T): LocalStore<T> {
  let cache: T = defaultValue;
  let loaded = false;
  const listeners = new Set<Listener>();

  function readFromStorage(): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  function getSnapshot(): T {
    if (!loaded) {
      cache = readFromStorage();
      loaded = true;
    }
    return cache;
  }

  function getServerSnapshot(): T {
    return defaultValue;
  }

  function notify(): void {
    for (const listener of listeners) listener();
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);

    function handleStorageEvent(event: StorageEvent) {
      if (event.key !== key) return;
      cache = readFromStorage();
      loaded = true;
      listener();
    }

    window.addEventListener("storage", handleStorageEvent);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }

  function set(value: T): void {
    cache = value;
    loaded = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장 공간이 없거나 접근이 막힌 경우, 화면 동작은 막지 않고 조용히 넘어간다.
    }
    notify();
  }

  return { getSnapshot, getServerSnapshot, subscribe, set };
}
