"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CONVERT_CURRENCY_STEPS, CRYPTO_TOKENS, FIAT_TOKENS, type ConvertCurrencyStepType, type CryptoTokenType, type FiatTokenType } from "~/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { CurrencyInput } from "./ui/currency-input";
import { TokenCombobox, type TokenOption } from "./ui/token-combobox";
import { AccountNumberInput } from "./ui/account-number-input";
import { BnbIcon, CeloIcon, EthereumIcon, EURIcon, GBPIcon, GHSIcon, KudaIcon, MetamaskIcon, MoniepointIcon, NGNIcon, OpayIcon, PalmpayIcon, RainbowIcon, TonIcon, UBAIcon, USDIcon, WalletConnectIcon } from "~/assets/icons";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Select, SelectTrigger } from "./ui/select";
import { ArrowLeftIcon, LandmarkIcon, WalletMinimal, WalletMinimalIcon } from "lucide-react";
import { Stepper, StepperContent, StepperItem, StepperNext, StepperTitle, StepperSeparator, StepperPrev, StepperList, StepperIndicator, StepperTrigger, type StepperProps, StepperDescription } from "./ui/stepper";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PhoneInput } from "./ui/phone-input";
import { LoadingSwap } from "./ui/loading-swap";

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

const BankOptions: TokenOption[] = [
    {
        value: "uba",
        label: "UBA",
        icon: <UBAIcon />,
    },
    {
        value: "opay",
        label: "OPAY",
        icon: <OpayIcon />
    },
    {
        value: "palmpay",
        label: "Palmpay",
        icon: <PalmpayIcon />,
    },
    {
        value: "moniepoint",
        label: "Moniepoint",
        icon: <MoniepointIcon />,
    },
    {
        value: "kuda",
        label: "Kuda",
        icon: <KudaIcon />,
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
});

const RecipientDetailsSchema1 = z.object({
    bank: z.string().min(1, "Bank is required"),
    accountNumber: z
        .string()
        .min(1, "Account number is required")
        .max(10, "Account number must be 10 digits"),
    accountName: z.string().optional(),
});

const RecipientDetailsSchema2 = z.object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone number is required"),
});

const FormSchema = z.object({
    pay: PayAmountSchema,
    receive: ReceiveAmountSchema,
    payFrom: PayFromSchema,
    payTo: PayToSchema,

    recipientDetails1: RecipientDetailsSchema1,
    recipientDetails2: RecipientDetailsSchema2,
});

type FormSchemaType = z.infer<typeof FormSchema>;


