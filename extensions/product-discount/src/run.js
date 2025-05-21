// Import the discount application strategy enum from the generated API definitions.
// This helps define how Shopify should apply the discount (e.g., apply the first discount it finds).
import { DiscountApplicationStrategy } from "../generated/api";

// This is the main function Shopify calls to evaluate and return any discounts.
export function run(input) {
    // Calculate the total value of all items in the cart by summing each line's cost.
    // 'parseFloat' converts the string amount to a number. If the amount is missing, it uses 0.
    const cartTotal = input.cart.lines.reduce(
        (total, line) => total + parseFloat(line.cost.totalAmount.amount || 0),
        0
    );

    // Define the minimum amount required in the cart to activate the discount.
    const MINIMUM_CART_TOTAL = 500;

    // Only continue if the cart total is greater than or equal to the minimum required.
    if (cartTotal >= MINIMUM_CART_TOTAL) {
        // Find the **first** line item that has a product tagged with "free-item".
        const line = input.cart.lines.find((line) =>
            line.merchandise.product.hasTags.some(
                (tag) => tag.tag === "free-item" && tag.hasTag
            )
        );

        // If such a product is found, create and return a discount for it.
        if (line) {
            return {
                // Define an array of discounts to apply (only one here).
                discounts: [
                    {
                        // Specify the line in the cart to which the discount applies.
                        targets: [
                            {
                                cartLine: {
                                    id: line.id
                                }
                            }
                        ],
                        // Define the discount value.
                        // This applies a percentage discount calculated as (100 / quantity).
                        // So if quantity is 1, it's 100% off; if it's 2, each gets 50% off.
                        value: {
                            percentage: {
                                value: (100.0 / line.quantity).toFixed(2)
                            }
                        }
                    }
                ],
                // Tells Shopify to apply only the first applicable discount it finds.
                discountApplicationStrategy: DiscountApplicationStrategy.First
            };
        }
    }

    // If no eligible line was found or the minimum total wasn't met,
    // return an empty discount result (no discounts applied).
    return {
        discounts: [],
        discountApplicationStrategy: DiscountApplicationStrategy.First
    };
}

// Export the run function as the default export of this module.
export default run;
