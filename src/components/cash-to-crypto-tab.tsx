"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CRYPTO_TOKENS, FIAT_TOKENS, type CryptoTokenType, type FiatTokenType } from "~/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { CurrencyInput } from "./ui/currency-input";
import { TokenCombobox, type TokenOption } from "./ui/token-combobox";
import { BnbIcon, CeloIcon, EthereumIcon, EURIcon, GBPIcon, GHSIcon, NGNIcon, TonIcon, USDIcon } from "~/assets/icons";
import { useEffect } from "react";

const cryptoTokens: TokenOption[] = [
    {
        value: "ETH",
        label: "USDT - ETH",
        icon: <EthereumIcon />,
    },
    {
        value: "TON",
        label: "USDT - TON",
        icon: <TonIcon />,
    },
    {
        value: "CELO",
        label: "USDT - CELO",
        icon: <CeloIcon />,
    },
    {
        value: "BNB",
        label: "USDT - BNB",
        icon: <BnbIcon />,
    },
];

const fiatTokens: TokenOption[] = [
    {
        value: "NGN",
        label: "NGN",
        icon: <NGNIcon />,
    },
    {
        value: "USD",
        label: "USD",
        icon: <USDIcon />,
    },
    {
        value: "EUR",
        label: "EUR",
        icon: <EURIcon />,
    },
    {
        value: "GBP",
        label: "GBP",
        icon: <GBPIcon />,
    },
    {
        value: "GHS",
        label: "GHS",
        icon: <GHSIcon />,
    },
];
const CryptoTokenSchema = z.enum(CRYPTO_TOKENS);
const FiatTokenSchema = z.enum(FIAT_TOKENS);
const PayAmountSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine(
            (val) => !Number.isNaN(Number(val)) && Number(val) > 0,
            "Amount must be a positive number"
        ),
    token: CryptoTokenSchema,
});

const ReceiveAmountSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine(
            (val) => !Number.isNaN(Number(val)) && Number(val) > 0,
            "Amount must be a positive number"
        ),
    token: FiatTokenSchema,
});

const PayFromSchema = z.object({
    wallet: z.enum(["metamask", "rainbow", "walletconnect", "other"]),
});

const PayToSchema = z.object({
    destination: z.enum(["bank", "card"])
})

const FormSchema = z.object({
    pay: PayAmountSchema,
    receive: ReceiveAmountSchema,
    payFrom: PayFromSchema,
    payTo: PayToSchema
});

type FormSchemaType = z.infer<typeof FormSchema>;

export function CashToCryptoTab() {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pay: {
                amount: "",
                token: "ETH",
            },
            receive: {
                amount: "",
                token: "NGN",
            },
            payFrom: {
                wallet: "metamask",
            },
            payTo: {
                destination: "bank",
            },
        },
    });


    useEffect(() => {
        const amount = Number(form.watch("pay.amount"));
        const token = form.watch("pay.token");
        const receiveToken = form.watch("receive.token");

        if (!amount || !token || !receiveToken) return;

        const fetchConversion = async () => {
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${token.toLowerCase()}&vs_currencies=${receiveToken.toLowerCase()}`
                );
                const data = await response.json();
                console.log(data[token.toLowerCase()][receiveToken.toLowerCase()] * Number(amount));
                form.setValue("receive.amount", (data[token.toLowerCase()][receiveToken.toLowerCase()] * Number(amount)).toString());
            } catch (error) {
                console.error("Error fetching conversion:", error);
                form.setValue("receive.amount", "0.00");
            }
        };
        fetchConversion();
    }, [form.watch("pay.amount"), form.watch("pay.token"), form.watch("receive.token")]);
    const onSubmit = (data: FormSchemaType) => {
        console.log(data);
    };

    return (
        <div className="min-w-xs">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <Card className="gap-0">
                        <CardHeader className="py-0! gap-0">
                            <CardTitle className="text-base text-muted-foreground font-light">You pay</CardTitle>
                            <CardDescription className="sr-only hidden">Enter the amount you want to pay and the token you want to pay with.</CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-row py-0">
                            <FormField
                                control={form.control}
                                name="pay.amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel />
                                        <FormControl>
                                            <CurrencyInput
                                                placeholder="0.00"
                                                {...field}
                                                className="p-0 border-none bg-transparent font-semibold text-xl focus-visible:outline-none focus-visible:border-b focus-visible:border-current w-auto focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none shadow-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <TokenCombobox
                                value={form.watch("pay.token")}
                                onChange={(val) => form.setValue("pay.token", val as CryptoTokenType)}
                                options={cryptoTokens}
                                placeholder="Select token"
                            />

                        </CardContent>
                    </Card>

                    <Card className="gap-0">
                        <CardHeader className="py-0! gap-0">
                            <CardTitle className="text-base text-muted-foreground font-light">You receive</CardTitle>
                            <CardDescription className="sr-only hidden">Enter the amount you want to  and the token you want to pay with.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-row py-0">


                            <FormField
                                control={form.control}
                                name="receive.amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel />
                                        <FormControl>
                                            <CurrencyInput
                                                placeholder="0.00"
                                                readOnly
                                                value={form.watch("receive.amount") ?? field.value}
                                                className="p-0 border-none bg-transparent font-semibold text-xl focus-visible:outline-none focus-visible:border-b focus-visible:border-current w-auto focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none shadow-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <TokenCombobox
                                value={form.watch("receive.token")}
                                onChange={(val) => form.setValue("receive.token", val as FiatTokenType)}
                                options={fiatTokens}
                                placeholder="Select token"
                            />

                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div >
    );
}
