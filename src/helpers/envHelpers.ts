/**
 * Checks if env is dev env
 */
export function isLocal() {
  return process.env.REACT_APP_ENV === "local";
}

export function isDev() {
  return isLocal() || process.env.REACT_APP_ENV === "development";
}

export function isStage() {
  return process.env.REACT_APP_ENV === "staging";
}

export function isDevOrStage() {
  return isDev() || isStage();
}
