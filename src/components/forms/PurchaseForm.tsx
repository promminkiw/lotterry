'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CreatePurchaseInput } from '@/types';
import { validationUtils } from '@/utils/validation';
import { MdWarning } from 'react-icons/md';

interface PurchaseFormProps {
  onSubmit: (data: CreatePurchaseInput) => Promise<void>;
  isLoading?: boolean; initialData?: CreatePurchaseInput;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const blank: CreatePurchaseInput = { customerName: '', numberType: '2-digit', numberValue: '', amount: 0 };
  const [data, setData] = useState<CreatePurchaseInput>(initialData || blank);
  const [err, setErr] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const set = (k: keyof CreatePurchaseInput, v: string | number) => { setErr(''); setData(p => ({ ...p, [k]: v })); };
  const maxLen = data.numberType === '2-digit' ? 2 : 3;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validationUtils.validatePurchaseInput(data);
    if (!v.valid) { setErr(v.error || 'ข้อมูลไม่ถูกต้อง'); return; }
    try { await onSubmit(data); setData(blank); setErr(''); }
    catch { setErr('เกิดข้อผิดพลาดในการบันทึก'); }
  };

  return (
    <form onSubmit={submit}>
      {err && <div className="err-box"><MdWarning size={14} />{err}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.875rem' }}>
        <div className="field" style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
          <label className="label">ชื่อลูกค้า / รหัส</label>
          <input className="input" type="text" value={data.customerName} onChange={e => set('customerName', e.target.value)} placeholder="ชื่อหรือรหัสลูกค้า" required autoFocus />
        </div>
        <div className="field">
          <label className="label">ประเภทเลข</label>
          <select className="input" value={data.numberType} onChange={e => set('numberType', e.target.value)}>
            <option value="2-digit">เลข 2 ตัว</option>
            <option value="3-digit">เลข 3 ตัว</option>
          </select>
        </div>
        <div className="field">
          <label className="label">เลขที่ซื้อ</label>
          <input className="input input-mono" type="text" value={data.numberValue} onChange={e => set('numberValue', e.target.value)} maxLength={maxLen} placeholder={maxLen === 2 ? '00' : '000'} required />
        </div>
        <div className="field" style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
          <label className="label">จำนวนเงิน (บาท)</label>
          <input className="input input-mono" type="number" value={data.amount || ''} onChange={e => set('amount', parseFloat(e.target.value) || 0)} placeholder="0" min="1" step="1" required />
        </div>
      </div>
      <Button type="submit" variant="primary" size="sm" isLoading={isLoading} style={{ width: '100%', minHeight: '44px', marginTop: '0.5rem' }}>
        {initialData ? 'อัปเดต' : '+ เพิ่มรายการ'}
      </Button>
    </form>
  );
};