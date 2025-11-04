import { useState } from "react";

type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

export default <T extends any[], R>(
  callback: AsyncFunction<T, R>
): [boolean, (...args: T) => Promise<R>] => {
  const [loading, setLoading] = useState<boolean>(false);

  const request = async (...args: T) => {
    setLoading(true);

    return callback(...args)
      .then((res) => res)
      .catch((err) => err)
      .finally(() => setLoading(false));
  };

  return [loading, request];
};
