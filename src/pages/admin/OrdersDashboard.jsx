import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderContext } from '../../context/OrderContext';
import ConfirmModal from '../../components/ConfirmModal';
import './Admin.css';

const OrdersDashboard = () => {
  const { orders, updateOrderStatus, deleteOrder } = useContext(OrderContext);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const requestDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteOrder(itemToDelete);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Payment Verification': return '#ff4757';
      case 'Processing': return '#ffa502';
      case 'Shipped': return '#1e90ff';
      case 'Delivered': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Order Management</h1>
        <div className="admin-actions">
          <Link to="/admin/dashboard" className="btn btn-secondary">Back to Products</Link>
        </div>
      </div>

      <div className="admin-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td style={{fontSize: '0.8rem', color: '#57606f'}}>{order.id}</td>
                <td>
                  <strong>{order.customerDetails.name}</strong><br/>
                  <a href={`tel:${order.customerDetails.phone}`} style={{fontSize: '0.8rem', color: '#1e90ff', textDecoration: 'none'}}>{order.customerDetails.phone}</a><br/>
                  <span style={{fontSize: '0.8rem'}}>{order.customerDetails.city} - {order.customerDetails.pincode}</span>
                </td>
                <td>{order.product.name}</td>
                <td><strong>₹{order.totalAmount.toLocaleString()}</strong></td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      padding: '5px 10px', 
                      borderRadius: '15px', 
                      border: `2px solid ${getStatusColor(order.status)}`,
                      backgroundColor: `${getStatusColor(order.status)}15`,
                      color: getStatusColor(order.status),
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginBottom: '5px',
                      display: 'block'
                    }}
                  >
                    <option value="Pending Payment Verification">Pending Verification</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  {order.screenshotUrl && (
                    <a href={order.screenshotUrl} target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: '#1e90ff', textDecoration: 'underline'}}>
                      View Screenshot
                    </a>
                  )}
                </td>
                <td>
                  <button onClick={() => requestDelete(order.id)} className="btn-sm btn-delete">Delete</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen} 
        title="Delete Order" 
        message="Are you sure you want to permanently delete this order? This action cannot be undone." 
        onConfirm={confirmDelete} 
        onCancel={() => setDeleteModalOpen(false)} 
      />
    </div>
  );
};

export default OrdersDashboard;
