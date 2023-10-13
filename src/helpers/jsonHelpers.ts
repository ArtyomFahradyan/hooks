import { CustomAny } from "types";

export function safeReadJSON(str = "{}", defValue?: null) {
  let res: CustomAny = defValue;

  try {
    res = JSON.parse(str);
  } catch (e) {
    console.error(e);
  }

  return res;
}
