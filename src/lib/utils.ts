import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") return;

  const textarea = document.createElement("textarea")
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";

  document.body.appendChild(textarea);

  const selection = document.getSelection()
  const selectedRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  textarea.select()

  try {
    document.execCommand("copy")
  } finally {
    document.body.removeChild(textarea)

    if (selectedRange && selection) {
      selection.removeAllRanges()
      selection.addRange(selectedRange)
    }
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
  charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
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


