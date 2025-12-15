import { CashToCryptoTab } from "~/components/cash-to-crypto-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function HomePage() {
	return (
		<main className="min-h-screen">

			<div className="py-5 px-2">
				<Tabs defaultValue="crypto-to-cash" className="max-w-lg col-span-3">
					<TabsList className="w-full max-w-sm *:text-sm h-fit *:py-2 mx-auto">
						<TabsTrigger value="crypto-to-cash">Crypto to cash</TabsTrigger>
						<TabsTrigger value="cash-to-crypto">Cash to crypto</TabsTrigger>
						<TabsTrigger value="cash-to-fiat-loan">Cash to fiat loan</TabsTrigger>
					</TabsList>

					<TabsContent value="crypto-to-cash" className="mx-auto max-w-lg">
						<CashToCryptoTab />
					</TabsContent>

					<TabsContent value="cash-to-crypto">Change your password here.</TabsContent>
					<TabsContent value="cash-to-fiat-loan">Change your password here.</TabsContent>
				</Tabs>
			</div>

			<div className="col-span-2">
				<h1>Hello</h1>
			</div>
		</main>
	);
}
