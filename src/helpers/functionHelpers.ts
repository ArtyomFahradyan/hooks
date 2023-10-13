import type { DependencyList } from "react";
import { CustomAny } from "types";
import { isDevOrStage } from "./envHelpers";

export function debounce(fn: (...args: CustomAny[]) => void, timeout: number) {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: CustomAny[]) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => fn(...args), timeout);
  };
}

export function devLog(...params: CustomAny): void {
  if (isDevOrStage()) {
    // eslint-disable-next-line no-console
    console.log(...params);
  }
}

export function uuidv4() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function depsAreSame(
  oldDeps: DependencyList,
  deps: DependencyList
): boolean {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}

export const isFunction = (
  value: unknown
): value is (...args: CustomAny) => CustomAny => typeof value === "function";

export const isBrowser = () =>
  !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
