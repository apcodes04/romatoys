import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import { SettingsContext } from '../context/SettingsContext';
import { calculateShippingCost } from '../utils/shippingCalculator';
import { optimizeImageUrl } from '../utils/optimizeImage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Checkout.css';

const Checkout = () => {
  useDocumentTitle('Secure Checkout | Roma Toys');
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const prefillPincode = location.state?.prefillPincode || '';
  const prefillShipping = location.state?.prefillShipping || 0;
  
  const { addOrder } = useContext(OrderContext);
  const { shippingRates, paymentSettings } = useContext(SettingsContext);
  const [shippingCost, setShippingCost] = useState(prefillShipping);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: prefillPincode
  });

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!product) {
    return (
      <div className="checkout-page" style={{textAlign: 'center', padding: '100px 20px'}}>
        <h2>No product selected</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">Go to Shop</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate shipping when pincode is 6 digits
    if (name === 'pincode') {
      if (value.length === 6 && /^\d+$/.test(value)) {
        const cost = calculateShippingCost(value, shippingRates);
        setShippingCost(cost);
      } else {
        setShippingCost(0); // Reset if invalid/incomplete
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const saveOrder = async (screenshotUrl = null) => {
    const orderData = {
      customerDetails: formData,
      product: {
        id: product.id,
        name: product.name,
        price: product.price
      },
      shippingCost: shippingCost,
      totalAmount: product.price + shippingCost,
      status: 'Pending Payment Verification',
      screenshotUrl: screenshotUrl
    };
    return await addOrder(orderData);
  };

  const handlePrimarySubmit = async (e) => {
    e.preventDefault();
    if (!screenshotFile) {
      alert("Please upload your payment screenshot, or use the WhatsApp option below if you are having trouble.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload screenshot to Cloudinary
      const cloudFormData = new FormData();
      cloudFormData.append('file', screenshotFile);
      cloudFormData.append('upload_preset', 'cl4zbmfi');

      const response = await fetch('https://api.cloudinary.com/v1_1/dxzhhxqub/image/upload', {
        method: 'POST',
        body: cloudFormData
      });
      
      const data = await response.json();
      const downloadUrl = data.secure_url;

      // 2. Save order
      await saveOrder(downloadUrl);

      // 3. Show success message
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppFallback = async (e) => {
    e.preventDefault();
    
    // Validate basic form before proceeding
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill in all your Shipping Information first!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderId = await saveOrder(null);

      const adminPhone = '917978823397';
      const message = `*PAID ORDER RECEIVED*%0A%0A*Order ID:* ${orderId}%0A*Product:* ${product.name}%0A*Subtotal:* ₹${product.price.toLocaleString()}%0A*Shipping:* ₹${shippingCost.toLocaleString()}%0A*Amount Paid:* ₹${(product.price + shippingCost).toLocaleString()}%0A%0A*Customer Details:*%0AName: ${formData.name}%0APhone: ${formData.phone}%0AAddress: ${formData.address}, ${formData.city} - ${formData.pincode}%0A%0A_Please find my payment screenshot attached._`;
      
      window.location.href = `https://wa.me/${adminPhone}?text=${message}`;
    } catch (error) {
      alert("There was an error processing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="checkout-page" style={{textAlign: 'center', padding: '100px 20px'}}>
        <h1 style={{color: '#2ed573', fontSize: '3rem', marginBottom: '20px'}}>🎉 Order Received!</h1>
        <h2>Thank you for your purchase, {formData.name}!</h2>
        <p style={{fontSize: '1.2rem', color: '#57606f', marginTop: '20px', maxWidth: '600px', margin: '20px auto'}}>
          We have successfully received your order and payment screenshot. Our team will verify the payment and begin processing your order shortly.
        </p>
        <Link to="/shop" className="btn btn-primary" style={{marginTop: '30px', display: 'inline-block'}}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Secure Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handlePrimarySubmit}>
              <h2>1. Shipping Information</h2>
              <div className="form-group">
                <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <textarea name="address" placeholder="Complete Delivery Address" rows="3" required value={formData.address} onChange={handleChange}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} />
                </div>
                <div className="form-group half">
                  <input type="text" name="pincode" placeholder="Pin Code" required value={formData.pincode} onChange={handleChange} />
                </div>
              </div>

              <h2 style={{marginTop: '30px'}}>2. Payment</h2>
              <div className="payment-box">
                <p style={{marginBottom: '15px', color: '#57606f'}}>Scan the QR code below using GPay, PhonePe, or Paytm to complete your purchase securely.</p>
                <div className="qr-container" style={{textAlign: 'center', background: '#fff', padding: '20px', borderRadius: '10px', border: '2px dashed #dfe4ea'}}>
                  <img src={paymentSettings?.qrCodeUrl || "/images/QRcode payment/1.jpeg?v=2"} alt="Payment QR Code" style={{maxWidth: '250px', width: '100%'}} />
                  <p style={{marginTop: '15px', fontWeight: 'bold', color: '#2f3542', fontSize: '1.2rem'}}>Amount to Pay: <span style={{color: '#ff4757'}}>₹{(product.price + shippingCost).toLocaleString()}</span></p>
                </div>
                
                <div style={{marginTop: '30px'}}>
                  <h3 style={{marginBottom: '10px'}}>3. Upload Payment Screenshot</h3>
                  <p style={{fontSize: '0.9rem', color: '#57606f', marginBottom: '10px'}}>After making the payment, upload the screenshot here to complete your order instantly.</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{width: '100%', padding: '10px', border: '1px solid #dfe4ea', borderRadius: '5px', background: '#fff', marginBottom: '20px'}}
                  />
                  
                  <button type="submit" className="btn btn-primary checkout-btn" disabled={isSubmitting} style={{background: '#2ed573'}}>
                    {isSubmitting ? 'Uploading & Processing...' : 'Submit Order & Payment Screenshot'}
                  </button>
                </div>

                <div style={{marginTop: '40px', textAlign: 'center', borderTop: '1px solid #dfe4ea', paddingTop: '20px'}}>
                  <p style={{color: '#57606f', marginBottom: '15px', fontSize: '0.9rem', fontWeight: 'bold'}}>Cannot upload screenshot right now or having trouble?</p>
                  <button type="button" onClick={handleWhatsAppFallback} disabled={isSubmitting} className="btn" style={{background: '#ff4757', color: '#ffffff', border: 'none', width: '100%', padding: '18px', fontWeight: 'bold', borderRadius: '30px', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)'}}>
                    Done with payment & cannot upload screenshot?
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="checkout-summary-section">
            <h2>Order Summary</h2>
            <div className="summary-item product-summary">
              <img src={optimizeImageUrl((product.images && product.images.length > 0) ? product.images[0] : product.image)} alt={product.name} loading="lazy" />
              <div>
                <h4>{product.name}</h4>
                <p>₹{product.price.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{product.price.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                {shippingCost > 0 ? (
                  <span>₹{shippingCost.toLocaleString()}</span>
                ) : (
                  <span style={{color: '#57606f', fontSize: '0.9rem'}}>Enter Pin Code to calculate</span>
                )}
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(product.price + shippingCost).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
