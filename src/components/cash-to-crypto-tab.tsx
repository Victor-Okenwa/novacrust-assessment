"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  CopyIcon,
  InfoIcon,
  LandmarkIcon,
  WalletMinimalIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type Path, type PathValue, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  BnbIcon,
  CeloIcon,
  EthereumIcon,
  EURIcon,
  GBPIcon,
  GHSIcon,
  KudaIcon,
  MetamaskIcon,
  MoniepointIcon,
  NGNIcon,
  OpayIcon,
  PalmpayIcon,
  RainbowIcon,
  TonIcon,
  UBAIcon,
  USDIcon,
  WalletConnectIcon,
} from "~/assets/icons";
import {
  CONVERT_CURRENCY_STEPS,
  type ConvertCurrencyStepType,
  CRYPTO_TOKENS,
  type CryptoTokenType,
  FIAT_TOKENS,
  type FiatTokenType,
} from "~/lib/constants";
import {
  copyToClipboard,
  cryptoToCoinGeckoId,
  generateRandomString,
} from "~/lib/utils";
import { TransactionProcessed } from "./transaction-processed";
import { AccountNumberInput } from "./ui/account-number-input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CurrencyInput } from "./ui/currency-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { LoadingSwap } from "./ui/loading-swap";
import { PhoneInput } from "./ui/phone-input";
import { Spinner } from "./ui/spinner";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrev,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "./ui/stepper";
import { TokenCombobox, type TokenOption } from "./ui/token-combobox";

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
  },
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
    icon: <OpayIcon />,
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
    .refine((val) => {
      const stripped = val.replace(/,/g, "");
      return !Number.isNaN(Number(stripped)) && Number(stripped) > 0;
    }, "Amount must be a positive number"),
  token: FiatTokenSchema,
});

const PayFromSchema = z.object({
  wallet: z.enum(["metamask", "rainbow", "walletconnect", "other"]),
});

