import React, { useState, useEffect } from 'react';
import { isLiveFirebaseConfigured, settingsService, DEFAULT_SETTINGS } from '../../config/firebase';
import { useLanguage } from '../../../src/context/LanguageContext';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../../data/initialProducts';
import {
  Settings,
  Database,
  Key,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Phone,
  MessageCircle,
  Save,
  CheckCircle2
} from 'lucide-react';

export const AdminSettings = () => {
  const { language, t } = useLanguage();
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Storefront live settings
  const [paymentLink, setPaymentLink] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_SETTINGS.whatsappNumber);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    settingsService.get().then(s => {
      if (s) {
        setPaymentLink(s.paymentLink || '');
        setWhatsappNumber(s.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber);
      }
    });
  }, []);

  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsService.update({
        paymentLink: paymentLink.trim(),
        whatsappNumber: whatsappNumber.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving store settings:', err);
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const envSnippet = `# PlayPass Firebase Credentials (.env.local)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=playpass-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=playpass-store
VITE_FIREBASE_STORAGE_BUCKET=playpass-store.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef`;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleResetCatalog = () => {
    if (window.confirm(language === 'ar' ? 'هل تريد استعادة المنتجات والطلبات الافتراضية؟' : 'Reset products and demo orders to factory defaults?')) {
      localStorage.setItem('playpass_products_v1', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('playpass_orders_v1', JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem('playpass_settings_v1', JSON.stringify(DEFAULT_SETTINGS));
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        window.location.reload();
      }, 1200);
    }
  };

  return (
    <div className="admin-settings-root">
      <div className="settings-header">
        <h2 className="admin-page-title">{language === 'ar' ? 'إعدادات المتجر والدفع' : 'Store Settings & Payments'}</h2>
        <p className="admin-page-sub">
          {language === 'ar'
            ? 'تحديث رابط الدفع المستخدم في صفحة الشراء ورقم الواتساب الخاص بالدعم والتأكيد فورياً.'
            : 'Configure the checkout "Pay Now" link and support WhatsApp number. Updates take effect immediately.'}
        </p>
      </div>

      {/* SECTION 1: LIVE STOREFRONT SETTINGS (Payment Link & WhatsApp) */}
      <div className="settings-card glass-card highlight-card">
        <div className="settings-card-head">
          <CreditCard size={22} className="text-purple" />
          <div>
            <h3 className="card-title">
              {language === 'ar' ? 'إعدادات وسيلة الدفع ورقم الواتساب (تحديث مباشر)' : 'Live Storefront Checkout & WhatsApp'}
            </h3>
            <span className="card-sub-hint">
              {language === 'ar'
                ? 'أي تعديل يتم حفظه هنا ينعكس فوراً على المتجر وصفحة الدفع دون الحاجة لأي تعديل في الكود.'
                : 'Changes saved here update the customer checkout and confirmation pages live with zero code changes.'}
            </span>
          </div>
        </div>

        {saveSuccess && (
          <div className="settings-saved-banner animate-glow">
            <CheckCircle2 size={18} />
            <span>
              {language === 'ar'
                ? 'تم حفظ الإعدادات بنجاح! تم تحديث المتجر ورابط الدفع والواتساب مباشرة.'
                : 'Settings saved successfully! Storefront payment link and WhatsApp updated live.'}
            </span>
          </div>
        )}

        <form onSubmit={handleSaveStoreSettings} className="settings-live-form">
          {/* Payment Link Field */}
          <div className="form-group">
            <label className="form-label font-bold">
              <CreditCard size={15} />
              <span>{language === 'ar' ? 'رابط الدفع لزر "ادفع الآن" (Pay Now Link)' : 'Checkout "Pay Now" Payment Link'}</span>
            </label>
            <input
              type="url"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder="e.g. https://myfatoorah.com/invoice/paypass or https://buy.stripe.com/..."
              className="form-input code-font"
            />
            <span className="form-hint">
              {language === 'ar'
                ? 'عند الضغط على "ادفع الآن" في صفحة الشراء، سيتم فتح هذا الرابط المباشر للعميل لإتمام الدفع.'
                : 'When customers click "Pay Now", this link will be opened in a new tab for payment processing.'}
            </span>
          </div>

          {/* WhatsApp Number Field */}
          <div className="form-group">
            <label className="form-label font-bold">
              <Phone size={15} />
              <span>{language === 'ar' ? 'رقم الواتساب للدعم وتأكيد الدفع (WhatsApp Number)' : 'Support & Confirmation WhatsApp Number'}</span>
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+962780114108"
              className="form-input code-font"
              required
            />
            <span className="form-hint">
              {language === 'ar'
                ? 'الصيغة الدولية الكاملة (مثال: +962780114108). سيتم استخدامه في رابط wa.me وتأكيد الطلبات.'
                : 'Full international format (e.g. +962780114108). Used to generate wa.me chat links for payment confirmation.'}
            </span>
          </div>

          <div className="settings-actions-bar">
            <button
              type="submit"
              disabled={savingSettings}
              className="btn btn-primary btn-save-settings"
            >
              <Save size={16} />
              <span>
                {savingSettings
                  ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                  : (language === 'ar' ? 'حفظ إعدادات المتجر والدفع' : 'Save Settings Live')}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: FIREBASE & SYSTEM SETTINGS */}
      <div className="settings-grid">
        {/* Status Card */}
        <div className="settings-card glass-card">
          <div className="settings-card-head">
            <Database size={20} className="text-purple" />
            <h3 className="card-title">
              {language === 'ar' ? 'حالة Backend & Firebase' : 'Backend & Firebase Status'}
            </h3>
          </div>

          <div className={`status-callout ${isLiveFirebaseConfigured ? 'status-live' : 'status-demo'}`}>
            <div className="callout-icon">
              {isLiveFirebaseConfigured ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <strong className="callout-title">
                {isLiveFirebaseConfigured
                  ? (language === 'ar' ? 'متصل بـ Firebase Firestore الحقيقي' : 'Connected to Live Firebase Cloud')
                  : (language === 'ar' ? 'يعمل في وضع المعاينة التجريبية (Local Storage)' : 'Running in Local Storage Mode')}
              </strong>
              <p className="callout-desc">
                {isLiveFirebaseConfigured
                  ? (language === 'ar' ? 'البيانات تتزامن مباشرة مع سحابة Google Cloud Firestore.' : 'Data syncs directly with Google Cloud Firestore.')
                  : (language === 'ar' ? 'الإعدادات والمنتجات والطلبات تُحفظ محلياً وتعمل بكفاءة تامة.' : 'Settings, products, and orders are persisted locally and update in real-time.')}
              </p>
            </div>
          </div>

          <div className="admin-access-reminder">
            <ShieldCheck size={16} className="text-green" />
            <span>
              {language === 'ar'
                ? 'الحساب المصرّح له بالإدارة حصرياً: yznyzn123@gmail.com'
                : 'Authorized Admin Account: yznyzn123@gmail.com'}
            </span>
          </div>
        </div>

        {/* Env Snippet & Data Reset */}
        <div className="settings-card glass-card">
          <div className="settings-card-head">
            <Key size={20} className="text-yellow" />
            <h3 className="card-title">.env.local Template</h3>
          </div>

          <p className="env-sub-p">
            {language === 'ar'
              ? 'انسخ هذا القالب وضعه في ملف .env.local عند ربط مشروع Firebase الخاص بك:'
              : 'Copy this snippet into your .env.local file when linking your Firebase project:'}
          </p>

          <div className="code-snippet-wrap">
            <pre className="code-snippet">{envSnippet}</pre>
            <button onClick={copyEnvSnippet} className="btn btn-sm btn-secondary copy-snippet-btn">
              {copiedEnv ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              <span>{copiedEnv ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ القالب' : 'Copy')}</span>
            </button>
          </div>

          <div className="reset-data-box">
            <button
              onClick={handleResetCatalog}
              className="btn btn-outline reset-btn"
            >
              <RefreshCw size={14} />
              <span>{resetSuccess ? (language === 'ar' ? 'تمت الاستعادة بنجاح!' : 'Restored!') : (language === 'ar' ? 'استعادة الإعدادات والمنتجات الافتراضية' : 'Restore Factory Defaults')}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .admin-settings-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .settings-header {
          margin-bottom: 4px;
        }
        .highlight-card {
          border: 1px solid var(--border-active);
          background: #111424;
          box-shadow: 0 4px 25px rgba(124, 92, 252, 0.2);
        }
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .settings-card {
          padding: 26px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .settings-card-head {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 14px;
        }
        .card-title {
          font-size: 1.2rem;
          color: var(--text-white);
        }
        .card-sub-hint {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .settings-saved-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid #10B981;
          color: #10B981;
          padding: 12px 18px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .settings-live-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .font-bold {
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-white);
        }
        .code-font {
          font-family: monospace;
          font-size: 0.95rem;
        }
        .settings-actions-bar {
          display: flex;
          justify-content: flex-end;
          padding-top: 10px;
        }
        .btn-save-settings {
          padding: 12px 28px;
          font-size: 1rem;
          font-weight: 700;
        }
        .status-callout {
          display: flex;
          gap: 14px;
          padding: 16px;
          border-radius: var(--radius-sm);
        }
        .status-callout.status-live {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #A7F3D0;
        }
        .status-callout.status-demo {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #FDE68A;
        }
        .callout-title {
          font-size: 0.95rem;
          color: var(--text-white);
          display: block;
          margin-bottom: 4px;
        }
        .callout-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .admin-access-reminder {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(124, 92, 252, 0.08);
          border: 1px dashed var(--accent-purple);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          color: var(--accent-purple);
        }
        .env-sub-p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .code-snippet-wrap {
          position: relative;
          background: #090B13;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 14px;
        }
        .code-snippet {
          font-family: monospace;
          font-size: 0.78rem;
          color: #E2E8F0;
          overflow-x: auto;
          line-height: 1.5;
        }
        .copy-snippet-btn {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        [dir="rtl"] .copy-snippet-btn {
          right: auto;
          left: 10px;
        }
        .reset-data-box {
          padding-top: 10px;
        }
        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .settings-card {
            padding: 16px;
          }
          .settings-actions-bar .btn {
            width: 100%;
            justify-content: center;
          }
          .code-snippet-wrap {
            padding-top: 36px;
          }
          .reset-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
