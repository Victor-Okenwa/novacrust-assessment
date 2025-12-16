import { NextResponse } from "next/server";

/**
 * Supported fiat currencies
 */
const FIATS = ["usd", "ngn", "gbp", "eur", "ghs"] as const;
type Fiat = (typeof FIATS)[number];

/**
 * Fallback USD prices (used when network fails)
 */
const FALLBACK_PRICES_USD: Record<string, number> = {
  ethereum: 3200,
  binancecoin: 600,
  celo: 0.75,
  toncoin: 5.5,
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const crypto = searchParams.get("crypto"); // e.g. ethereum
  const fiat = searchParams.get("fiat")?.toLowerCase() as Fiat | undefined;

  if (!(crypto && fiat && FIATS.includes(fiat))) {
    return NextResponse.json(
      { error: "Invalid crypto or fiat" },
      { status: 400 }
    );
  }

  try {
    const cryptoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd,${fiat}`,
      { next: { revalidate: 30 } }
    );

    if (!cryptoRes.ok) {
      throw new Error("Live crypto fetch failed");
    }

    const cryptoData = await cryptoRes.json();

    const directRate = cryptoData?.[crypto]?.[fiat];
    const usdRate = cryptoData?.[crypto]?.usd;

    if (directRate) {
      return NextResponse.json({
        crypto,
        fiat,
        rate: directRate,
        source: "live",
      });
    }

    if (usdRate) {
      const fiatRes = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=${fiat}`,
        { next: { revalidate: 30 } }
      );

      if (!fiatRes.ok) {
        throw new Error("USD fallback failed");
      }

      const fiatData = await fiatRes.json();
      const usdToFiat = fiatData?.usd?.[fiat];

      if (usdToFiat) {
        return NextResponse.json({
          crypto,
          fiat,
          rate: usdRate * usdToFiat,
          source: "usd-fallback",
        });
      }
    }

    throw new Error("No live rate available");
  } catch (_error) {
    /**
     * 2️⃣ HARD FALLBACK (demo-proof)
     */
    const fallbackUsd = FALLBACK_PRICES_USD[crypto];

    if (!fallbackUsd) {
      return NextResponse.json(
        { error: "No fallback price available" },
        { status: 500 }
      );
    }

    // Convert fallback USD → fiat
    let finalRate = fallbackUsd;

    if (fiat !== "usd") {
      try {
        const fiatRes = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=${fiat}`,
          { next: { revalidate: 60 } }
        );

        if (fiatRes.ok) {
          const fiatData = await fiatRes.json();
          const usdToFiat = fiatData?.usd?.[fiat];
          if (usdToFiat) {
            finalRate *= usdToFiat;
          }
        }
      } catch {
        // Worst case: leave it in USD-equivalent
      }
    }

    return NextResponse.json({
      crypto,
      fiat,
      rate: finalRate,
      source: "static-fallback",
    });
  }
}
