export const CRYPTO_TOKENS = ["CELO", "BNB", "ETH", "TON"] as const;
export type CryptoTokenType = (typeof CRYPTO_TOKENS)[number];

export const FIAT_TOKENS = ["NGN", "USD", "EUR", "GBP", "GHS"] as const;
export type FiatTokenType = (typeof FIAT_TOKENS)[number];


export const CONVERT_CURRENCY_STEPS = [
    {
        value: "convert" as const,
        title: "Convert",
        description: "Convert your crypto to cash",
        fields: ["pay.amount", "pay.token", "receive.amount", "receive.token", "payFrom.wallet", "payTo.destination"] as const,
    },
    {
        value: "recipient-details-1" as const,
        title: "Recipient Details 1",
        description: "Enter your recipient details",
        fields: ["recipientDetails1.bank", "recipientDetails1.accountNumber"] as const,
    },
    {
        value: "recipient-details-2" as const,
        title: "Recipient Details 2",
        description: "Enter your recipient details",
        fields: ["recipientDetails2.email", "recipientDetails2.phone"] as const,
    },
    {
        value: "confirmation" as const,
        title: "Confirmation",
        description: "Confirm your conversion details",
        fields: [] as const,
    },
    {
        value: "success" as const,
        title: "Success",
        description: "Your conversion is successful",
        fields: [] as const,
    },
];
export type ConvertCurrencyStepType = (typeof CONVERT_CURRENCY_STEPS)[number]["value"];
