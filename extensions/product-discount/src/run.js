import { DiscountApplicationStrategy } from "../generated/api";

export function run(input) {
    const cartTotal = input.cart.lines.reduce(
        (total, line) => total + parseFloat(line.cost.totalAmount.amount || 0),
        0
    );

    const MINIMUM_CART_TOTAL = 500;

    if (cartTotal >= MINIMUM_CART_TOTAL) {
        // Find only the first cart line with the "free-item" tag
        const line = input.cart.lines.find((line) =>
            line.merchandise.product.hasTags.some(
                (tag) => tag.tag === "free-item" && tag.hasTag
            )
        );

        if (line) {
            return {
                discounts: [
                    {
                        targets: [
                            {
                                cartLine: {
                                    id: line.id
                                }
                            }
                        ],
                        value: {
                            percentage: {
                                value: (100.0 / line.quantity).toFixed(2)
                            }
                        }
                    }
                ],
                discountApplicationStrategy: DiscountApplicationStrategy.First
            };
        }
    }

    // Return no discounts if no matching line is found or threshold isn't met
    return {
        discounts: [],
        discountApplicationStrategy: DiscountApplicationStrategy.First
    };
}

export default run;
