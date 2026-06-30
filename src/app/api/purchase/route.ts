import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseJsonBody(req: NextRequest) {
  return req.json();
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: Record<string, unknown> = {};

    if (contentType.includes('application/json')) {
      payload = await parseJsonBody(req);
    } else {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries());
    }

    const secret = process.env.ADMIN_SECRET?.trim();
    const providedKey = normalizeText(payload.key);

    if (!secret || providedKey !== secret) {
      return NextResponse.json(
        { ok: false, error: 'Admin paroli noto‘g‘ri yoki mavjud emas.' },
        { status: 401 }
      );
    }

    const ism = normalizeText(payload.ism);
    const familiya = normalizeText(payload.familiya);
    const telefon = normalizeText(payload.telefon);
    const izoh = normalizeText(payload.izoh);
    const valuta = normalizeText(payload.valyuta || 'UZS').toUpperCase();
    const summaValue = Number.parseFloat(String(payload.summa ?? '').replace(/,/g, '.'));

    if (!ism || !telefon || !Number.isFinite(summaValue) || summaValue <= 0) {
      return NextResponse.json(
        { ok: false, error: 'Ism, telefon va summa majburiy.' },
        { status: 400 }
      );
    }

    const pixelId = process.env.META_PIXEL_ID?.trim();
    const capiToken = process.env.META_CAPI_TOKEN?.trim();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || new URL(req.url).origin;

    if (!pixelId || !capiToken) {
      return NextResponse.json(
        { ok: false, error: 'Meta Conversions API sozlamalari mavjud emas.' },
        { status: 500 }
      );
    }

    const phoneHash = createHash('sha256').update(telefon).digest('hex');
    const eventTime = Math.floor(Date.now() / 1000);
    const eventId = `purchase-${eventTime}-${Math.random().toString(36).slice(2, 10)}`;
    const metaPayload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: eventTime,
          event_id: eventId,
          event_source_url: siteUrl,
          action_source: 'website',
          user_data: {
            ph: phoneHash,
          },
          custom_data: {
            currency: valuta,
            value: Number(summaValue.toFixed(2)),
            content_name: `${ism} ${familiya}`.trim(),
            content_category: izoh || 'purchase',
          },
        },
      ],
    };

    const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();
    if (testEventCode) {
      Object.assign(metaPayload, { test_event_code: testEventCode });
    }

    const metaUrl = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${capiToken}`;
    const metaRes = await fetch(metaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metaPayload),
    });

    const metaJson = await metaRes.json();
    console.log('Meta CAPI response:', JSON.stringify(metaJson, null, 2));

    if (!metaRes.ok) {
      console.error('Meta CAPI error:', metaJson);
      return NextResponse.json(
        { ok: false, error: 'Meta ga yuborishda xatolik yuz berdi.' },
        { status: 502 }
      );
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (telegramToken && telegramChatId) {
      const telegramText = `✅ Purchase qayd etildi: ${ism} ${familiya}`.trim() + `, ${summaValue} ${valuta}`;
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramText,
          parse_mode: 'HTML',
        }),
      });
    }

    return NextResponse.json({ ok: true, message: 'Purchase yuborildi.' });
  } catch (error) {
    console.error('Purchase API error:', error);
    return NextResponse.json(
      { ok: false, error: 'Xatolik yuz berdi.' },
      { status: 500 }
    );
  }
}
