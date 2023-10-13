import { CustomAny } from "types";

export default function limit(fn: CustomAny, timespan: number) {
  let pending = false;
  return (...args: CustomAny[]) => {
    if (pending) return;
    pending = true;
    fn(...args);
    setTimeout(() => {
      pending = false;
    }, timespan);
  };
}
