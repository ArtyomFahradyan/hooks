import { useMemo, useRef } from "react";
import { CustomAny } from "types";

type noop = (this: CustomAny, ...args: CustomAny[]) => CustomAny;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

export function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);

  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args: CustomAny[]) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
}
