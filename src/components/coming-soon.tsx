import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type ComingSoonProps = {
  pageName?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
};

const ComingSoonFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ComingSoonFormType = z.infer<typeof ComingSoonFormSchema>;

export function ComingSoon({
  pageName = "Cash to Crypto",
  title = "Coming Soon!",
  description = "Enter your email and we’ll let you know the moment it’s live.",
  ctaLabel = "Update me",
}: ComingSoonProps) {
  const form = useForm<ComingSoonFormType>({
    resolver: zodResolver(ComingSoonFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const subtitle = `${pageName} is almost here.`;

  const onSubmit = (data: ComingSoonFormType) => {
    // TODO: hook this up to a real API endpoint or integration
    console.log("Coming soon email submitted", data);
  };

  return (
    <section className="flex flex-col items-center gap-8 px-4 py-16 text-center">
      <div className="max-w-xl space-y-1">
        <h2 className="font-clash-display font-semibold text-2xl text-primary tracking-tight">
          {title}
        </h2>
        <p className="text-base text-muted-foreground">{subtitle}</p>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>

      <Form {...form}>
        <form
          className="flex w-full max-w-xl flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full text-left">
                <FormLabel className="font-semibold text-primary text-sm">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full rounded-full border px-6 py-6 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0"
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full rounded-full py-6! font-semibold text-base"
            type="submit"
            variant="default"
          >
            {ctaLabel}
          </Button>
        </form>
      </Form>
    </section>
  );
}
