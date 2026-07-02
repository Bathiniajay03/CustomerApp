import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { customersApi } from '../services/api';

const LoginPage = () => {
  const { login } = useAuth();
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!storeName) {
      setError('Please enter a Store Name');
      return;
    }
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Save tenant name so API calls route correctly
    localStorage.setItem('customer_tenant_name', storeName);
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await customersApi.requestOtp(email);
      setStep(2);
      setMessage('OTP has been sent to your email (Check terminal).');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP. Make sure the Store Name is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await customersApi.verifyOtp(email, otp);
      const { token, customer } = response.data;
      login(token, customer);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 p-4 mt-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold">SmartERP</h2>
              <p className="text-muted">Customer Portal Login</p>
            </div>
            
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {message && <div className="alert alert-success py-2">{message}</div>}
            
            {step === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Store Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light border-0"
                    placeholder="e.g. ajay"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg bg-light border-0"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Login / Sign Up'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-semibold">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light border-0 text-center fw-bold fs-4"
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    disabled={loading}
                    required
                  />
                  <div className="text-end mt-2">
                    <button 
                      type="button" 
                      className="btn btn-link btn-sm text-decoration-none p-0"
                      onClick={() => { setStep(1); setOtp(''); setError(''); setMessage(''); }}
                    >
                      Change Email
                    </button>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
