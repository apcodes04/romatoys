import React, { useState, useEffect, useContext } from 'react';
import { SettingsContext } from './SettingsContext';
import '../pages/admin/Admin.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { shippingRates, updateShippingRates, paymentSettings, updatePaymentSettings } = useContext(SettingsContext);
  
  const [activeTab, setActiveTab] = useState('shipping');
  
  // Shipping State
  const [localRates, setLocalRates] = useState({});
  const [isSavingShipping, setIsSavingShipping] = useState(false);

  // Payment State
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isUploadingQR, setIsUploadingQR] = useState(false);

  useEffect(() => {
    if (shippingRates) setLocalRates(shippingRates);
  }, [shippingRates]);

  useEffect(() => {
    if (paymentSettings?.qrCodeUrl) setQrCodeUrl(paymentSettings.qrCodeUrl);
  }, [paymentSettings]);

  if (!isOpen) return null;

  // --- Shipping Handlers ---
  const handleRateChange = (key, value) => {
    setLocalRates({
      ...localRates,
      [key]: { ...localRates[key], rate: parseInt(value, 10) || 0 }
    });
  };

  const handleSaveShipping = async () => {
    setIsSavingShipping(true);
    try {
      await updateShippingRates(localRates);
      alert("Shipping rates saved successfully!");
    } catch (error) {
      console.error("Failed to update rates", error);
      alert("Failed to save rates.");
    } finally {
      setIsSavingShipping(false);
    }
  };

  // --- Payment Handlers ---
  const handleQRUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingQR(true);
    try {
      const cloudFormData = new FormData();
      cloudFormData.append('file', file);
      cloudFormData.append('upload_preset', 'cl4zbmfi');

      const response = await fetch('https://api.cloudinary.com/v1_1/dxzhhxqub/image/upload', {
        method: 'POST',
        body: cloudFormData
      });
      
      const data = await response.json();
      const newUrl = data.secure_url;
      
      setQrCodeUrl(newUrl);
      
      // Save directly to Firebase
      await updatePaymentSettings({ qrCodeUrl: newUrl });
      alert("QR Code updated successfully!");
    } catch (error) {
      console.error('Error uploading QR code:', error);
      alert('Failed to upload QR code. Please try again.');
    } finally {
      setIsUploadingQR(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '20px'}}>
        <button onClick={onClose} style={{float: 'right', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>×</button>
        <h3 style={{marginTop: '0', marginBottom: '20px'}}>Edit Store Settings</h3>
        
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f1f2f6', paddingBottom: '10px'}}>
          <button 
            onClick={() => setActiveTab('shipping')} 
            style={{padding: '8px 15px', border: 'none', background: activeTab === 'shipping' ? '#1e90ff' : '#f1f2f6', color: activeTab === 'shipping' ? 'white' : '#2f3542', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
          >
            Shipping Rates
          </button>
          <button 
            onClick={() => setActiveTab('payment')} 
            style={{padding: '8px 15px', border: 'none', background: activeTab === 'payment' ? '#1e90ff' : '#f1f2f6', color: activeTab === 'payment' ? 'white' : '#2f3542', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}
          >
            Payment QR Code
          </button>
        </div>

        {activeTab === 'shipping' && (
          <div>
            <p style={{marginBottom: '20px', fontSize: '0.9rem', color: '#57606f'}}>Update the flat-rate shipping costs for different regions in India.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '20px'}}>
              {Object.entries(localRates).map(([key, data]) => (
                <div key={key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dfe4ea'}}>
                  <span style={{fontWeight: 'bold', color: '#2f3542', fontSize: '0.9rem'}}>{data.name}</span>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '5px', fontWeight: 'bold'}}>₹</span>
                    <input 
                      type="number" 
                      value={data.rate} 
                      onChange={(e) => handleRateChange(key, e.target.value)}
                      style={{width: '70px', padding: '5px', borderRadius: '5px', border: '1px solid #dfe4ea'}}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveShipping} disabled={isSavingShipping} className="btn-sm btn-primary" style={{width: '100%', padding: '12px', fontSize: '1rem', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>
              {isSavingShipping ? 'Saving...' : 'Save Shipping Rates'}
            </button>
          </div>
        )}

        {activeTab === 'payment' && (
          <div>
            <p style={{marginBottom: '20px', fontSize: '0.9rem', color: '#57606f'}}>Upload a new UPI/Bank QR code for the secure checkout page.</p>
            
            <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #dfe4ea', marginBottom: '20px'}}>
              <h4 style={{margin: '0 0 15px 0', color: '#2f3542'}}>Current QR Code</h4>
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Current QR" style={{maxWidth: '200px', borderRadius: '8px', border: '1px solid #ccc'}} />
              ) : (
                <p>No QR code set.</p>
              )}
            </div>

            <div style={{textAlign: 'left'}}>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '10px', color: '#2f3542'}}>Upload New QR Code (Image)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleQRUpload} 
                disabled={isUploadingQR}
                style={{width: '100%', padding: '10px', border: '2px dashed #dfe4ea', borderRadius: '8px', cursor: 'pointer'}}
              />
              {isUploadingQR && <p style={{color: '#1e90ff', marginTop: '10px', fontWeight: 'bold'}}>Uploading and saving...</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
