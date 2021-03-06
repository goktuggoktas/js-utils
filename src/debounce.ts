import { promiseTimeout } from "./promise-timeout";
import { OpenPromise } from './open-promise';

export type TDebounceFunction<T> = (...args: any[]) => (T | Promise<T>);

interface ICacheObject {
  timeout: Promise<any>;
  promise: OpenPromise;
}

export const DEFAULT_DEBOUNCE_TIME = 180;
const KEY_REFERENCES = new Map<Function, symbol>();
const CACHE = new Map<symbol, ICacheObject>();

export function debounceWithKey<T>(
  key: symbol,
  callback: TDebounceFunction<T>,
  time = DEFAULT_DEBOUNCE_TIME,
  thisObject: any = null,
  ...args: any[]
): Promise<T> {
  let timeout: Promise<any>;
  let promise: OpenPromise;

  if (CACHE.has(key)) {
    const stocked = CACHE.get(key);
    timeout = stocked.timeout;
    promise = stocked.promise;
    promiseTimeout.cancel(timeout);
  } else {
    promise = new OpenPromise();
  }

  timeout = promiseTimeout(time);
  CACHE.set(key, {promise, timeout});

  timeout
    .then(() => {
      CACHE.delete(key);
      const result = callback.call(thisObject, ...args);
      promise.bindPromise(result);
      return result;
    })
    .catch(err => {
      if (err !== promiseTimeout.TIMEOUT_CANCELLED) {
        promise.reject(err);
      }
    });

  return promise.promise;
}

/**
 * #### Debounces a function that delays invoking until after given time have elapsed since the last time the debounced function was invoked
 *
 * * * *
 * Example usage:
 * ```typescript
 * import { debounce } from "@gen-tech/js-utils";
 *
 * function foo() {
 *   console.log("hello");
 * }
 *
 * for (let i = 0; i < 5; i++) {
 *   debounce(foo);
 * }
 *
 * // logs "hello" only once
 * ```
 *
 * Static usage example:
 * ```typescript
 * import "@gen-tech/js-utils/dist/as-proto/debounce";
 *
 * function foo() {
 *   console.log("hello");
 * }
 *
 * for (let i = 0; i < 5; i++) {
 *   foo.debounce();
 * }
 *
 * // logs "hello" only once
 * ```
 * * * *
 * @param callback The function to execute only last of multiple execute requests by given time
 * @param [time = 180] Time for debouncing
 * @param [thisObject = null] This object to execute the callback function with
 * @param args Function arguments
 * @return A promise which resolves right after the debouncing sequence has been finished
 */
export function debounce<T>(
  callback: TDebounceFunction<T>,
  time = DEFAULT_DEBOUNCE_TIME,
  thisObject: any = null,
  ...args: any[]
): Promise<T> {
  if (!KEY_REFERENCES.has(callback)) {
    KEY_REFERENCES.set(callback, Symbol());
  }

  return debounceWithKey(KEY_REFERENCES.get(callback), callback, time, thisObject, ...args);
}
