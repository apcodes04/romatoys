import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';
import './Admin.css';

const ProductForm = () => {
  const { products, addProduct, updateProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'car',
    price: '',
    originalPrice: '',
    description: '',
    images: [],
    features: '',
    isOutOfStock: false
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          ...product,
          images: (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []),
          features: product.features ? product.features.join(', ') : ''
        });
      }
    }
  }, [id, products, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const cloudFormData = new FormData();
        cloudFormData.append('file', file);
        cloudFormData.append('upload_preset', 'cl4zbmfi');

        const response = await fetch('https://api.cloudinary.com/v1_1/dxzhhxqub/image/upload', {
          method: 'POST',
          body: cloudFormData
        });
        
        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productToSave = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };

    if (isEditing) {
      updateProduct(id, productToSave);
    } else {
      addProduct(productToSave);
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-box">
        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="car">Car</option>
              <option value="jeep">Jeep</option>
              <option value="bike">Bike</option>
              <option value="other">Other Toys</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sale Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Original Price (₹) [Optional]</label>
            <input type="number" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Product Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p style={{color: '#1e90ff', marginTop: '5px', fontWeight: 'bold'}}>Uploading images to Firebase...</p>}
            <div className="image-preview-container">
              {formData.images && formData.images.map((imgSrc, index) => (
                <div key={index} className="image-preview-wrapper">
                  <img src={imgSrc} alt="Preview" className="image-preview" />
                  <button type="button" onClick={() => removeImage(index)} className="btn-remove-image">X</button>
                </div>
              ))}
              {/* Fallback for old single image data */}
              {formData.image && (!formData.images || formData.images.length === 0) && (
                <div className="image-preview-wrapper">
                  <img src={formData.image} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
          </div>

          <div className="form-group">
            <label>Features (comma separated)</label>
            <input type="text" name="features" value={formData.features} onChange={handleChange} placeholder="Battery Operated, LED Lights, Music" />
          </div>

          <div className="form-group checkbox-group" style={{marginTop: '10px'}}>
            <label className="large-toggle-label">
              <input 
                type="checkbox" 
                name="isOutOfStock" 
                checked={formData.isOutOfStock} 
                onChange={handleChange} 
                className="large-toggle-checkbox"
              />
              Mark as Out of Stock
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
