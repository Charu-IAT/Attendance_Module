import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "charumathi@iattechnologies.com",
    password: "Charu5602@d",
  });

  const ROLE = {
    ADMIN: "admin",
    TRAINER: "trainer",
  };

  const getDefaultRouteForRole = (role) => {
    switch (role) {
      case ROLE.ADMIN:
        return "/admin-dashboard";

      case ROLE.TRAINER:
        return "/trainer-dashboard";

      default:
        return "/";
    }
  };

  const setToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return;
    }

    localStorage.removeItem("token");

    delete axios.defaults.headers.common["Authorization"];
  };

  const setRole = (role) => {
    localStorage.setItem("role", role);
  };

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!loginData.email || !loginData.password) {
      setError("Email and Password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        loginData,
      );

      console.log(response.data);

      const data = response.data;
      setToken(data.token);
      setRole(data.role);

      navigate(getDefaultRouteForRole(data.role));
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-form-panel login-panel">
          <div className="login-panel-header">
            <h2 className="text-center">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <p className="login-error">{error}</p>}

            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                className="login-input"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password
              </label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  } eye-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
