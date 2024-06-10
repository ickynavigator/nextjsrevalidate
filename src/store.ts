class Sink {
  STORAGE_KEY = 'kitchen-sink';
  KEYS = {
    fetchDelay: 'fetchDelay',
  } as const;

  getStoredValue(key: keyof typeof Sink.prototype.KEYS, defaultValue: unknown) {
    try {
      const storage = window.sessionStorage.getItem(this.STORAGE_KEY);
      if (!storage) return defaultValue;
      return JSON.parse(storage)?.[key] || defaultValue;
    } catch (err) {
      return defaultValue;
    }
  }

  fetchDelay() {
    return Number(this.getStoredValue(this.KEYS.fetchDelay, 0));
  }
}

class Store {
  sink = new Sink();

  async delay() {
    await new Promise(resolve => setTimeout(resolve, this.sink.fetchDelay()));
  }
}

const store = new Store();

export default store;
