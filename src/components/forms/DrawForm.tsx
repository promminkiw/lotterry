'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CreateDrawInput } from '@/types';
import { formatUtils } from '@/utils/format';

interface DrawFormProps {
  onSubmit: (data: CreateDrawInput) => Promise<void>;
  isLoading?: boolean; initialData?: CreateDrawInput;
}

export const DrawForm: React.FC<DrawFormProps> = ({ onSubmit, isLoading = false, initialData }) => {
  const [data, setData] = useState<CreateDrawInput>(
    initialData || { name: '', drawDate: formatUtils.formatDateToISO(new Date()) }
  );
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const set = (k: keyof CreateDrawInput, v: string) => setData(p => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (data.name.trim() && data.drawDate) await onSubmit(data); };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.875rem' }}>
      <div className="field" style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
        <label className="label">ชื่องวด</label>
        <input className="input" type="text" value={data.name} onChange={e => set('name', e.target.value)} placeholder="เช่น งวด 16/03/2569" required autoFocus />
      </div>
      <div className="field">
        <label className="label">วันที่ออกรางวัล</label>
        <input className="input" type="date" value={data.drawDate} onChange={e => set('drawDate', e.target.value)} required />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: isMobile ? '1' : '2' }}>
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading} style={{ width: '100%', minHeight: '44px' }}>
          {initialData ? 'อัปเดตงวด' : 'สร้างงวด'}
        </Button>
      </div>
    </form>
  );
};