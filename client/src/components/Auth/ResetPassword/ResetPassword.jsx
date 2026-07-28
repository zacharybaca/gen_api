import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetcher } from '../../../hooks/useFetcher.js';
import '../auth-forms.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const { fetcher } = useFetcher();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    const response = await fetcher(`/api/auth/resetpassword/${resettoken}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });

    if (response.success) {
      toast.success('Password reset successful! You are now logged in.');
      navigate('/');
    } else {
      toast.error(
        response.error || 'Password reset failed. The link may have expired.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="auth-form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
