import { describe, it, expect, vi } from "vitest";
import { createInFlightRequestCache } from "../createInFlightRequestCache";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("createInFlightRequestCache", () => {
  it("calls the request function for a new key", async () => {
    const cache = createInFlightRequestCache<string>();
    const request = vi.fn().mockResolvedValue("result");

    const result = await cache.run("key-1", request);

    expect(request).toHaveBeenCalledTimes(1);
    expect(result).toBe("result");
  });

  it("returns the same promise for concurrent calls with the same key", () => {
    const cache = createInFlightRequestCache<string>();
    const deferred = createDeferred<string>();
    const request = vi.fn().mockReturnValue(deferred.promise);

    const promise1 = cache.run("key-1", request);
    const promise2 = cache.run("key-1", request);

    expect(promise1).toBe(promise2);
    expect(request).toHaveBeenCalledTimes(1);

    deferred.resolve("done");
  });

  it("resolves all callers with the same value", async () => {
    const cache = createInFlightRequestCache<string>();
    const deferred = createDeferred<string>();
    const request = vi.fn().mockReturnValue(deferred.promise);

    const promise1 = cache.run("key-1", request);
    const promise2 = cache.run("key-1", request);

    deferred.resolve("shared-result");

    await expect(promise1).resolves.toBe("shared-result");
    await expect(promise2).resolves.toBe("shared-result");
  });

  it("calls the request function independently for different keys", async () => {
    const cache = createInFlightRequestCache<string>();
    const requestA = vi.fn().mockResolvedValue("a-result");
    const requestB = vi.fn().mockResolvedValue("b-result");

    const [resultA, resultB] = await Promise.all([
      cache.run("key-a", requestA),
      cache.run("key-b", requestB),
    ]);

    expect(requestA).toHaveBeenCalledTimes(1);
    expect(requestB).toHaveBeenCalledTimes(1);
    expect(resultA).toBe("a-result");
    expect(resultB).toBe("b-result");
  });

  it("removes the key from the cache after the request resolves", async () => {
    const cache = createInFlightRequestCache<string>();
    const request = vi.fn().mockResolvedValue("result");

    await cache.run("key-1", request);
    await cache.run("key-1", request);

    expect(request).toHaveBeenCalledTimes(2);
  });

  it("removes the key from the cache after the request rejects", async () => {
    const cache = createInFlightRequestCache<string>();
    const error = new Error("request failed");
    const request = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce("recovered");

    await expect(cache.run("key-1", request)).rejects.toBe(error);
    const secondResult = await cache.run("key-1", request);

    expect(request).toHaveBeenCalledTimes(2);
    expect(secondResult).toBe("recovered");
  });

  it("propagates rejection to all concurrent callers with the same key", async () => {
    const cache = createInFlightRequestCache<string>();
    const deferred = createDeferred<string>();
    const request = vi.fn().mockReturnValue(deferred.promise);
    const error = new Error("shared failure");

    const promise1 = cache.run("key-1", request);
    const promise2 = cache.run("key-1", request);

    deferred.reject(error);

    await expect(promise1).rejects.toBe(error);
    await expect(promise2).rejects.toBe(error);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("triggers a new request for the same key once the in-flight request has settled", async () => {
    const cache = createInFlightRequestCache<string>();
    const request = vi
      .fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");

    const result1 = await cache.run("key-1", request);
    const result2 = await cache.run("key-1", request);

    expect(result1).toBe("first");
    expect(result2).toBe("second");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("does not call the request function again while it is still in flight, even after a microtask tick", async () => {
    const cache = createInFlightRequestCache<string>();
    const deferred = createDeferred<string>();
    const request = vi.fn().mockReturnValue(deferred.promise);

    void cache.run("key-1", request);
    await Promise.resolve(); // let a microtask tick pass
    void cache.run("key-1", request);

    expect(request).toHaveBeenCalledTimes(1);

    deferred.resolve("done");
    await deferred.promise;
  });
});
