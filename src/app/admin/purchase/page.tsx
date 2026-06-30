import PurchaseForm from '@/components/PurchaseForm';

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export default async function PurchasePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const secret = process.env.ADMIN_SECRET?.trim();
  const providedKey = readParam(params.key);
  const initialIsm = readParam(params.ism);
  const initialTelefon = readParam(params.telefon);
  const initialIzoh = readParam(params.izoh);

  if (!secret) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f6faf8', color: '#133126' }}>
        <div style={{ maxWidth: 560, background: '#fff', border: '1px solid #dce9e4', borderRadius: 18, padding: 28 }}>
          <h1 style={{ marginTop: 0, marginBottom: 10, fontSize: 24 }}>Sozlash xatoligi</h1>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            ADMIN_SECRET environment variable mavjud emas. Vercelga ushbu o‘zgaruvchini qo‘shing.
          </p>
        </div>
      </main>
    );
  }

  if (providedKey !== secret) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f6faf8' }}>
        <div style={{ width: '100%', maxWidth: 480, background: '#fff', border: '1px solid #dce9e4', borderRadius: 18, padding: 28, boxShadow: '0 18px 45px rgba(19,49,38,0.07)' }}>
          <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 24, color: '#133126' }}>Admin kirish</h1>
          <p style={{ marginTop: 0, marginBottom: 16, color: '#648176', lineHeight: 1.7 }}>
            Purchase sahifasiga kirish uchun admin parolni kiriting.
          </p>
          <form method="GET" action="/admin/purchase">
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#3a5c4b', marginBottom: 8 }}>Parol</label>
            <input name="key" type="password" placeholder="Parolni kiriting" style={{ width: '100%', border: '1px solid #d8e7e0', borderRadius: 10, padding: '11px 12px', marginBottom: 14, fontSize: 14 }} />
            <button type="submit" style={{ width: '100%', border: 'none', borderRadius: 12, padding: '13px 16px', background: '#1d9e75', color: '#fff', fontSize: 14, fontWeight: 700 }}>
              Kirish
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <PurchaseForm
      accessKey={providedKey}
      initialValues={{
        ism: initialIsm,
        telefon: initialTelefon,
        izoh: initialIzoh,
      }}
    />
  );
}
