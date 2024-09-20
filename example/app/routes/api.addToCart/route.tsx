import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { registerAction, useAPI } from "remix-pc";

const ROUTE = "/api/addToCart";

export const CartItem = zfd.formData({
  price: z.number(),
  quantity: z.number(),
  productId: z.string(),
  title: z.string(),
});

const CartItemResponse = z.object({
  success: z.boolean(),
  message: z.string(),
});

const addToCart = serverOnly$(async (cartItem: z.infer<typeof CartItem>): Promise<z.infer<typeof CartItemResponse>> => {
  // Do something server-side with cartItem
  console.log("got object", cartItem)
  return {
    success: true,
    message: "Item added to cart",
  };
});

export const action = registerAction(CartItem, addToCart!);

export function useAddToCart() {
  const submit = useAPI<typeof CartItem, typeof action>(ROUTE);
  return submit;
}