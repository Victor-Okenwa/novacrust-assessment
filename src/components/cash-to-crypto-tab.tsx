"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CRYPTO_TOKENS, FIAT_TOKENS, type CryptoTokenType } from "~/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { CurrencyInput } from "./ui/currency-input";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";
import { CheckIcon, ChevronDown, ChevronsDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { BnbIcon, CeloIcon, EthereumIcon, TonIcon, } from "~/assets/icons";
import { useState } from "react";

const cryptoTokens = [
    {
        value: "ETH",
        label: "ETH",
        icon: <EthereumIcon />,
    },
    {
        value: "TON",
        label: "TON",
        icon: <TonIcon />,
    },
    {
        value: "CELO",
        label: "CELO",
        icon: <CeloIcon />,
    },
    {
        value: "BNB",
        label: "BNB",
        icon: <BnbIcon />,
    },
];

const fiatTokens = FIAT_TOKENS.map((token) => ({
    value: token,
    label: token,
}));

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
    const [isCryptoTokenOpen, setIsCryptoTokenOpen] = useState(false);
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

    const onSubmit = (data: FormSchemaType) => {
        console.log(data);
    };

    return (
        <div className="min-w-xs">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

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

                            <Popover open={isCryptoTokenOpen} onOpenChange={setIsCryptoTokenOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="secondary" role="combobox" className="justify-between rounded-full text-primary">
                                        {(() => {
                                            const current = form.watch("pay.token");
                                            const token = cryptoTokens.find(
                                                (t) => t.value.toLowerCase() === current.toLowerCase(),
                                            );
                                            if (!token) return null;
                                            return (
                                                <div className="flex items-center gap-1 flex-1 [&>svg]:size-5">
                                                    {token.icon}
                                                    <span className="text-sm font-medium">{token.label}</span>
                                                </div>
                                            );
                                        })()}
                                        <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit p-0">
                                    <Command>
                                        <CommandInput placeholder="Search framework..." />
                                        <CommandList>
                                            <CommandEmpty>No framework found.</CommandEmpty>
                                            <CommandGroup>
                                                {cryptoTokens.map((token) => (
                                                    <CommandItem
                                                        key={token.value}
                                                        value={token.value}
                                                        onSelect={(currentValue) => {
                                                            form.setValue("pay.token", currentValue as CryptoTokenType);
                                                            setIsCryptoTokenOpen(false)
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2 flex-1">
                                                            {token.icon}
                                                            {token.label}
                                                        </div>
                                                        <CheckIcon
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                form.watch("pay.token") === token.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
