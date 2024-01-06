import { init } from "@paralleldrive/cuid2";

export const createId = (length: number = 12) => {
  const createId = init({
    length: length,
  });
  return createId();
};
