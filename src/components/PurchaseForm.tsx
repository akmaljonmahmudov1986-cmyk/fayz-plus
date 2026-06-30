'use client';

import { useMemo, useState } from 'react';

type PurchaseFormProps = {
  initialValues: {
    ism: string;
    telefon: string;
    izoh: string;
  };
  accessKey: string;
};

const colors = {
  bg: '#f6faf8',
  panel: '#ffffff',
  border: '#dce9e4',
  green: '#1d9e75',
  greenDark: '#157a5a',
  text: '#133126',
  muted: '#648176',
  red: '#d9534f',
};

export default function PurchaseForm({ initialValues, accessKey }: PurchaseFormProps) {
  const [ism, setIsm] = useState(initialValues.ism);
  const [familiya, setFamiliya] = useState('');
  const [telefon, setTelefon] = useState(initialValues.telefon);
  const [summa, setSumma] = useState('');
  const [valyuta, setValyuta] = useState('UZS');
  const [izoh, setIzoh] = useState(initialValues.izoh);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsedValue = Number.parseFloat(summa.replace(/,/g, '.'));

    if (!ism.trim() || !telefon.trim() || !Number.isFinite(parsedValue) || parsedValue <= 0) {
      setStatus('error');
      setMessage('Ism, telefon va toʻgʻri summa majburiy.');
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ism: ism.trim(),
          familiya: familiya.trim(),
          telefon: telefon.trim(),
          summa: parsedValue,
          valyuta,
          izoh: izoh.trim(),
          key: accessKey,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Purchase yuborilmadi.');
      }

      setStatus('success');
      setMessage('Purchase yuborildi ✓');
      setSumma('');
      setIzoh('');
      setFamiliya('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Nomaʼlum xatolik.');
    }
  };

  const buttonText = useMemo(() => {
    if (status === 'sending') return 'Yuborilmoqda...';
    return 'Purchase yuborish (Meta)';
  }, [status]);

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, padding: '32px 16px 56px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 20, boxShadow: '0 18px 45px rgba(19,49,38,0.07)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #eaf7f2 0%, #f8fcfa 100%)', padding: '28px 24px 20px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '2px', color: colors.green, fontWeight: 700, marginBottom: 8 }}>Fayz Plyus</div>
          <h1 style={{ margin: 0, fontSize: 28, color: colors.text, fontWeight: 800 }}>Mijoz toʻlovi qayd etish</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: colors.muted, lineHeight: 1.7 }}>Purchase hodisasini Meta Conversions API orqali yuboring va bemor toʻlovini tezkor qayd eting.</p>
        </div>

        <form onSubmit={submit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div>
                <label style={labelStyle}>Ism</label>
                <input value={ism} onChange={(e) => setIsm(e.target.value)} placeholder="Masalan: Jasur" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Familiya</label>
                <input value={familiya} onChange={(e) => setFamiliya(e.target.value)} placeholder="Ixtiyoriy" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div>
                <label style={labelStyle}>Telefon raqam</label>
                <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+998..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Summa</label>
                <input type="number" min="0" step="0.01" value={summa} onChange={(e) => setSumma(e.target.value)} placeholder="Masalan: 500000" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div>
                <label style={labelStyle}>Valyuta</label>
                <select value={valyuta} onChange={(e) => setValyuta(e.target.value)} style={inputStyle}>
                  <option value="UZS">UZS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Qoʻshimcha izoh</label>
                <input value={izoh} onChange={(e) => setIzoh(e.target.value)} placeholder="Operatsiya turi" style={inputStyle} />
              </div>
            </div>

            {message ? (
              <div style={{
                padding: '12px 14px',
                borderRadius: 10,
                fontSize: 14,
                border: status === 'success' ? `1px solid ${colors.green}` : `1px solid ${colors.red}`,
                background: status === 'success' ? '#edf9f4' : '#fdf0f0',
                color: status === 'success' ? colors.greenDark : colors.red,
              }}>
                {message}
              </div>
            ) : null}

            <button type="submit" disabled={status === 'sending'} style={{
              ...buttonStyle,
              opacity: status === 'sending' ? 0.7 : 1,
              cursor: status === 'sending' ? 'wait' : 'pointer',
            }}>
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: '#3a5c4b',
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #d8e7e0',
  borderRadius: 10,
  padding: '11px 12px',
  fontSize: 14,
  color: '#143127',
  background: '#fff',
  outline: 'none',
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 12,
  padding: '13px 16px',
  background: '#1d9e75',
  color: '#fff',
  fontSize: 14,
  fontWeight: 700,
  boxShadow: '0 12px 24px rgba(29, 158, 117, 0.2)',
};
