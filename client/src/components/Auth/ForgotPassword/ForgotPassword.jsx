import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetcher } from '../../../hooks/useFetcher.js';
import '../auth-forms.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { fetcher } = useFetcher();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const response = await fetcher('/api/auth/forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (response.success || response.status === 404) {
      setSubmitted(true);
    } else {
      toast.error(
        response.error || 'Could not send reset email. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page-container">
        <div className="auth-card">
          <h2 className="auth-title">Check Your Email</h2>
          <p
            style={{
              color: 'whitesmoke',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            If an account exists for <strong>{email}</strong>, a password reset
            link has been sent. The link expires in 10 minutes.
          </p>
          <p className="auth-footer">
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p
          style={{
            color: 'whitesmoke',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="auth-footer">
          Remembered your password?{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
