# Shopify Free Item Discount App

This Shopify Function automatically applies a 100% discount to one cart item tagged with `free-item` when the cart subtotal reaches or exceeds $500.

## Features

- Built using Shopify Functions (CartTransform)
- Checks subtotal at checkout
- Finds first eligible item tagged `free-item`
- Applies full discount to one qualifying item

## How to Use

1. Tag one or more products in your Shopify store with `free-item`.
2. Add products to cart until subtotal exceeds $500.
3. Discount is automatically applied at checkout.

## Structure

- `/src/`: Source code (JS - could adjust to be in TS as well)
- `/dist/`: Compiled WASM output
- `shopify.extension.toml`: Shopify config
- `run.ts`: Discount logic implementation

## Test Store (Demo)
[https://image-skincare-test.myshopify.com](#)  
Use product with `free-item` tag + $500 cart subtotal to trigger the discount.

## Notes

This version discounts the **first** qualifying item found. Future versions could allow for:
- Cheapest of multiple
- Manual selection
- Tiered thresholds

---