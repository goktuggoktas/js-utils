const FALSY_VALUES = [undefined, null, "", 0, false];

/**
 * #### Filters falsy values of the given array
 * * does not modify the original array
 * * Values to be filtered: `[undefined, null, "", 0, false, NaN]`
 *
 * * * *
 * Example usage:
 * ```typescript
 * import { compact } from "@gen-tech/js-utils";
 *
 * const arr = [undefined, "", false, 0, 1, "1"];
 * const compacted = compact(arr); // [1, "1"];
 *
 * ```
 *
 * Example as Array Prototype:
 * ```typescript
 * import "@gen-tech/js-utils/dist/as-proto/compact";
 *
 * const arr = [undefined, "", false, 0, 1, "1"];
 * const compacted = arr.compact(); // [1, "1"];
 * ```
 * * * *
 * @param arrayToCompact array to compact
 * @typeparam T type of array
 * @returns __a	new__ compacted array
 */
export function compact<T = any>(arrayToCompact: T[]): T[] {
	return arrayToCompact.filter((item: any) => !Number.isNaN(item) && FALSY_VALUES.every(value => item !== value));
}