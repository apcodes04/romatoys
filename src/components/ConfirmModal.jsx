import React from 'react';
import '../pages/admin/Admin.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-sm btn-secondary" style={{padding: '10px 20px', fontSize: '1rem', background: '#f1f2f6', color: '#2f3542', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>Cancel</button>
          <button onClick={onConfirm} className="btn-sm btn-delete" style={{padding: '10px 20px', fontSize: '1rem', background: '#ff4757', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
