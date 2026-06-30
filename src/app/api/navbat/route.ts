import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { ism, telefon, izoh } = data;

    if (!ism || !telefon) {
      return NextResponse.json(
        { ok: false, error: "Ism va telefon majburiy" },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { ok: false, error: "Server sozlanmagan" },
        { status: 500 }
      );
    }

    const purchaseParams = new URLSearchParams({
      ism: ism,
      telefon: telefon,
      izoh: izoh || "",
    });
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://fayzplus.uz";
    const purchaseLink = `${siteUrl}/admin/purchase?${purchaseParams.toString()}`;

    const text =
      `🩺 <b>Yangi konsultatsiya so'rovi</b>\n\n` +
      `👤 <b>Ism-sharif:</b> ${ism}\n` +
      `📞 <b>Telefon:</b> ${telefon}\n` +
      `📝 <b>Murojaat:</b> ${izoh || "—"}\n\n` +
      `<a href="${purchaseLink}">Purchase</a>`;

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const tgRes = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      }),
    });

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error("Telegram error:", err);
      return NextResponse.json(
        { ok: false, error: "Telegram'ga yuborib bo'lmadi" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json(
      { ok: false, error: "Xatolik yuz berdi" },
      { status: 500 }
    );
  }
}