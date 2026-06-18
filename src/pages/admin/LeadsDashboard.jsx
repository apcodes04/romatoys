import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LeadContext } from '../../context/LeadContext';
import './Admin.css';

const LeadsDashboard = () => {
  const { leads, deleteLead } = useContext(LeadContext);

  // Group leads by product
  const leadSummary = leads.reduce((acc, lead) => {
    if (!acc[lead.productId]) {
      acc[lead.productId] = {
        productName: lead.productName,
        count: 0
      };
    }
    acc[lead.productId].count += 1;
    return acc;
  }, {});

  const summaryArray = Object.values(leadSummary).sort((a, b) => b.count - a.count);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Customer Interests (Leads)</h1>
        <div className="admin-actions">
          <Link to="/admin/dashboard" className="btn btn-secondary">Back to Products</Link>
        </div>
      </div>

      <div className="admin-content" style={{ marginBottom: '30px' }}>
        <h2 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #f1f2f6' }}>Interest Summary</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Customers Waiting</th>
            </tr>
          </thead>
          <tbody>
            {summaryArray.map((item, index) => (
              <tr key={index}>
                <td><strong>{item.productName}</strong></td>
                <td><span style={{background: '#ff4757', color: 'white', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold'}}>{item.count}</span></td>
              </tr>
            ))}
            {summaryArray.length === 0 && (
              <tr><td colSpan="2" className="text-center">No current interest recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-content">
        <h2 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #f1f2f6' }}>Detailed Leads</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Requested Product</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{new Date(lead.date).toLocaleDateString()}</td>
                <td>{lead.customerName}</td>
                <td><a href={`tel:${lead.customerPhone}`} style={{color: '#1e90ff', textDecoration: 'none'}}>{lead.customerPhone}</a></td>
                <td><a href={`mailto:${lead.customerEmail}`} style={{color: '#1e90ff', textDecoration: 'none'}}>{lead.customerEmail}</a></td>
                <td>{lead.productName}</td>
                <td>
                  <button onClick={() => { if(window.confirm('Delete this lead?')) deleteLead(lead.id) }} className="btn-sm btn-delete">Remove</button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsDashboard;
