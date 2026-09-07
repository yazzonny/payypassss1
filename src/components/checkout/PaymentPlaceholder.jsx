import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { settingsService, DEFAULT_SETTINGS } from '../../config/firebase';
import { formatPrice } from '../../utils/formatters';
import {
  CreditCard,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Clock
} from 'lucide-react';

export const PaymentPlaceholder = ({ total, onPaymentSuccess, isProcessing }) => {
  const { language, t, isRTL } = useLanguage();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    settingsService.get().then(data => {
      if (data) setSettings(data);
    });

    const handleUpdate = (e) => {
      if (e.detail) setSettings(e.detail);
    };
    window.addEventListener('playpass_settings_updated', handleUpdate);
    return () => window.removeEventListener('playpass_settings_updated', handleUpdate);
  }, []);

  const handlePayNowClick = () => {
    if (settings.paymentLink && settings.paymentLink.trim().startsWith('http')) {
      // Open configured payment link in new window/tab
      try {
        window.open(settings.paymentLink.trim(), '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Could not popup payment link:', err);
      }
    }
    // Proceed to create the order with status "Pending Payment" and show WhatsApp confirmation screen
    onPaymentSuccess();
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="payment-checkout-box">
      {/* Payment Header Info */}
      <div className="payment-card-banner">
        <div className="payment-security-pill">
          <ShieldCheck size={16} className="text-green" />
          <span>{language === 'ar' ? 'دفع آمن ومحمي 100%' : '100% Secure Encrypted Payment'}</span>
        </div>

        <div className="payment-summary-block">
          <div className="payment-due-label">
            {language === 'ar' ? 'المبلغ المستحق للدفع:' : 'Total Amount to Pay:'}
          </div>
          <div className="payment-due-amount">
            {formatPrice(total, language)}
          </div>
        </div>

        {/* Notice of Manual Fulfillment */}
        <div className="manual-delivery-notice">
          <Clock size={16} className="text-yellow" />
          <p>
            {language === 'ar'
              ? 'ملاحظة: التسليم يتم يدوياً عبر فريق الدعم على الواتساب فور تأكيد الدفع.'
              : 'Notice: Product delivery is handled manually by support via WhatsApp after payment confirmation.'}
          </p>
        </div>
      </div>

      {/* Payment Link Indicator (if set by admin) */}
      {settings.paymentLink ? (
        <div className="payment-link-indicator">
          <div className="link-indicator-header">
            <ExternalLink size={15} className="text-purple" />
            <span>
              {language === 'ar'
                ? 'بوابة الدفع المعتمدة للمتجر جاهزة'
                : 'Configured Store Payment Gateway Active'}
            </span>
          </div>
          <p className="link-indicator-sub">
            {language === 'ar'
              ? 'بالضغط على زر "ادفع الآن"، سيتم توجيهك لصفحة الدفع الآمنة، ثم التواصل عبر الواتساب لتسليم طلبك.'
              : 'Clicking "Pay Now" will open the secure checkout portal, followed by direct WhatsApp delivery confirmation.'}
          </p>
        </div>
      ) : (
        <div className="payment-link-indicator demo-mode-banner">
          <div className="link-indicator-header">
            <CreditCard size={15} className="text-yellow" />
            <span>
              {language === 'ar'
                ? 'زر الدفع المباشر جاهز (يمكن تخصيص الرابط من لوحة التحكم)'
                : 'Direct Pay Now Link Active (Customizable in Admin Settings)'}
            </span>
          </div>
          <p className="link-indicator-sub">
            {language === 'ar'
              ? 'اضغط أدناه لتأكيد الطلب بمبلغ ' + formatPrice(total, language) + ' والتحويل إلى شاشة تأكيد الواتساب.'
              : 'Click below to submit order for ' + formatPrice(total, language) + ' and proceed to WhatsApp confirmation.'}
          </p>
        </div>
      )}

      {/* SINGLE "PAY NOW" BUTTON / LINK */}
      <div className="pay-now-action-wrap">
        <button
          type="button"
          onClick={handlePayNowClick}
          disabled={isProcessing}
          className="btn btn-lg btn-primary w-full pay-now-single-btn animate-glow"
        >
          {isProcessing ? (
            <span>{language === 'ar' ? 'جاري تجهيز الطلب...' : 'Processing Order...'}</span>
          ) : (
            <>
              <Lock size={18} />
              <span className="pay-now-text">
                {language === 'ar' ? 'ادفع الآن' : 'Pay Now'} ({formatPrice(total, language)})
              </span>
              <ArrowIcon size={18} />
            </>
          )}
        </button>

        <p className="post-payment-hint">
          <MessageCircle size={14} className="text-green" />
          <span>
            {language === 'ar'
              ? 'بعد الضغط على الدفع، سيتم نقلك لشاشة تأكيد الطلب مع زر محادثة الواتساب المباشرة.'
              : 'After clicking pay, you will be taken to the confirmation screen with a direct WhatsApp chat button.'}
          </span>
        </p>
      </div>

      <style>{`
        .payment-checkout-box {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 10px;
        }
        .payment-card-banner {
          background: rgba(124, 92, 252, 0.08);
          border: 1px solid var(--border-active);
          border-radius: var(--radius-md);
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .payment-security-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #10B981;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 4px 10px;
          border-radius: 999px;
          width: fit-content;
        }
        .payment-summary-block {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 14px;
        }
        .payment-due-label {
          font-size: 1rem;
          color: var(--text-secondary);
        }
        .payment-due-amount {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--accent-purple);
        }
        .manual-delivery-notice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.84rem;
          color: #FBBF24;
          line-height: 1.4;
        }
        .payment-link-indicator {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .demo-mode-banner {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.04);
        }
        .link-indicator-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-white);
        }
        .link-indicator-sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .pay-now-action-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pay-now-single-btn {
          padding-block: 18px;
          font-size: 1.18rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 25px rgba(124, 92, 252, 0.45);
        }
        .pay-now-text {
          font-size: 1.15rem;
        }
        .post-payment-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          justify-content: center;
          text-align: center;
        }
        .text-green { color: #10B981; }
        .text-yellow { color: #FBBF24; }
        .text-purple { color: var(--accent-purple); }
        @media (max-width: 480px) {
          .payment-card-banner {
            padding: 16px;
          }
          .payment-due-amount {
            font-size: 1.7rem;
          }
          .pay-now-single-btn {
            padding-block: 14px;
            font-size: 1rem;
            white-space: normal;
          }
          .pay-now-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
