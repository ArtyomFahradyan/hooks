/**
 * Converts enum to array
 */
type Enum<E> = Record<keyof E, string | number> & {
  [k: string]: string | number;
};
export function enumToArray<E extends Enum<E>>(enumObject: E) {
  const enumArray = [];

  for (const key in enumObject) {
    enumArray.push({ type: enumObject[key] });
  }

  return enumArray;
}
