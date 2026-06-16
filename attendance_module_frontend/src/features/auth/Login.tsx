import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser, viewAllUsers, forgotPassword, resetPassword } from '../../api/services';
import { setAuth, setUserId, getToken, getRole } from '../../hooks/useAuth';
import type { AxiosError } from 'axios';
import { useToast } from '../../hooks/useToast';
import './Login.css';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (token) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'trainer') {
        navigate('/trainer/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(true);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp'>('otp');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const { token, userName, roleName, userId } = response.data;

      // Persist token first so the follow-up call can attach the Bearer header
      setAuth({ token, userName, roleName, userId });

      // The backend login response may not include userId.
      // Resolve it by fetching all users and matching by userName.
      if (userId === undefined || userId === null) {
        try {
          const usersRes = await viewAllUsers();
          const match = usersRes.data.find((u) => u.userName === userName);
          if (match) {
            setUserId(match.userId);
          }
        } catch {
          // Non-fatal: pages will show a graceful retry if userId is still missing
          console.warn('Could not resolve userId from user list.');
        }
      }

      toast.success(`Welcome back, ${userName}!`);
      if (roleName === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/trainer/dashboard');
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const msg =
        axiosErr.response?.data?.message ??
        axiosErr.response?.data?.error ??
        'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForgotPassword = () => {
    setIsForgotPasswordMode(false);
    setForgotPasswordStep('email');
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const handleRequestOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword({ email: forgotEmail });
      toast.success('OTP sent successfully to your email.');
      setForgotPasswordStep('otp');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const msg = axiosErr.response?.data?.error ?? 'Failed to send OTP. Please check the email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ email: forgotEmail, otp, newPassword });
      toast.success('Password reset successfully. Please login with your new password.');
      handleCancelForgotPassword();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const msg = axiosErr.response?.data?.error ?? 'Failed to reset password. Please check the OTP.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-card" aria-labelledby="login-title">
        <section className="brand-panel" aria-label="Attendance Management System">
          <div>
            <div className="brand-mark">
              <span>AMS.</span>
            </div>
            <p className="brand-copy">
              Streamline class attendance tracking with IATT's smart Attendance
              Management System.
            </p>
          </div>

          <div className="brand-proof">
            <div className="user-stack" aria-hidden="true">
              <span>AD</span>
              <span>TR</span>
              <span>ST</span>
              <span>+1k</span>
            </div>
            <p>Join trainers and admins managing attendance accurately.</p>
          </div>
        </section>

        <section className="form-panel">
          {isForgotPasswordMode ? (
            forgotPasswordStep === 'email' ? (
              <form className="login-form" onSubmit={handleRequestOtp}>
                <div className="form-heading">
                  <div className="form-logo" aria-hidden="true">
                    <FiCalendar />
                  </div>
                  <h1 id="login-title">Forgot Password</h1>
                  <p>Enter your email address to receive a 6-digit verification OTP.</p>
                </div>

                {error && (
                  <div className="error-banner" role="alert">
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="forgot-email">Email address</label>
                  <div className="input-shell">
                    <FiMail aria-hidden="true" />
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? 'Sending OTP…' : 'Send OTP'}
                </button>

                <div className="request-access">
                  <button type="button" className="link-button" onClick={handleCancelForgotPassword}>
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form className="login-form" onSubmit={handleResetPassword}>
                <div className="form-heading">
                  <div className="form-logo" aria-hidden="true">
                    <FiCalendar />
                  </div>
                  <h1 id="login-title">Reset Password</h1>
                  <p>An OTP has been sent to your email. Enter the code and your new password.</p>
                </div>

                {error && (
                  <div className="error-banner" role="alert">
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="forgot-email-readonly">Email address</label>
                  <div className="input-shell">
                    <FiMail aria-hidden="true" />
                    <input
                      id="forgot-email-readonly"
                      type="email"
                      value={forgotEmail}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="otp">Verification OTP</label>
                  <div className="input-shell">
                    <FiLock aria-hidden="true" />
                    <input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="input-shell">
                    <FiLock aria-hidden="true" />
                    <input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="input-shell">
                    <FiLock aria-hidden="true" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? 'Resetting Password…' : 'Reset Password'}
                </button>

                <div className="request-access">
                  <button type="button" className="link-button" onClick={() => setForgotPasswordStep('email')}>
                    Back to Email Form
                  </button>
                </div>
              </form>
            )
          ) : (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-heading">
                <div className="form-logo" aria-hidden="true">
                  <FiCalendar />
                </div>
                <h1 id="login-title">Welcome back</h1>
                <p>Please enter your details to access attendance records.</p>
              </div>

              {error && (
                <div className="error-banner" role="alert">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <div className="input-shell">
                  <FiMail aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setIsForgotPasswordMode(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="input-shell">
                  <FiLock aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : <>Sign in <span aria-hidden="true">-&gt;</span></>}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

