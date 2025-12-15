export const CRYPTO_TOKENS = ["CELO", "BNB", "ETH", "TON"] as const;
export type CryptoTokenType = (typeof CRYPTO_TOKENS)[number];

export const FIAT_TOKENS = ["NGN", "USD", "EUR", "GBP", "GHS"] as const;
export type FiatTokenType = (typeof FIAT_TOKENS)[number];