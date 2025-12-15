import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const crypto = searchParams.get("crypto");
    const fiat = searchParams.get("fiat");
    console.log(crypto, fiat);

    if (!crypto || !fiat) {
        return NextResponse.json({ error: "Missing crypto or fiat" }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`
        );
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
