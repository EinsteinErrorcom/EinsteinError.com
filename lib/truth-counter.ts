export const TRUTH_COUNTER_KEY = "truth_counter";
export const TRUTH_COUNTER_COOKIE = "truth_counted";
export const TRUTH_COUNTER_FALLBACK = 5_731_486;

export function formatTruthCount(count: number): string {
  return count.toLocaleString("en-US");
}
