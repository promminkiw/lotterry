'use client';
import React, { useState } from 'react';
import { Purchase } from '@/types';
import { formatUtils } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { MdEdit, MdDelete, MdViewList } from 'react-icons/md';

interface PurchaseTableProps {
  purchases: Purchase[]; onEdit: (p: Purchase) => void;
  onDelete: (id: string) => Promise<void>; isLoading?: boolean;
}

export const PurchaseTable: React.FC<PurchaseTableProps> = ({ purchases, onEdit, onDelete, isLoading }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const del = async (id: string) => { setDeletingId(id); try { await onDelete(id); } finally { setDeletingId(null); } };

  if (!purchases.length) return (
    <div className="empty">
      <div className="empty-icon"><MdViewList size={48} style={{ opacity: 0.3 }} /></div>
      <div className="empty-title">ยังไม่มีรายการซื้อ</div>
      <div className="empty-sub">กดปุ่ม "เพิ่มรายการ" ด้านบน</div>
    </div>
  );

  // Mobile card view
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {purchases.map((p) => (
          <div key={p.id} className="panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--base-500)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {p.customerName}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.08em', marginTop: '0.25rem' }} className="mono">
                  {formatUtils.formatNumber(p.numberValue, p.numberType)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${p.numberType === '2-digit' ? 'badge-blue' : 'badge-amber'}`}>
                  {p.numberType === '2-digit' ? '2 ตัว' : '3 ตัว'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--base-500)', fontWeight: 600, textTransform: 'uppercase' }}>เงิน</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--green)', fontWeight: 600 }} className="mono">
                  {formatUtils.formatCurrency(p.amount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--base-500)', fontWeight: 600, textTransform: 'uppercase' }}>วันที่</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--base-400)' }} className="mono">
                  {formatUtils.formatDate(p.createdAt)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Button variant="ghost" size="xs" onClick={() => onEdit(p)} disabled={isLoading || deletingId === p.id} style={{ flex: 1 }}>
                <MdEdit size={14} /> แก้ไข
              </Button>
              <Button variant="danger" size="xs" onClick={() => del(p.id)} isLoading={deletingId === p.id} style={{ flex: 1 }}>
                <MdDelete size={14} /> ลบ
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อลูกค้า</th>
            <th style={{ textAlign: 'center' }}>ประเภท</th>
            <th style={{ textAlign: 'center' }}>เลข</th>
            <th style={{ textAlign: 'right' }}>จำนวนเงิน</th>
            <th>วันที่</th>
            <th style={{ textAlign: 'right' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p, i) => (
            <tr key={p.id}>
              <td style={{ color: 'var(--base-600)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', width: 40 }}>{String(i + 1).padStart(2, '0')}</td>
              <td style={{ color: 'var(--base-100)', fontWeight: 500 }}>{p.customerName}</td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${p.numberType === '2-digit' ? 'badge-blue' : 'badge-amber'}`}>
                  {p.numberType === '2-digit' ? '2 ตัว' : '3 ตัว'}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className="mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.12em' }}>
                  {formatUtils.formatNumber(p.numberValue, p.numberType)}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className="mono" style={{ color: 'var(--green)', fontWeight: 600 }}>
                  {formatUtils.formatCurrency(p.amount)}
                </span>
              </td>
              <td style={{ color: 'var(--base-500)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                {formatUtils.formatDate(p.createdAt)}
              </td>
              <td>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  <Button variant="ghost" size="xs" onClick={() => onEdit(p)} disabled={isLoading || deletingId === p.id}><MdEdit size={12} /></Button>
                  <Button variant="danger" size="xs" onClick={() => del(p.id)} isLoading={deletingId === p.id}><MdDelete size={12} /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};