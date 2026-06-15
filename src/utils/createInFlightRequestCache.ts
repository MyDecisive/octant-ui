export function createInFlightRequestCache<T>() {
  const requests = new Map<string, Promise<T>>();

  return {
    run(key: string, request: () => Promise<T>) {
      const inFlightRequest = requests.get(key);
      if (inFlightRequest) {
        return inFlightRequest;
      }

      const nextRequest = request().finally(() => {
        requests.delete(key);
      });

      requests.set(key, nextRequest);
      return nextRequest;
    },
  };
}
