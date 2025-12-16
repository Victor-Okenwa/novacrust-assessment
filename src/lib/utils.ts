import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import type { CryptoTokenType, FiatTokenType } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Copies the provided content to the user's clipboard.
 *
 * Falls back to `document.execCommand("copy")` when the modern Clipboard API
 * is not available.
 *
 * @param content - The text or number value to be copied to the clipboard.
 * @returns A promise that resolves when the copy operation completes.
 */
export async function copyToClipboard(content: string | number): Promise<void> {
  const text = String(content);

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
      return;
    }

    if (typeof document === "undefined") {
      throw new Error("Clipboard API is not available in this environment");
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";

    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const selectedRange =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.select();

    document.execCommand("copy");
    toast.success("Copied to clipboard");

    document.body.removeChild(textarea);

    if (selectedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(selectedRange);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to copy to clipboard");
  } finally {
    // no-op: cleanup handled inline
  }
}

/**
 * Generates a random string of the specified length.
 *
 * By default, the string is composed of uppercase letters, lowercase letters,
 * and digits. A custom character set can be provided to override this.
 *
 * @param length - The desired length of the generated string. Must be a positive integer.
 * @param charset - Optional string of characters to sample from when generating the result.
 * @returns A randomly generated string.
 */
export function generateRandomString(
  length: number,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string {
  if (length <= 0) {
    return "";
  }

  let result = "";
  const charsetLength = charset.length;

  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * charsetLength);
    result += charset.charAt(index);
  }

  return result;
}

/**
 * Converts a crypto token to a CoinGecko ID.
 *
 * @param token - The crypto token to convert.
 * @returns The CoinGecko ID.
 */
export function cryptoToCoinGeckoId(token: CryptoTokenType): string {
  switch (token) {
    case "ETH":
      return "ethereum";
    case "BNB":
      return "binancecoin";
    case "CELO":
      return "celo";
    case "TON":
      return "ton";
    default:
      return (token as string).toLowerCase();
  }
}

/**
 * Converts a fiat token to a CoinGecko ID.
 *
 * @param token - The fiat token to convert.
 * @returns The CoinGecko ID.
 */
export function fiatToCoinGeckoId(token: FiatTokenType): string {
  return token.toLowerCase();
}
