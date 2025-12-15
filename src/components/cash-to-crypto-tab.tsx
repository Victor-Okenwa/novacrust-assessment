"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CRYPTO_TOKENS, FIAT_TOKENS, type CryptoTokenType, type FiatTokenType } from "~/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { CurrencyInput } from "./ui/currency-input";
import { TokenCombobox, type TokenOption } from "./ui/token-combobox";
import { BnbIcon, CeloIcon, EthereumIcon, EURIcon, GBPIcon, GHSIcon, MetamaskIcon, NGNIcon, RainbowIcon, TonIcon, USDIcon, WalletConnectIcon } from "~/assets/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Select, SelectTrigger } from "./ui/select";
import { LandmarkIcon, WalletMinimal, WalletMinimalIcon } from "lucide-react";

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

const WalletOptions = [
    {
        value: "metamask",
        label: "Metamask",
        icon: <MetamaskIcon />,
    },
    {
        value: "rainbow",
        label: "Rainbow",
        icon: <RainbowIcon />,
    },
    {
        value: "walletconnect",
        label: "WalletConnect",
        icon: <WalletConnectIcon />,
    },
    {
        value: "other",
        label: "Other Crypto Wallets (Binance, Coinbase, Bybit etc)",
        icon: <WalletMinimalIcon />,
    }
];

const DestinationOptions: TokenOption[] = [
    {
        value: "bank",
        label: "Bank",
        icon: <LandmarkIcon />,
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

    const [isConversionLoading, setIsConversionLoading] = useState(false);

    useEffect(() => {
        const amount = Number(form.watch("pay.amount"));
        const token = form.watch("pay.token");
        const receiveToken = form.watch("receive.token");

        if (!amount || !token || !receiveToken) return;

        function normalizeTokenForSearch(token: string) {
            if (token === "ETH") return "ethereum";
            if (token === "TON") return "ton";
            if (token === "CELO") return "celo";
            if (token === "BNB") return "binancecoin";
            return token.toLowerCase();
        }

        const timeoutId = setTimeout(() => {
            const fetchConversion = async () => {
                try {
                    setIsConversionLoading(true);
                    const res = await fetch(
                        `/api/crypto-price?crypto=${normalizeTokenForSearch(token)}&fiat=${normalizeTokenForSearch(receiveToken)}`
                    );
                    const data = await res.json();
                    const rate = data[token.toLowerCase()][receiveToken.toLowerCase()];
                    form.setValue("receive.amount", (rate * amount).toString());
                } catch (error) {
                    console.error("Error fetching conversion:", error);
                    toast.error("Error fetching conversion");
                    form.setValue("receive.amount", "0.00");
                } finally {
                    setIsConversionLoading(false);
                }
            };

            fetchConversion();
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [form.watch("pay.amount"), form.watch("pay.token"), form.watch("receive.token")]);
    const onSubmit = (data: FormSchemaType) => {
        console.log(data);
    };

    return (
        <div className="min-w-xs">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
                            <div className="relative">
                                {isConversionLoading && (
                                    <Spinner className="absolute top-[35%] left-1/2 -translate-x-1/2" />
                                )}
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
                            </div>

                            <TokenCombobox
                                value={form.watch("receive.token")}
                                onChange={(val) => form.setValue("receive.token", val as FiatTokenType)}
                                options={fiatTokens}
                                placeholder="Select token"
                            />

                        </CardContent>
                    </Card>

                    <FormField control={form.control} name="payFrom.wallet" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm text-primary font-medium">Pay from</FormLabel>
                            <FormControl>
                                <TokenCombobox withoutSearch={true} value={field.value} onChange={(val) => field.onChange(val)} options={WalletOptions} placeholder="Select wallet" className="w-full capitalize py-6 text-primary! border-primary/20! border! bg-background" containerClassName="w-full! min-w-sm rounded-xl! overflow-hidden" />
                            </FormControl>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="payTo.destination" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm text-primary font-medium">Pay to</FormLabel>
                            <FormControl>
                                <TokenCombobox withoutSearch={true} value={field.value} onChange={(val) => field.onChange(val)} options={DestinationOptions} placeholder="Select destination" className="w-full capitalize py-6 text-primary! border-primary/20! border! bg-background" containerClassName="w-full! min-w-sm rounded-xl! overflow-hidden" />
                            </FormControl>
                        </FormItem>
                    )} />


                </form>
            </Form>
        </div >
    );
}
