// @ts-check
// Enables TypeScript type checking for this JavaScript file

import { DiscountApplicationStrategy } from "../generated/api";
// Imports the discount application strategy enum from the generated API types

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * Defines the expected structure of the input the function receives
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * Defines the structure of the output the function should return
 */

/**
 * @type {FunctionRunResult}
 * Predefined empty discount result to return when no conditions are met
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * Main function that runs the discount logic
 * @param {RunInput} input - The input object containing the cart details
 * @returns {FunctionRunResult} - The result of the discount function
 */
export function run(input) {
  // Initialize cart total to zero
  let cartTotal = 0;

  // Sum up the total amount of all cart lines
  for (const line of input.cart.lines) {
    cartTotal = cartTotal + parseFloat(line.cost.totalAmount.amount);    
  }

  // Check if the cart total meets or exceeds the $500 threshold
  if(cartTotal >= 500) {
    
    // Filter cart lines to find those with a product variant tagged as a free item
    const targets = input.cart.lines.filter((line) => {
      return (
        line.merchandise.__typename === "ProductVariant" && // Ensure item is a product variant
        line.merchandise.product?.hasTags?.some((tag) => tag.hasTag) // Check for any tag that qualifies it
      );
    })
    // Map the qualifying lines into discount targets
    .map((line) => ({
      targets: [
        {
          cartLine: {
            id: line.id // ID of the cart line to apply the discount to
          }
        }
      ],
      value: {
        percentage: {
          value: (100.0 / line.quantity).toString(), // Calculate 100% discount per unit
        }
      }
    }))

    // Return the discount results if the cart qualifies
    return targets.length
      ? {
          discounts: targets.map((target) => ({
            ...target,
            message: "100% off for a free-item product!",
          })),
          discountApplicationStrategy: DiscountApplicationStrategy.First,
        }
      : EMPTY_DISCOUNT;
  }
};