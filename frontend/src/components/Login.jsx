import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = "http://localhost:4001/api/auth";

/* ─── Validation helpers ─────────────────────────────────────── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address.";
  const [local, domain] = value.split("@");
  if (local.length > 64)
    return "Email local part (before @) must be 64 characters or fewer.";
  if (domain.length > 255)
    return "Email domain (after @) must be 255 characters or fewer.";
  const tld = domain.split(".").pop();
  if (tld.length > 63)
    return "Email TLD (after the last .) must be 63 characters or fewer.";
  return "";
}

function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value))
    return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value))
    return "Password must contain at least one special character.";
  return "";
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitMessage, setSubmitMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  /* ── Submit: calls backend login ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    setSubmitMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitMessage({
          text: data.error || "Something went wrong.",
          type: "error",
        });
      } else {
        // Navigate to /dashboard — pass user info via router state
        navigate("/dashboard", { state: { user: data.user } });
      }
    } catch {
      setSubmitMessage({
        text: "Cannot reach server. Is the backend running?",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="login-card">
      <div className="card-body">
        {/* ── Header ── */}
        <div className="card-header">
          <div className="icon-circle">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <h1>Cypress Testing</h1>
          <p>Please enter your credentials to log in</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <div className="form-field" data-cy="form-email">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={`form-input${emailError ? " input-error" : ""}`}
              aria-describedby={emailError ? "email-error" : undefined}
              aria-invalid={!!emailError}
              autoComplete="email"
              disabled={loading}
            />
            {emailError && (
              <p
                data-cy="form-email-error"
                id="email-error"
                role="alert"
                className="error-msg"
              >
                <span className="material-symbols-outlined">error</span>
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-field">
            <div className="field-row">
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-wrapper" data-cy="form-password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={`form-input with-icon${passwordError ? " input-error" : ""}`}
                aria-describedby={
                  passwordError ? "password-error" : "password-hint"
                }
                aria-invalid={!!passwordError}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                id="toggle-password"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                data-cy="form-input-password-visiblity"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {passwordError ? (
              <p
                id="password-error"
                role="alert"
                className="error-msg"
                data-cy="form-password-error"
              >
                <span className="material-symbols-outlined">error</span>
                {passwordError}
              </p>
            ) : (
              <p id="password-hint" className="hint-msg">
                Min 8 chars · 1 uppercase · 1 number · 1 special character
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-btn"
            type="submit"
            className={`submit-btn${loading ? " loading" : ""}`}
            disabled={loading}
            data-cy="form-submit"
          >
            {loading ? "Please wait…" : "Log In"}
          </button>

          {submitMessage.text && (
            <p
              data-cy="form-test-cred-invalid"
              role={submitMessage.type === "error" ? "alert" : "status"}
              className={
                submitMessage.type === "error"
                  ? "error-msg centered"
                  : "success-msg"
              }
            >
              {submitMessage.type === "error" && (
                <span className="material-symbols-outlined">error</span>
              )}
              {submitMessage.text}
            </p>
          )}
        </form>

        {/* ── Test Credentials ── */}
        <div className="test-credentials">
          <p className="test-credentials-title">
            <span className="material-symbols-outlined">info</span>
            Test Credentials
          </p>
          <div className="test-credentials-row">
            <span className="test-credentials-label">Email</span>
            <code id="test-email" className="test-credentials-value">
              test@example.com
            </code>
          </div>
          <div className="test-credentials-row">
            <span className="test-credentials-label">Password</span>
            <code id="test-password" className="test-credentials-value">
              Test@1234
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
