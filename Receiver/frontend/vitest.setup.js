// Node >= 25 defines a `localStorage` global that is inert unless the process
// was started with `--localstorage-file`, and it shadows the Storage that jsdom
// installs. Vue devtools (pulled in by pinia outside of production builds)
// reads `localStorage` while it is being imported, which then throws. Give the
// tests a working in-memory Storage instead.
if (typeof globalThis.localStorage?.getItem !== 'function') {
  const entries = new Map()

  const storage = {
    getItem: (key) => (entries.has(String(key)) ? entries.get(String(key)) : null),
    setItem: (key, value) => void entries.set(String(key), String(value)),
    removeItem: (key) => void entries.delete(String(key)),
    clear: () => entries.clear(),
    key: (index) => [...entries.keys()][index] ?? null,
    get length() {
      return entries.size
    },
  }

  for (const target of [globalThis, globalThis.window]) {
    if (target) {
      Object.defineProperty(target, 'localStorage', {
        value: storage,
        configurable: true,
        writable: true,
      })
    }
  }
}
