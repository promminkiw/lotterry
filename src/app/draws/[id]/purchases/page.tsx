'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PurchaseForm } from '@/components/forms/PurchaseForm';
import { PurchaseTable } from '@/components/tables/PurchaseTable';
import { Draw, Purchase, CreatePurchaseInput } from '@/types';
import { drawService } from '@/services/drawService';
import { purchaseService } from '@/services/purchaseService';
import { formatUtils } from '@/utils/format';
import {
  MdArrowBack as ArrowBack,
  MdAdd as Plus,
  MdClose as Close,
  MdBarChart as BarChart3,
  MdDescription as FileText,
  MdCheckCircle as CheckCircle,
  MdCancel as XCircle,
} from 'react-icons/md';

export default function PurchasesPage() {
  const params = useParams();
  const drawId = params.id as string;

  const [draw, setDraw] = useState<Draw | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  useEffect(() => { loadData(); }, [drawId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const drawData = await drawService.getDrawById(drawId);
      setDraw(drawData);
      if (drawData) {
        const purchasesData = await purchaseService.getPurchasesByDrawId(drawId);
        setPurchases(purchasesData);
      }
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchase = async (input: CreatePurchaseInput) => {
    try {
      setIsSubmitting(true);
      if (editingPurchase) {
        await purchaseService.updatePurchase(editingPurchase.id, input);
        setPurchases((prev) => prev.map((p) => p.id === editingPurchase.id ? { ...p, ...input } : p));
        setToast({ message: 'อัปเดตรายการซื้อสำเร็จ', type: 'success' });
        setEditingPurchase(null);
      } else {
        const newPurchase = await purchaseService.createPurchase(drawId, input);
        setPurchases((prev) => [newPurchase, ...prev]);
        setToast({ message: 'เพิ่มรายการซื้อสำเร็จ', type: 'success' });
      }
      setShowForm(false);
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการบันทึก', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePurchase = async (purchaseId: string) => {
    try {
      await purchaseService.deletePurchase(purchaseId);
      setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));
      setToast({ message: 'ลบรายการซื้อสำเร็จ', type: 'success' });
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการลบ', type: 'error' });
    }
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setShowForm(true);
  };

  const handleCancel = () => { setShowForm(false); setEditingPurchase(null); };

  if (loading) return <LoadingSpinner />;

  if (!draw) {
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--accent-red)' }}>ไม่พบงวดนี้</p>
        <Link href="/draws">
          <Button variant="secondary" size="sm" style={{ marginTop: '1rem' }}>
            <ArrowBack size={14} /> กลับไปหน้างวด
          </Button>
        </Link>
      </div>
    );
  }

  const isOpen = draw.status === 'open';
  const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }} className="animate-fadeIn">
      {/* Back */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/draws">
          <Button variant="secondary" size="sm">
            <ArrowBack size={14} /> กลับหน้างวด
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{draw.name}</h1>
            <span className={`badge ${isOpen ? 'badge-success' : 'badge-danger'}`}>
              {isOpen ? <CheckCircle size={10} /> : <XCircle size={10} />}
              {formatUtils.getStatusLabel(draw.status)}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            วันที่ {formatUtils.formatDate(draw.drawDate)} · {purchases.length} รายการ · {formatUtils.formatCurrency(totalAmount)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/draws/${drawId}/summary`}>
            <Button variant="secondary" size="sm"><BarChart3 size={13} /> สรุปเลข</Button>
          </Link>
          <Link href={`/draws/${drawId}/report`}>
            <Button variant="secondary" size="sm"><FileText size={13} /> รายงาน</Button>
          </Link>
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => { setEditingPurchase(null); setShowForm(!showForm); }}
          >
            {showForm ? <><Close size={14} /> ยกเลิก</> : <><Plus size={14} /> เพิ่มรายการ</>}
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card animate-slideIn" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            {editingPurchase ? 'แก้ไขรายการซื้อ' : 'เพิ่มรายการซื้อใหม่'}
          </h3>
          <PurchaseForm
            onSubmit={handleAddPurchase}
            isLoading={isSubmitting}
            initialData={editingPurchase ? {
              customerName: editingPurchase.customerName,
              numberType: editingPurchase.numberType,
              numberValue: editingPurchase.numberValue,
              amount: editingPurchase.amount,
            } : undefined}
          />
          {editingPurchase && (
            <button
              onClick={handleCancel}
              style={{ marginTop: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', fontSize: '0.8rem', padding: '4px 0' }}
            >
              ยกเลิกการแก้ไข
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          รายการซื้อทั้งหมด ({purchases.length})
        </h3>
        <PurchaseTable
          purchases={purchases}
          onEdit={handleEditPurchase}
          onDelete={handleDeletePurchase}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
