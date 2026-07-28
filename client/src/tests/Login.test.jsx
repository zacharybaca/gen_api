import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Auth/Login/Login';

const mockFetcher = vi.fn();
let mockUser = null;

vi.mock('../hooks/useFetcher.js', () => ({
  useFetcher: () => ({ fetcher: mockFetcher }),
}));

vi.mock('../hooks/useAuth.js', () => ({
  useAuth: () => ({ user: mockUser }),
}));

const renderLogin = (initialEntries = ['/login']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Login />
    </MemoryRouter>
  );

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
  });

  it('renders the login form', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderLogin();
    expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(
      document.querySelector('input[type="password"]')
    ).toBeInTheDocument();
  });

  it('renders a link to forgot password', () => {
    renderLogin();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('calls fetcher with credentials on submit', async () => {
    mockFetcher.mockResolvedValue({ success: true, data: {} });
    renderLogin();

    fireEvent.change(document.querySelector('input[type="email"]'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('user@example.com'),
        })
      );
    });
  });

  it('disables the submit button and shows loading text while the request is in flight', async () => {
    let resolveRequest;
    mockFetcher.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderLogin();

    fireEvent.change(document.querySelector('input[type="email"]'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Logging in...' })
      ).toBeDisabled();
    });

    await act(async () => {
      resolveRequest({ success: false, error: 'Invalid credentials' });
    });
  });

  it('redirects authenticated users away from the login form', () => {
    mockUser = { _id: '1', name: 'Test User' };
    renderLogin();
    expect(
      screen.queryByRole('button', { name: /login/i })
    ).not.toBeInTheDocument();
  });
});
