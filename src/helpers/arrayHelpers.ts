/**
 * Converts enum to array
 */
export type Enum<E> = Record<keyof E, string | number> & {
  [k: string]: string | number;
};
export function enumToArray<E extends Enum<E>>(enumObject: E) {
  return Object.keys(enumObject)
    .filter((key) => isNaN(Number(key))) // Filter out numeric keys for numeric enums
    .map((key) => enumObject[key as keyof E]);
}
