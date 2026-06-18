import React, { useState, useEffect, useContext } from 'react';
import { ShippingContext } from './ShippingContext';
import '../pages/admin/Admin.css';

const ShippingRatesModal = ({ isOpen, onClose }) => {
  const { shippingRates, updateRates } = useContext(ShippingContext);
  const [localRates, setLocalRates] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (shippingRates) {
      setLocalRates(shippingRates);
    }
  }, [shippingRates]);

  if (!isOpen || !shippingRates) return null;

  const handleChange = (key, value) => {
    setLocalRates({
      ...localRates,
      [key]: { ...localRates[key], rate: parseInt(value, 10) || 0 }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRates(localRates);
      onClose();
    } catch (error) {
      console.error("Failed to update rates", error);
      alert("Failed to save rates.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
        <h3>Manage Shipping Rates</h3>
        <p style={{marginBottom: '20px', fontSize: '0.9rem'}}>Update the flat-rate shipping costs for different regions in India.</p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', marginBottom: '20px'}}>
          {Object.entries(localRates).map(([key, data]) => (
            <div key={key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dfe4ea'}}>
              <span style={{fontWeight: 'bold', color: '#2f3542'}}>{data.name}</span>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '5px', fontWeight: 'bold'}}>₹</span>
                <input 
                  type="number" 
                  value={data.rate} 
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{width: '80px', padding: '5px', borderRadius: '5px', border: '1px solid #dfe4ea'}}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-sm btn-secondary" style={{padding: '10px 20px', fontSize: '1rem', background: '#f1f2f6', color: '#2f3542', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="btn-sm btn-primary" style={{padding: '10px 20px', fontSize: '1rem', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>
            {isSaving ? 'Saving...' : 'Save Rates'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingRatesModal;
