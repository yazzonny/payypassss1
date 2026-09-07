import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../src/context/LanguageContext';
import { useAuth } from '../../src/context/AuthContext';
import { Lock, Mail, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthPage = () => {
  const { language, t } = useLanguage();
  const { login, register, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!email || !password || !name) {
          setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
          setLoading(false);
          return;
        }
        await register(email, password, name, phone);
        navigate('/account');
      } else {
        if (!email || !password) {
          setError(language === 'ar' ? 'يرجى إدخال البريد وكلمة المرور' : 'Please enter email and password');
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        if (res.user?.email?.toLowerCase() === 'yznyzn123@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdminEmail = () => {
    setEmail('yznyzn123@gmail.com');
    setIsRegister(false);
    setError('');
  };

  const handleQuickCustomer = async () => {
    setError('');
    setLoading(true);
    try {
      await login('customer@playpass.com', 'pass123');
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-root">
      <div className="container">
        <div className="auth-card glass-card">
          {/* Logo Header */}
          <div className="auth-logo-box">
            <img src="/assets/logo.png" alt="PlayPass" className="auth-logo-img" />
          </div>

          <h1 className="auth-title">
            {isRegister ? t('authTitleRegister') : t('authTitleLogin')}
          </h1>
          <p className="auth-subtitle">
            {isRegister ? t('authSubtitleRegister') : t('authSubtitleLogin')}
          </p>

          {error && <div className="auth-error-banner">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">{t('fullName')}</label>
                  <div className="auth-input-wrap">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('fullNamePlaceholder')}
                      className="form-input with-icon"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('phone')}</label>
                  <div className="auth-input-wrap">
                    <Phone size={16} className="auth-input-icon" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('phonePlaceholder')}
                      className="form-input with-icon"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lg btn-primary w-full auth-submit-btn"
            >
              {loading ? (
                <span>{language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</span>
              ) : (
                <span>{isRegister ? t('registerBtn') : t('loginBtn')}</span>
              )}
            </button>
          </form>

          {/* Toggle between Register and Login */}
          <div className="auth-toggle-box">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="btn-toggle-auth"
            >
              {isRegister ? t('haveAccount') : t('needAccount')}
            </button>
          </div>

          {/* Quick Demo Logins for Pair Programming & Testing */}
          <div className="demo-credentials-box">
            <span className="demo-hint-title">
              <Sparkles size={14} />
              <span>{language === 'ar' ? 'تسهيل تسجيل الدخول للمعاينة' : 'Quick Access Helpers'}</span>
            </span>
            <div className="demo-buttons-grid">
              <button
                type="button"
                onClick={handleFillAdminEmail}
                className="btn btn-sm btn-secondary demo-login-btn"
                title="Fill authorized admin email"
              >
                <span>🔑 {language === 'ar' ? 'ملء بريد المشرف (yznyzn123)' : 'Admin: yznyzn123@...'}</span>
              </button>
              <button
                type="button"
                onClick={handleQuickCustomer}
                className="btn btn-sm btn-outline demo-login-btn"
              >
                <span>👤 {t('demoUserBtn')}</span>
              </button>
            </div>
            <p className="admin-notice-small">
              {language === 'ar'
                ? 'لوحة التحكم مقصورة حصرياً على: yznyzn123@gmail.com بدون كلمة مرور مسبقة.'
                : 'Admin dashboard access is strictly restricted to yznyzn123@gmail.com.'}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-root {
          padding-block: 50px 80px;
        }
        .auth-card {
          max-width: 460px;
          margin-inline: auto;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .auth-logo-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #14182a;
          border: 2px solid var(--border-active);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 0 20px rgba(124, 92, 252, 0.3);
        }
        .auth-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .auth-title {
          font-size: 1.8rem;
          color: var(--text-white);
          margin-bottom: 6px;
        }
        .auth-subtitle {
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin-bottom: 24px;
        }
        .auth-error-banner {
          width: 100%;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid var(--danger);
          color: #FCA5A5;
          font-size: 0.82rem;
          margin-bottom: 18px;
          text-align: start;
        }
        .auth-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .auth-input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }
        [dir="rtl"] .auth-input-icon {
          left: auto;
          right: 14px;
        }
        .form-input.with-icon {
          padding-left: 40px;
        }
        [dir="rtl"] .form-input.with-icon {
          padding-left: 14px;
          padding-right: 40px;
        }
        .auth-submit-btn {
          margin-top: 14px;
        }
        .auth-toggle-box {
          margin-top: 20px;
        }
        .btn-toggle-auth {
          background: transparent;
          border: none;
          color: var(--accent-purple);
          font-size: 0.88rem;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-toggle-auth:hover {
          text-decoration: underline;
        }
        .demo-credentials-box {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .demo-hint-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #FBBF24;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .demo-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .demo-login-btn {
          font-size: 0.8rem;
          padding: 8px 10px;
        }
        @media (max-width: 480px) {
          .auth-page-root {
            padding-block: 30px 60px;
          }
          .auth-card {
            padding: 24px 16px;
          }
          .demo-buttons-grid {
            grid-template-columns: 1fr;
          }
          .auth-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
