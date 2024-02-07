import { env } from "process";
/**
 * Checks if env is dev env
 */
export function isLocal() {
  return env.REACT_APP_ENV === "local";
}

export function isDev() {
  return isLocal() || env.REACT_APP_ENV === "development";
}

export function isStage() {
  return env.REACT_APP_ENV === "staging";
}

export function isDevOrStage() {
  return isDev() || isStage();
}
