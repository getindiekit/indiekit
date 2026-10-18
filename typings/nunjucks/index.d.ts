// Exported by `nunjucks/src/runtime.js`, but missing from `@types/nunjucks`
import "nunjucks";

declare module "nunjucks" {
  namespace runtime {
    /**
     * Mark a string as safe, so it isn’t escaped. A function is wrapped so
     * that any string it returns is marked safe.
     */
    function markSafe(value: string): SafeString;
    function markSafe<A extends unknown[], R>(
      value: (...args: A) => R,
    ): (...args: A) => R | SafeString;
    function markSafe<T>(value: T): T;
  }
}
