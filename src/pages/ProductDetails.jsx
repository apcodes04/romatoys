import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { LeadContext } from '../context/LeadContext';
import { ShippingContext } from '../context/ShippingContext';
import { calculateShippingCost } from '../utils/shippingCalculator';
import { optimizeImageUrl } from '../utils/optimizeImage';
import { companyInfo } from '../data/companyInfo';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products: allProducts } = useContext(ProductContext);
  const { addLead } = useContext(LeadContext);
  const { shippingRates } = useContext(ShippingContext);
  const product = allProducts.find(p => p.id === id);

  useDocumentTitle(product ? `${product.name} | Roma Toys Mumbai` : 'Product Not Found | Roma Toys');

  const [mainImage, setMainImage] = useState('');
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [calculatedShipping, setCalculatedShipping] = useState(null);

  useEffect(() => {
    if (product) {
      setMainImage((product.images && product.images.length > 0) ? product.images[0] : product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">Back to Shop</button>
      </div>
    );
  }

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    addLead({
      productId: product.id,
      productName: product.name,
      customerName: leadForm.name,
      customerPhone: leadForm.phone,
      customerEmail: leadForm.email
    });
    setLeadSubmitted(true);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="product-details-container">
      <div className="product-details-content">
        <div className="product-image-section">
          <img src={optimizeImageUrl(mainImage)} alt={product.name} className="product-details-img" />
          
          {product.images && product.images.length > 1 && (
            <div className="image-gallery-thumbnails">
              {product.images.map((img, index) => (
                <img 
                  key={index} 
                  src={optimizeImageUrl(img)} 
                  alt={`${product.name} ${index}`} 
                  className={`gallery-thumb ${mainImage === img ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-info-section">
          <h1 className="product-title-large" style={{marginBottom: '10px'}}>{product.name}</h1>
          
          <div className="price-container-large" style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
            <p className="product-price-large" style={{color: '#2ed573', fontSize: '2.5rem', fontWeight: 'bold', margin: '0'}}>₹{product.price.toLocaleString()}</p>
            {hasDiscount && (
              <>
                <p className="original-price-large" style={{textDecoration: 'line-through', color: '#a4b0be', fontSize: '1.5rem', margin: '0'}}>
                  ₹{product.originalPrice.toLocaleString()}
                </p>
                <div className="discount-badge-large" style={{background: '#ff4757', color: 'white', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem'}}>{discountPercent}% OFF</div>
              </>
            )}
          </div>

          <div className="product-description-box">
            <h3 style={{marginTop: '0'}}>Description</h3>
            {product.isOutOfStock && <span className="detail-badge-oos" style={{display:'inline-block', background:'#ff4757', color:'white', padding:'5px 10px', borderRadius:'15px', fontSize:'0.9rem', fontWeight:'bold', marginBottom:'10px'}}>Temporarily Out of Stock</span>}
          </div>
          <p className="product-description-large">{product.description}</p>
          
          <div className="product-features-large">
            <h3>Features:</h3>
            <ul>
              {product.features && product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {!product.isOutOfStock ? (
            <button 
              className="custom-buy-now-btn"
              onClick={() => setPincodeModalOpen(true)}
            >
              Shop now
              <svg className="cartIcon" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
            </button>
          ) : (
            <div className="interest-form-container" style={{marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '15px', border: '1px solid #dfe4ea'}}>
              {leadSubmitted ? (
                <div style={{textAlign: 'center', color: '#2ed573'}}>
                  <h3 style={{margin: 0}}>Thanks for your interest!</h3>
                  <p>We'll contact you as soon as it's back in stock.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="interest-form">
                  <h3 style={{marginTop: 0, marginBottom: '15px', color: '#2f3542'}}>Want this item?</h3>
                  <p style={{fontSize: '0.9rem', color: '#57606f', marginBottom: '15px'}}>Leave your details and we'll notify you when it arrives.</p>
                  <input type="text" placeholder="Your Name" required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'5px', border:'1px solid #ccc'}} />
                  <input type="tel" placeholder="Phone Number" required value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'5px', border:'1px solid #ccc'}} />
                  <input type="email" placeholder="Email Address (Optional)" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} style={{width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'5px', border:'1px solid #ccc'}} />
                  <button type="submit" style={{width:'100%', padding:'12px', background:'#ff4757', color:'white', border:'none', borderRadius:'5px', fontWeight:'bold', cursor:'pointer'}}>Notify Me</button>
                </form>
              )}
            </div>
          )}
          
          <div className="action-buttons">
            <a 
              href={`https://wa.me/${companyInfo.contactNumbers[0].replace(/\D/g, '')}?text=Hi, I am interested in ${product.name} (ID: ${product.id}). Is it available?`}
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {pincodeModalOpen && (
        <div className="pincode-modal-overlay">
          <div className="pincode-modal-content">
            <button className="close-modal-btn" onClick={() => setPincodeModalOpen(false)}>×</button>
            <h2>Check Delivery Estimate</h2>
            <p style={{color: '#57606f', marginBottom: '20px', fontSize: '0.9rem'}}>Please enter your delivery Pincode to calculate shipping charges for this bulky item.</p>
            
            <div className="pincode-input-group">
              <input 
                type="text" 
                maxLength="6" 
                placeholder="Enter 6-digit Pincode" 
                value={pincodeInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPincodeInput(val);
                  if (val.length === 6) {
                    setCalculatedShipping(calculateShippingCost(val, shippingRates));
                  } else {
                    setCalculatedShipping(null);
                  }
                }}
                className="pincode-input"
              />
            </div>

            {calculatedShipping !== null && (
              <div className="shipping-estimate-box">
                <div className="estimate-row">
                  <span>Product Price:</span>
                  <span>₹{product.price.toLocaleString()}</span>
                </div>
                <div className="estimate-row">
                  <span>Estimated Shipping:</span>
                  <span>+ ₹{calculatedShipping.toLocaleString()}</span>
                </div>
                <div className="estimate-row total">
                  <span>Grand Total:</span>
                  <span>₹{(product.price + calculatedShipping).toLocaleString()}</span>
                </div>
                
                <button 
                  className="btn btn-primary proceed-checkout-btn"
                  onClick={() => navigate('/checkout', { state: { product, prefillPincode: pincodeInput, prefillShipping: calculatedShipping } })}
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
