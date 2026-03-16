'use client';
import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { Draw } from '@/types';
import { formatUtils } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { MdRemoveRedEye, MdBarChart, MdDescription, MdDelete, MdCheckCircle, MdCancel, MdCalendarMonth, MdViewAgenda } from 'react-icons/md';

interface DrawListProps { draws: Draw[]; onDelete: (id: string) => Promise<void>; }

const DrawCard = memo(({ draw, isDeleting, onDelete }: { draw: Draw; isDeleting: boolean; onDelete: (id: string) => Promise<void>; }) => {
  const del = useCallback(async () => { await onDelete(draw.id); }, [draw.id, onDelete]);
  const isOpen = draw.status === 'open';

  return (
    <div className="panel fade-up" style={{ padding: '1.25rem', transition: 'border-color 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.15)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
    >
      {isOpen && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--green),transparent)' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--base-50)', flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{draw.name}</h3>
        <span className={`badge ${isOpen ? 'badge-green' : 'badge-muted'}`}>
          {isOpen ? <MdCheckCircle size={10} /> : <MdCancel size={10} />}
          {formatUtils.getStatusLabel(draw.status)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--base-500)', fontSize: '0.75rem', marginBottom: '1.1rem' }}>
        <MdCalendarMonth size={13} />
        <span className="mono">{formatUtils.formatDate(draw.drawDate)}</span>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.875rem', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <Link href={`/draws/${draw.id}/purchases`}><Button variant="ghost" size="xs"><MdRemoveRedEye size={12} />รายการ</Button></Link>
        <Link href={`/draws/${draw.id}/summary`}><Button variant="ghost" size="xs"><MdBarChart size={12} />สรุป</Button></Link>
        <Link href={`/draws/${draw.id}/report`}><Button variant="ghost" size="xs"><MdDescription size={12} />รายงาน</Button></Link>
        <div style={{ marginLeft: 'auto' }}>
          <Button variant="danger" size="xs" onClick={del} isLoading={isDeleting}><MdDelete size={12} />ลบ</Button>
        </div>
      </div>
    </div>
  );
});
DrawCard.displayName = 'DrawCard';

export const DrawList: React.FC<DrawListProps> = ({ draws, onDelete }) => {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try { await onDelete(id); } finally { setDeletingId(null); }
  }, [onDelete]);

  if (!draws.length) return (
    <div className="empty">
      <div className="empty-icon"><MdViewAgenda size={48} style={{ opacity: 0.3 }} /></div>
      <div className="empty-title">ยังไม่มีงวดใด ๆ</div>
      <div className="empty-sub">กดปุ่ม "สร้างงวด" เพื่อเริ่มต้น</div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
      {draws.map((d, i) => (
        <div key={d.id} style={{ animationDelay: `${i * 0.04}s` }}>
          <DrawCard draw={d} isDeleting={deletingId === d.id} onDelete={handleDelete} />
        </div>
      ))}
    </div>
  );
};