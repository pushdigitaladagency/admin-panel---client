'use client';

import React, { createContext, useContext, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  const confirmDelete = (msg, callback) => {
    setMessage(msg);
    setOnConfirmCallback(() => callback);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirmDelete }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Confirm Deletion"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Delete
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
          {message}
        </p>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
