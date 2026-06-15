import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiLock, FiMail } from 'react-icons/fi';
import { loginUser, viewAllUsers } from '../../api/services';
import { setAuth, setUserId } from '../../hooks/useAuth';
import type { AxiosError } from 'axios';
import { useToast } from '../../hooks/useToast';
import './Login.css';

interface ApiErrorResponse {
  message?: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

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
        axiosErr.response?.data?.message ?? 'Invalid credentials. Please try again.';
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
              <div className="input-shell">
                <FiLock aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : <>Sign in <span aria-hidden="true">-&gt;</span></>}
            </button>

           
          </form>
        </section>
      </main>
    </div>
  );
}
