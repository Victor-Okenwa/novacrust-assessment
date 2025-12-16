"use client";

import { useState } from "react";
import { CashToCryptoTab } from "~/components/cash-to-crypto-tab";
import { ComingSoon } from "~/components/coming-soon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { ConvertCurrencyStepType } from "~/lib/constants";

export default function HomePage() {
  const [convertCurrencyStep, setConvertCurrencyStep] =
    useState<ConvertCurrencyStepType>("convert");

  return (
    <main className="flex min-h-screen justify-center">
      <div className="min-w-full px-2 py-5 sm:min-w-sm">
        <Tabs className="lg:col-span-3" defaultValue="crypto-to-cash">
          {convertCurrencyStep === "convert" && (
            <TabsList className="mx-auto h-fit w-full max-w-sm *:py-2 *:text-sm">
              <TabsTrigger value="crypto-to-cash">Crypto to cash</TabsTrigger>
              <TabsTrigger value="cash-to-crypto">Cash to crypto</TabsTrigger>
              <TabsTrigger value="cash-to-fiat-loan">
                Cash to fiat loan
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent className="" value="crypto-to-cash">
            <CashToCryptoTab
              setStep={setConvertCurrencyStep}
              step={convertCurrencyStep}
            />
          </TabsContent>

          <TabsContent value="cash-to-crypto">
            <ComingSoon pageName="Cash to Crypto" />
          </TabsContent>
          <TabsContent value="cash-to-fiat-loan">
            <ComingSoon pageName="Cash to fiat loan" />
          </TabsContent>
        </Tabs>
      </div>

      <div className="col-span-2">{/* <h1>Hello</h1> */}</div>
    </main>
  );
}