const PayToSchema = z.object({
  destination: z.enum(["bank", "card"]),
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

export function CashToCryptoTab({
  step,
  setStep,
}: {
  step: ConvertCurrencyStepType;
  setStep: (step: ConvertCurrencyStepType) => void;
}) {
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
        accountName: "Opeyemi Olaiya",
      },
      recipientDetails2: {
        email: "",
        phone: "",
      },
    },
  });

  const [isConversionLoading, setIsConversionLoading] = useState(false);
  const [isAccountFilled, setIsAccountFilled] = useState(false);
  const address = useMemo(() => generateRandomString(16), []);
  const transactionId = useMemo(() => generateRandomString(10), []);

  const amount = Number(form.watch("pay.amount"));
  const token = form.watch("pay.token");
  const receiveToken = form.watch("receive.token");
  const bank = form.watch("recipientDetails1.bank");
  const accountNumber = form.watch("recipientDetails1.accountNumber");

  const setValue = useCallback(
    <TFieldName extends Path<FormSchemaType>>(
      name: TFieldName,
      value: PathValue<FormSchemaType, TFieldName>,
      options?: Parameters<typeof form.setValue>[2]
    ) => {
      form.setValue(name, value, options);
    },
    [form]
  );

  useEffect(() => {
    async function checkAccountFilled() {
      if (bank && accountNumber) {
        const isValid = await form.trigger([
          "recipientDetails1.bank",
          "recipientDetails1.accountNumber",
        ]);
        if (isValid) {
          setIsAccountFilled(true);
        }
      } else {
        setIsAccountFilled(false);
      }
    }
    checkAccountFilled();
  }, [form.trigger, accountNumber, bank]);

  useEffect(() => {
    if (step !== "convert") {
      return;
    }

    if (!(amount && token && receiveToken)) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsConversionLoading(true);

        const cryptoId = cryptoToCoinGeckoId(token); // ETH → ethereum
        const fiatId = receiveToken.toLowerCase(); // NGN → ngn

        const res = await fetch(
          `/api/crypto-price?crypto=${cryptoId}&fiat=${fiatId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch conversion");
        }

        const data: {
          rate: number;
          source: "live" | "usd-fallback" | "static-fallback";
        } = await res.json();

        if (typeof data.rate !== "number") {
          throw new Error("Invalid rate received");
        }

        const convertedAmount = data.rate * amount;
        const formattedAmount = convertedAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setValue("receive.amount", formattedAmount, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch (_error) {
        toast.error("Unable to fetch live price. Using fallback.");
        setValue("receive.amount", "0.00", { shouldValidate: true });
      } finally {
        setIsConversionLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [amount, token, receiveToken, setValue, step]);

  const onSubmit = async (data: FormSchemaType) => {
    console.log("data", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Conversion successful");
    setStep("confirmation");
  };

  const onValidate: NonNullable<StepperProps["onValidate"]> = useCallback(
    async (_value, direction) => {
      if (direction === "prev") {
        return true;
      }

      const stepData = CONVERT_CURRENCY_STEPS.find((s) => s.value === step);
      if (!stepData) {
        return true;
      }

      const isValid = await form.trigger(stepData.fields);

      if (!isValid) {
        toast.info("Please complete all required fields to continue");
      }

      return isValid;
    },
    [form, step]
  );

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stepper
            onValidate={onValidate}
            onValueChange={(value: string) =>
              setStep(value as ConvertCurrencyStepType)
            }
            value={step}
          >
            <StepperList className="sr-only">
              {CONVERT_CURRENCY_STEPS.map((stepData) => (
                <StepperItem key={stepData.value} value={stepData.value}>
                  <StepperTrigger>
                    <StepperIndicator />
                    <div className="flex flex-col gap-px">
                      <StepperTitle>{stepData.title}</StepperTitle>
                      <StepperDescription>
                        {stepData.description}
                      </StepperDescription>
                    </div>
                  </StepperTrigger>
                  <StepperSeparator className="mx-4" />
                </StepperItem>
              ))}
            </StepperList>
            <StepperContent className="space-y-6" value="convert">
              <Card className="gap-0">
                <CardHeader className="gap-0 py-0!">
                  <CardTitle className="font-light text-base text-muted-foreground">
                    You pay
                  </CardTitle>
                  <CardDescription className="sr-only hidden">
                    Enter the amount you want to pay and the token you want to
                    pay with.
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-row justify-between py-0">
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
                            className="w-auto border-none bg-transparent p-0 font-semibold text-xl shadow-none focus-visible:border-current focus-visible:border-b focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <TokenCombobox
                    onChange={(val) =>
                      form.setValue("pay.token", val as CryptoTokenType)
                    }
                    options={cryptoTokens}
                    placeholder="Select token"
                    value={form.watch("pay.token")}
                  />
                </CardContent>
              </Card>

              <Card className="gap-0">
                <CardHeader className="gap-0 py-0!">
                  <CardTitle className="font-light text-base text-muted-foreground">
                    You receive
                  </CardTitle>
                  <CardDescription className="sr-only hidden">
                    Enter the amount you want to and the token you want to pay
                    with.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-row justify-between py-0">
                  <div className="relative">
                    {Boolean(isConversionLoading) && (
                      <Spinner className="-translate-x-1/2 absolute top-[35%] left-1/2" />
                    )}
                    <FormField
                      control={form.control}
                      name="receive.amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel />
                          <FormControl>
                            <CurrencyInput
                              className="w-auto border-none bg-transparent p-0 font-semibold text-xl shadow-none focus-visible:border-current focus-visible:border-b focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              onChange={field.onChange}
                              placeholder="0.00"
                              readOnly
                              value={
                                form.watch("receive.amount") ?? field.value
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <TokenCombobox
                    onChange={(val) =>
                      form.setValue("receive.token", val as FiatTokenType)
                    }
                    options={fiatTokens}
                    placeholder="Select token"
                    value={form.watch("receive.token")}
                  />
                </CardContent>
              </Card>

              <FormField
                control={form.control}
                name="payFrom.wallet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-primary text-sm">
                      Pay from
                    </FormLabel>
                    <FormControl>
                      <TokenCombobox
                        className="border! w-full border-primary/20! bg-background py-6 text-primary! capitalize"
                        containerClassName="w-full! min-w-sm rounded-xl! overflow-hidden"
                        onChange={(val) => field.onChange(val)}
                        options={WalletOptions}
                        placeholder="Select wallet"
                        value={field.value}
                        withoutSearch={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payTo.destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-primary text-sm">
                      Pay to
                    </FormLabel>
                    <FormControl>
                      <TokenCombobox
                        className="border! w-full border-primary/20! bg-background py-6 text-primary! capitalize"
                        containerClassName="w-full! min-w-sm rounded-xl! overflow-hidden"
                        onChange={(val) => field.onChange(val)}
                        options={DestinationOptions}
                        placeholder="Select destination"
                        value={field.value}
                        withoutSearch={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </StepperContent>

            <StepperContent className="space-y-6" value="recipient-details-1">
              <section className="flex flex-row gap-3">
                <StepperPrev>
                  <ArrowLeftIcon className="size-4" />
                </StepperPrev>
                <h3 className="flex-1 text-center font-medium text-base text-primary">
                  Recipient Details
                </h3>
              </section>

              <FormField
                control={form.control}
                name="recipientDetails1.bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-primary text-sm">
                      Pay from
                    </FormLabel>
                    <FormControl>
                      <TokenCombobox
                        className="border! w-full border-primary/20! bg-background py-6 text-primary! capitalize"
                        containerClassName="w-full! min-w-sm rounded-xl! overflow-hidden"
                        onChange={(val) => field.onChange(val)}
                        options={BankOptions}
                        placeholder="Select Bank"
                        searchPlaceholder="Search Bank..."
                        value={field.value}
                        withoutSearch={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientDetails1.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-primary text-sm">
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <AccountNumberInput
                        className="border! rounded-full border-primary/20! py-6 text-primary! text-sm"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter your account number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {Boolean(isAccountFilled) && (
                <FormField
                  control={form.control}
                  name="recipientDetails1.accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-primary text-sm">
                        Account Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border! rounded-full border-primary/20! bg-secondary py-6 text-primary! text-sm uppercase"
                          placeholder="Enter your account name"
                          readOnly
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </StepperContent>

            <StepperContent className="space-y-6" value="recipient-details-2">
              <section className="flex flex-row gap-3">
                <StepperPrev>
                  <ArrowLeftIcon className="size-4" />
                </StepperPrev>
                <h3 className="flex-1 text-center font-medium text-base text-primary">
                  Recipient Details
                </h3>
              </section>

              <FormField
                control={form.control}
                name="recipientDetails2.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-primary text-sm">
                      Recipient Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border! rounded-full border-primary/20! bg-secondary py-6 text-primary! text-sm"
                        onChange={field.onChange}
                        placeholder="Enter your email"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientDetails2.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-primary text-sm">
                      Recipient Phone
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        defaultCountry="NG"
                        placeholder="000-000-00000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </StepperContent>

            <StepperContent className="space-y-2" value="confirmation">
              <section className="flex flex-row gap-3">
                <StepperPrev>
                  <ArrowLeftIcon className="size-4" />
                </StepperPrev>
                <h3 className="flex-1 text-center font-medium text-base text-primary">
                  Send {form.getValues("pay.token")} to the address below
                </h3>
              </section>

              <section className="flex flex-col space-y-6">
                <div className="flex w-full justify-center">
                  <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm dark:bg-green-900">
                    {address}
                    <Button
                      onClick={() => copyToClipboard(address)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-lg bg-secondary px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">
                      Amount to send
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-medium text-primary">
                        {form.getValues("pay.amount")}{" "}
                        {form.getValues("pay.token")}
                      </span>
                      <Button
                        className="size-fit p-0"
                        onClick={() =>
                          copyToClipboard(form.getValues("pay.amount"))
                        }
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="items flex justify-between text-xs">
                    Network
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-medium text-primary">
                        {form.getValues("pay.token")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-xs">Wallet</div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-medium text-primary uppercase">
                        {form.getValues("payFrom.wallet")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-1 text-primary sm:items-center">
                  <InfoIcon className="size-5 sm:size-4" />

                  <p className="font-light text-xs">
                    Only send {"USDT"} to this address. Ensure the sender is on
                    the {"CELO"} network otherwise you might lose your deposit
                  </p>
                </div>
              </section>
            </StepperContent>

            <StepperContent className="space-y-6" value="success">
              <TransactionProcessed transactionId={transactionId} />
            </StepperContent>

            <div className="mt-4 flex justify-between *:w-full *:rounded-full *:py-5">
              {step === "recipient-details-2" && (
                <Button type="submit">
                  <LoadingSwap isLoading={form.formState.isSubmitting}>
                    Next
                  </LoadingSwap>
                </Button>
              )}
              {step === "success" && (
                <Button
                  className="text-primary"
                  onClick={() => setStep("convert")}
                  type="button"
                  variant="link"
                >
                  Go to dashboard
                </Button>
              )}
              {step !== "recipient-details-2" && step !== "success" && (
                <StepperNext asChild>
                  <Button type="button">
                    {step === "recipient-details-1" ? "Next" : "Convert Now"}
                  </Button>
                </StepperNext>
              )}
            </div>
          </Stepper>
        </form>
      </Form>
    </div>
  );
}
