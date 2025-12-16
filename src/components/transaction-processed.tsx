import { CheckCircle2, CopyIcon } from "lucide-react";
import { NovacrustIcon } from "~/assets/icons";
import { copyToClipboard } from "~/lib/utils";
import { Button } from "./ui/button";

type TransactionProcessedProps = {
  transactionId: string;
};

export function TransactionProcessed({
  transactionId,
}: TransactionProcessedProps) {
  return (
    <section className="space-y-8">
      <div className="flex w-full justify-center">
        <NovacrustIcon className="h-5 w-28" />
      </div>

      <div className="space-y-4">
        <div className="flex w-full justify-center">
          <CheckCircle2 className="size-16 fill-[#219653] text-background" />
        </div>

        <div className="flex flex-col gap-1 text-center">
          <h2 className="font-medium text-lg">
            Your transaction is processing.
          </h2>
          <p className="text-muted-foreground text-sm">
            The recipient will receive it shortly.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-6">
          <p className="text-muted-foreground text-sm">Transaction ID</p>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-medium text-primary">{transactionId}</span>
            <Button
              className="size-fit p-0"
              onClick={() => copyToClipboard(transactionId)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
