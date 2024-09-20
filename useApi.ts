import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useRef } from "react";
import { z, ZodType } from "zod";

export function useAPI<T extends ZodType, R>(action: string) {
  const promiseResolveRef = useRef<(value: typeof fetcher.data) => void>();
  const promiseResolveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const fetcher = useFetcher<R>();

  useEffect(() => {
    if (fetcher.state !== "idle" || promiseResolveRef.current === undefined || !fetcher.data) {
      return;
    }
    promiseResolveTimeoutRef.current && clearTimeout(promiseResolveTimeoutRef.current);
    promiseResolveRef.current(fetcher.data);
  }, [fetcher]);

  const submit = useCallback(
    (item: z.infer<T>) => {
      const body = new FormData();
      Object.entries(item).forEach(([key, value]) => {
        if (value instanceof Blob) {
          body.append(key, value);
        } else {
          body.append(key, JSON.stringify(value));
        }
      });
      fetcher.submit(body, {
        method: "POST",
        action,
      });
      return new Promise<typeof fetcher.data>((resolve, reject) => {
        promiseResolveRef.current = resolve;
        promiseResolveTimeoutRef.current = setTimeout(() => {
          reject(new Error("API Timeout"));
        }, 10000);
      });
    },
    [action, fetcher],
  );
  return submit;
}
