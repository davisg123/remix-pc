import { ActionFunctionArgs } from "@remix-run/node";
import { z, ZodType } from "zod";

export function registerAction<T extends ZodType>(
  object: T,
  handler: (input: z.infer<T>) => unknown,
) {
  return async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const formDataObject = Object.fromEntries(formData.entries());

    // Need to JSON parse each field in the form data
    // because we encoded them as JSON strings
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          formDataObject[key] = parsed;
        } catch (error) {
          console.error(`Failed to parse JSON for key: ${key}`);
        }
      }
    }

    const body = object.parse(formDataObject);

    return handler(body);
  };
}