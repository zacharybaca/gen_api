import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from '../components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword/ResetPassword';

const { mockFetcher, mockNavigate, mockToastError, mockToastSuccess } =
  vi.hoisted(() => ({
    mockFetcher: vi.fn(),
    mockNavigate: vi.fn(),
    mockToastError: vi.fn(),
    mockToastSuccess: vi.fn(),
  }));

vi.mock('../hooks/useFetcher.js', () => ({
  useFetcher: () => ({ fetcher: mockFetcher }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: mockToastError,
    success: mockToastSuccess,
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderForgotPassword = () =>
  render(
    <MemoryRouter initialEntries={['/forgot-password']}>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </MemoryRouter>
  );

const renderResetPassword = () =>
  render(
    <MemoryRouter initialEntries={['/resetpassword/test-token']}>
      <Routes>
        <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
      </Routes>
    </MemoryRouter>
  );

describe('Password reset flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders forgot password on its route and treats a 404 response like success', async () => {
    let resolveRequest;
    mockFetcher.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderForgotPassword();

    expect(
      screen.getByRole('heading', { name: 'Forgot Password' })
    ).toBeInTheDocument();

    fireEvent.change(document.querySelector('input[type="email"]'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled();
    });

    expect(mockFetcher).toHaveBeenCalledWith(
      '/api/auth/forgotpassword',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('user@example.com'),
      })
    );

    await act(async () => {
      resolveRequest({ success: false, status: 404, error: 'User not found' });
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Check Your Email' })
      ).toBeInTheDocument();
    });
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('renders reset password on its route and disables submit while the request is in flight', async () => {
    let resolveRequest;
    mockFetcher.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderResetPassword();

    expect(
      screen.getByRole('heading', { name: 'Reset Password' })
    ).toBeInTheDocument();

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Resetting...' })
      ).toBeDisabled();
    });

    expect(mockFetcher).toHaveBeenCalledWith(
      '/api/auth/resetpassword/test-token',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ password: 'password123' }),
      })
    );

    await act(async () => {
      resolveRequest({ success: true, data: {} });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
