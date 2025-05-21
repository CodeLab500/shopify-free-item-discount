import { DiscountApplicationStrategy } from "../generated/api";

export function run(input) {
    // Calculate the total amount in the cart using Array.reduce for concise and efficient summing
    const cartTotal = input.cart.lines.reduce((total, line) => 
        total + parseFloat(line.cost.totalAmount.amount || 0), 0
    );

    // Define the minimum cart total required for discounts
    const MINIMUM_CART_TOTAL = 500;

    if (cartTotal >= MINIMUM_CART_TOTAL) {
        // Filter lines with at least one tag and map to discount targets
        const targets = input.cart.lines
            .filter(line => line.merchandise.product.hasTags.length > 0)
            .map(line => ({
                targets: [{
                    cartLine: {
                        id: line.id
                    }
                }],
                // Apply a discount of 100% divided by quantity, i.e., "Buy One, Get One Free" when quantity is 2
                value: {
                    percentage: {
                        value: (100.0 / line.quantity).toFixed(2)
                    }
                }
            }));

        // Return the discount structure if targets exist; otherwise, return an empty discount
        return targets.length > 0
            ? { discounts: targets, discountApplicationStrategy: DiscountApplicationStrategy.First }
            : { discounts: [], discountApplicationStrategy: DiscountApplicationStrategy.First };
    } else {
        // Return an empty discount if the cart total is below the minimum
        return { discounts: [], discountApplicationStrategy: DiscountApplicationStrategy.First };
    }
}

export default run;
