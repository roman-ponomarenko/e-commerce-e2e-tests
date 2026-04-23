/**
 * Parses a price string (e.g. `"$22.00"`) into a numeric value.
 *
 * @param raw - The raw price string to parse.
 * @returns The numeric price value.
 *
 * @example
 * parsePrice('$22.00') // 22
 * parsePrice('  $1,299.99  ') // 1299.99
 */
export const parsePrice = (raw: string): number => {
    return parseFloat(raw.trim().replace(/[^0-9.]/g, ''));
}


/**
 * Formats a numeric price value into a display string (e.g. `"$22.00"`).
 *
 * @param amount - The numeric price to format.
 * @returns A USD-formatted price string.
 *
 * @example
 * formatPrice(22) // '$22.00'
 * formatPrice(1299.9) // '$1299.90'
 */
export const formatPrice = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
}