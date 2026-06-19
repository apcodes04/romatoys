import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';
import { AuthContext } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import SettingsModal from '../../context/SettingsModal';
import './Admin.css';

const AdminDashboard = () => {
  const { products, deleteProduct, moveProductUp, moveProductDown, moveProductToPosition } = useContext(ProductContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const requestDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteProduct(itemToDelete);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/html", e.target.parentNode);
    setTimeout(() => { e.target.classList.add('dragging'); }, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      moveProductToPosition(draggedIndex, targetIndex);
    }
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedIndex(null);
  };

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.price.toString().includes(term);
  });

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button onClick={() => setSettingsModalOpen(true)} className="btn btn-secondary" style={{background: '#ffa502', color: '#000000', border: 'none', fontWeight: 'bold'}}>Edit Payments</button>
          <Link to="/admin/orders" className="btn btn-secondary">View Orders</Link>
          <Link to="/admin/leads" className="btn btn-secondary">View Leads</Link>
          <Link to="/admin/product/new" className="btn btn-primary">Add New Product</Link>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      <div className="admin-search-bar">
        <input 
          type="text" 
          placeholder="Search by product name or price..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div className="admin-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr 
                key={product.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`draggable-row ${draggedIndex === index ? 'dragging-row' : ''} ${product.isOutOfStock ? 'row-out-of-stock' : ''}`}
                style={{ cursor: 'move' }}
              >
                <td data-label="Image">
                  <div style={{position: 'relative', display: 'inline-block'}}>
                    <img src={(product.images && product.images.length > 0) ? product.images[0] : product.image} alt={product.name} className="admin-thumb" />
                    {product.isOutOfStock && <span className="admin-badge-oos">OOS</span>}
                  </div>
                </td>
                <td data-label="Name" style={{fontWeight: 'bold', color: '#2f3542'}}>{product.name}</td>
                <td data-label="Category" className="admin-cat">{product.category}</td>
                <td data-label="Price" style={{color: '#2ed573', fontWeight: 'bold'}}>₹{product.price}</td>
                <td data-label="Actions">
                  <div className="action-buttons-sm">
                    <button onClick={() => moveProductUp(product.id)} disabled={index === 0} className="btn-sm btn-move" title="Move Up">↑</button>
                    <button onClick={() => moveProductDown(product.id)} disabled={index === products.length - 1} className="btn-sm btn-move" title="Move Down">↓</button>
                    <Link to={`/admin/product/edit/${product.id}`} className="btn-sm btn-edit">Edit</Link>
                    <button onClick={() => requestDelete(product.id)} className="btn-sm btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">No products found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen} 
        title="Delete Product" 
        message="Are you sure you want to permanently delete this product? This action cannot be undone." 
        onConfirm={confirmDelete} 
        onCancel={() => setDeleteModalOpen(false)} 
      />

      <SettingsModal 
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
