import React from 'react';
import { MdClose } from 'react-icons/md';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean; title: string; children: React.ReactNode;
  onClose: () => void; onConfirm?: () => void;
  confirmText?: string; cancelText?: string;
  isDangerous?: boolean; isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, title, children, onClose, onConfirm,
  confirmText = 'ยืนยัน', cancelText = 'ยกเลิก',
  isDangerous = false, isLoading = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <span className="dialog-title">{title}</span>
          <button className="icon-btn" onClick={onClose}><MdClose size={16} /></button>
        </div>
        <div className="dialog-body">{children}</div>
        <div className="dialog-footer">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
          {onConfirm && (
            <Button variant={isDangerous ? 'danger' : 'primary'} size="sm" onClick={onConfirm} isLoading={isLoading}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};