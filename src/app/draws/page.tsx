'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DrawForm } from '@/components/forms/DrawForm';
import { DrawList } from '@/components/draws/DrawList';
import { CreateDrawInput } from '@/types';
import { drawService } from '@/services/drawService';
import { purchaseService } from '@/services/purchaseService';
import { useDraws } from '@/hooks/useData';
import {
  MdAdd as Plus,
  MdClose as Close,
  MdDelete as Trash2,
} from 'react-icons/md';

export default function DrawsPage() {
  const { draws, loading, refetch } = useDraws();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ drawId: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateDraw = async (input: CreateDrawInput) => {
    try {
      setIsSubmitting(true);
      await drawService.createDraw(input);
      setShowForm(false);
      setToast({ message: 'สร้างงวดใหม่สำเร็จ', type: 'success' });
      refetch(); // Refetch to get updated list
    } catch (error) {
      console.error('Error creating draw:', error);
      setToast({
        message: 'เกิดข้อผิดพลาดในการสร้างงวด',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDraw = async (drawId: string) => {
    const draw = draws.find((d) => d.id === drawId);
    if (draw) {
      setDeleteModal({ drawId, name: draw.name });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    try {
      setIsDeleting(true);
      await purchaseService.deleteAllPurchasesForDraw(deleteModal.drawId);
      await drawService.deleteDraw(deleteModal.drawId);
      setDeleteModal(null);
      setToast({ message: 'ลบงวดสำเร็จ', type: 'success' });
      refetch(); // Refetch to get updated list
    } catch (error) {
      console.error('Error deleting draw:', error);
      setToast({
        message: 'เกิดข้อผิดพลาดในการลบงวด',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="full-loader">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">จัดการงวด</h1>
          <p className="page-sub">สร้างและจัดการงวด</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="whitespace-nowrap"
        >
          {showForm ? (
            <>
              <Close size={18} />
              ยกเลิก
            </>
          ) : (
            <>
              <Plus size={18} />
              สร้างงวดใหม่
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem' }}>
          <Card title="สร้างงวดใหม่">
            <DrawForm onSubmit={handleCreateDraw} isLoading={isSubmitting} />
          </Card>
        </div>
      )}

      <Card title={`จำนวนงวดทั้งหมด: ${draws.length}`}>
        <DrawList
          draws={draws}
          onDelete={handleDeleteDraw}
        />
      </Card>

      <Modal
        isOpen={deleteModal !== null}
        title="ยืนยันการลบงวด"
        confirmText="ลบเลย"
        isDangerous={true}
        isLoading={isDeleting}
        onClose={() => setDeleteModal(null)}
        onConfirm={confirmDelete}
      >
        <p style={{ color: 'var(--base-200)', marginBottom: '0.75rem' }}>
          คุณแน่ใจว่าต้องการลบงวด <strong style={{ color: 'var(--base-50)' }}>{deleteModal?.name}</strong> หรือไม่?
        </p>
        <div className="err-box" style={{ alignItems: 'flex-start' }}>
          <Trash2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>ข้อมูลรายการซื้อและข้อมูลสรุปทั้งหมดของงวดนี้จะถูกลบออกไปด้วย</span>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