export function CashToCryptoTab({ step, setStep }: { step: ConvertCurrencyStepType, setStep: (step: ConvertCurrencyStepType) => void }) {
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
            recipientDetails1: {
                bank: "",
                accountNumber: "",
            },
            recipientDetails2: {
                email: "",
                phone: "",
            },
        },
    });

    const [isConversionLoading, setIsConversionLoading] = useState(false);
    const [isAccountFilled, setIsAccountFilled] = useState(false);


    useEffect(() => {
        const bank = form.getValues("recipientDetails1.bank");
        const accountNumber = form.getValues("recipientDetails1.accountNumber");

        async function checkAccountFilled() {
            if (bank && accountNumber) {
                const isValid = await form.trigger(["recipientDetails1.bank", "recipientDetails1.accountNumber"]);
                if (isValid) {
                    setIsAccountFilled(true);
                }
            } else {
                setIsAccountFilled(false);
            }
        }
        checkAccountFilled();
    }, [form.watch("recipientDetails1.bank"), form.watch("recipientDetails1.accountNumber")])

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


    const onSubmit = async (data: FormSchemaType) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Conversion successful");
        setStep("confirmation");
    };

    const onValidate: NonNullable<StepperProps["onValidate"]> = useCallback(
        async (_value, direction) => {
            if (direction === "prev") return true;

            const stepData = CONVERT_CURRENCY_STEPS.find((s) => s.value === step);
            if (!stepData) return true;

            const isValid = await form.trigger(stepData.fields);

            if (!isValid) {
                toast.info("Please complete all required fields to continue");
            }

            return isValid;
        },
        [form, step],
    );

    const onError = (errors: FieldErrors<FormSchemaType>) => {
        console.log(errors);
        toast.error("Please fix the errors to continue");
    };


    return (
        <div className="max-md:min-w-[80vw]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <Stepper value={step} onValueChange={(value: string) => setStep(value as ConvertCurrencyStepType)} onValidate={onValidate}>
                        <StepperList className="sr-only">
                            {CONVERT_CURRENCY_STEPS.map((step) => (
                                <StepperItem key={step.value} value={step.value}>
                                    <StepperTrigger>
                                        <StepperIndicator />
                                        <div className="flex flex-col gap-px">
                                            <StepperTitle>{step.title}</StepperTitle>
                                            <StepperDescription>{step.description}</StepperDescription>
                                        </div>
                                    </StepperTrigger>
                                    <StepperSeparator className="mx-4" />
                                </StepperItem>
                            ))}
                        </StepperList>
                        <StepperContent value="convert" className="space-y-6">
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
                                                            onChange={field.onChange}
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
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="payTo.destination" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-primary font-medium">Pay to</FormLabel>
                                    <FormControl>
                                        <TokenCombobox withoutSearch={true} value={field.value} onChange={(val) => field.onChange(val)} options={DestinationOptions} placeholder="Select destination" className="w-full capitalize py-6 text-primary! border-primary/20! border! bg-background" containerClassName="w-full! min-w-sm rounded-xl! overflow-hidden" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </StepperContent>

                        <StepperContent value="recipient-details-1" className="space-y-6 min-w-[90%]">
                            <div className="flex flex-row gap-3">
                                <StepperPrev><ArrowLeftIcon /></StepperPrev>
                                <h3 className="text-lg font-medium text-primary flex-1">Recipient Details</h3>
                            </div>

                            <FormField control={form.control} name="recipientDetails1.bank" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-primary font-medium">Pay from</FormLabel>
                                    <FormControl>
                                        <TokenCombobox withoutSearch={false} searchPlaceholder="Search Bank..." placeholder="Select Bank" value={field.value} onChange={(val) => field.onChange(val)} options={BankOptions} className="w-full capitalize py-6 text-primary! border-primary/20! border! bg-background" containerClassName="w-full! min-w-sm rounded-xl! overflow-hidden" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="recipientDetails1.accountNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-primary font-medium">Account Number</FormLabel>
                                    <FormControl>
                                        <AccountNumberInput
                                            placeholder="Enter your account number"
                                            maxLength={10}
                                            inputMode="numeric"
                                            className="py-6 text-primary! border-primary/20! border! text-sm rounded-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {isAccountFilled && (
                                <FormField control={form.control} name="recipientDetails1.accountName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-primary font-medium">Account Name</FormLabel>
                                        <FormControl>
                                            <Input readOnly placeholder="Enter your account name" className="py-6 text-primary! border-primary/20! border! text-sm rounded-full bg-secondary" value={"ODUNGA OGBEKE"} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}

                        </StepperContent>

                        <StepperContent value="recipient-details-2" className="space-y-6">
                            <div className="flex flex-row gap-3">
                                <StepperPrev><ArrowLeftIcon /></StepperPrev>
                                <h3 className="text-lg font-medium text-primary flex-1">Recipient Details</h3>
                            </div>

                            <FormField control={form.control} name="recipientDetails2.email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-primary font-medium">Recipient Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" className="py-6 text-primary! border-primary/20! border! text-sm rounded-full bg-secondary" value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField
                                control={form.control}
                                name="recipientDetails2.phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-primary font-medium">Recipient Phone</FormLabel>
                                        <FormControl>
                                            <PhoneInput {...field} defaultCountry="NG" placeholder="000-000-00000" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </StepperContent>

                        <StepperContent value="confirmation" className="space-y-6"></StepperContent>
                        <StepperContent value="success" className="space-y-6"></StepperContent>


                        <div className="mt-4 flex justify-between *:w-full *:py-5 *:rounded-full">
                            {step === "recipient-details-2" ? (
                                <Button type="submit">
                                    <LoadingSwap isLoading={form.formState.isSubmitting}>
                                        Next
                                    </LoadingSwap>
                                </Button>
                            ) : step === "success" ? (
                                <Button type="button" variant="link" className="text-primary">Go to dashboard</Button>
                            ) : (
                                <StepperNext asChild>
                                    <Button type="button" >
                                        {step === "recipient-details-1" ? "Next" : "Convert Now"}
                                    </Button>
                                </StepperNext>
                            )}
                        </div>
                    </Stepper>

                </form>
            </Form>
        </div >
    );
}
