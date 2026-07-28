import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../components/Auth/Register/Register';

const mockFetcher = vi.fn();
let mockUser = null;

vi.mock('../hooks/useFetcher.js', () => ({
  useFetcher: () => ({ fetcher: mockFetcher }),
}));

vi.mock('../hooks/useAuth.js', () => ({
  useAuth: () => ({ user: mockUser }),
}));

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
  });

  it('renders the registration form', () => {
    renderRegister();
    expect(
      screen.getByRole('heading', { name: 'Create Account' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
  });

  it('renders all required input fields', () => {
    renderRegister();
    const inputs = document.querySelectorAll('input');
    expect(inputs).toHaveLength(4); // name, username, email, password
  });

  it('renders a link to the login page', () => {
    renderRegister();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('disables the submit button and shows loading text while the request is in flight', async () => {
    let resolveRequest;
    mockFetcher.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderRegister();

    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'Test User' } });
    fireEvent.change(inputs[1], { target: { value: 'testuser' } });
    fireEvent.change(inputs[2], { target: { value: 'user@example.com' } });
    fireEvent.change(inputs[3], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Creating Account...' })
      ).toBeDisabled();
    });

    await act(async () => {
      resolveRequest({ success: false, error: 'Registration failed' });
    });
  });

  it('redirects authenticated users away from the registration form', () => {
    mockUser = { _id: '1', name: 'Test User' };
    renderRegister();
    expect(
      screen.queryByRole('button', { name: /create account/i })
    ).not.toBeInTheDocument();
  });
});
