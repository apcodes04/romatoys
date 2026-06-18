import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Admin.css';

const AdminLogin = () => {
  const { login, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isAdmin) {
    navigate('/admin/dashboard');
  }

  const handleMockLogin = () => {
    login();
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Portal</h2>
        <p>Sign in to manage Roma Toys products</p>
        <button onClick={handleMockLogin} className="btn-google-login">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Sign in with Google (Mock)
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
