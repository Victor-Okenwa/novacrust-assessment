import { NovacrustIcon } from "~/assets/icons";

interface TransactionProcessedProps {
    transactionId: string;
}

export function TransactionProcessed({ transactionId }: TransactionProcessedProps) {
    return (
        <section className="space-y-8">
            <div>
                <NovacrustIcon />
            </div>
        </section>
    );
};