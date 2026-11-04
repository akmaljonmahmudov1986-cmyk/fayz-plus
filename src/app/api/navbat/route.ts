import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function sha256(v: string) {
  return createHash("sha256").update(v).digest("hex");
}

// Lead hodisasini Meta Conversions API orqali serverdan yuboradi.
// Kasallik matni (izoh) HECH QACHON Metaga yuborilmaydi.
async function sendMetaLead(req: NextRequest, d: {
  src: string; telefon: string; ism: string; eventId?: string; fbp?: string; fbc?: string; pageUrl?: string;
}) {
  const isNevro = d.src === "nevro";
  const pixelId = (isNevro ? process.env.META_PIXEL_ID_NEVRO : process.env.META_PIXEL_ID)?.trim();
  const token = (isNevro ? process.env.META_CAPI_TOKEN_NEVRO : process.env.META_CAPI_TOKEN)?.trim();
  if (!pixelId || !token) return;

  let phone = d.telefon.replace(/\D/g, "");
  if (phone.length === 9) phone = "998" + phone;
  const firstName = d.ism.trim().split(/\s+/)[0]?.toLowerCase() || "";

  const user_data: Record<string, unknown> = {
    ph: [sha256(phone)],
    client_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    client_user_agent: req.headers.get("user-agent") || undefined,
    country: [sha256("uz")],
  };
  if (firstName) user_data.fn = [sha256(firstName)];
  if (d.fbp) user_data.fbp = d.fbp;
  if (d.fbc) user_data.fbc = d.fbc;

  const body: Record<string, unknown> = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: d.eventId,
      action_source: "website",
      event_source_url: d.pageUrl || "https://www.fayzplus.uz",
      user_data,
    }],
  };
  const test = process.env.META_TEST_EVENT_CODE?.trim();
  if (test) body.test_event_code = test;

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) console.error("Meta CAPI Lead error:", await r.text());
  } catch (e) {
    console.error("Meta CAPI Lead exception:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { ism, telefon, izoh, eventId, fbp, fbc, pageUrl } = data;
    const src = data.src === "nevro" ? "nevro" : "fayz";

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

    const adminKey = process.env.ADMIN_SECRET?.trim() || "";
    const purchaseParams = new URLSearchParams({
      key: adminKey,
      ism: ism,
      telefon: telefon,
    });
    const purchaseLink = `https://www.fayzplus.uz/admin/purchase?${purchaseParams.toString()}`;

    const text =
      `🩺 <b>Yangi konsultatsiya so'rovi</b>\n\n` +
      `👤 <b>Ism-sharif:</b> ${ism}\n` +
      `📞 <b>Telefon:</b> ${telefon}\n` +
      `🏷 <b>Manba:</b> ${src === "nevro" ? "Nevro Help" : "Fayz Plus"}\n` +
      `📝 <b>Murojaat:</b> ${izoh || "—"}\n\n` +
      `<a href="${purchaseLink}">Purchase yuborish</a>`;

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

    await sendMetaLead(req, { src, telefon: String(telefon), ism: String(ism), eventId, fbp, fbc, pageUrl });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json(
      { ok: false, error: "Xatolik yuz berdi" },
      { status: 500 }
    );
  }
}