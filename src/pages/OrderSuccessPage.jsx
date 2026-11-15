import { Reveal } from '../components/fx/Reveal';
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../src/context/LanguageContext';
import { orderService, settingsService, DEFAULT_SETTINGS } from '../config/firebase';
import { formatPrice } from '../utils/formatters';
import {
  CheckCircle2,
  Copy,
  Printer,
  Home,
  MessageCircle,
  Package,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { language, t, isRTL } = useLanguage();
  const [order, setOrder] = useState(location.state?.order || null);
  const [whatsappNum, setWhatsappNum] = useState(DEFAULT_SETTINGS.whatsappNumber);
  const [loading, setLoading] = useState(!order);
  const [copied, setCopied] = useState(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#7C5CFC', '#A78BFA', '#10B981', '#FFFFFF']
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }

    // Load dynamic WhatsApp number from settings
    settingsService.get().then(s => {
      if (s?.whatsappNumber) setWhatsappNum(s.whatsappNumber);
    });

    if (!order) {
      const fetchOrder = async () => {
        try {
          const found = await orderService.getById(orderId);
          if (found) setOrder(found);
        } catch (err) {
          console.error('Error fetching success order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const copyOrderId = () => {
    const idToCopy = orderId || order?.id;
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-80 text-center">
        <div className="spinner" />
        <p>{language === 'ar' ? 'جاري استرجاع تفاصيل طلبك...' : 'Loading order confirmation...'}</p>
      </div>
    );
  }

  const cleanNumber = whatsappNum.replace(/[^0-9]/g, '') || '962780114108';

  const itemsSummary = order?.items?.map(it => {
    const itName = language === 'ar' ? (it.name_ar || it.name_en) : it.name_en;
    const itVar = it.variantName_en ? ` (${it.variantName_en})` : '';
    return `${it.quantity}x ${itName}${itVar}`;
  }).join(', ') || '';

  const prefilledMsg = language === 'ar'
    ? `مرحباً فريق PlayPass! لقد قمت بطلب رقم #${orderId || order?.id} بقيمة ${formatPrice(order?.total, language)}. المنتجات: ${itemsSummary}. أود تأكيد الدفع واستلام طلبي.`
    : `Hello PlayPass Support! I have placed Order #${orderId || order?.id} for ${formatPrice(order?.total, language)}. Items: ${itemsSummary}. I would like to confirm my payment and receive my product.`;

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(prefilledMsg)}`;

  return (
    <div className="success-page-root">
      <div className="container">
        <Reveal><div className="success-card glass-card">
          {/* Confirmed Icon */}
          <div className="success-icon-wrap animate-glow">
            <CheckCircle2 size={54} className="success-check-icon" />
          </div>

          <h1 className="success-title">{t('orderSuccessTitle')}</h1>

          {/* Reference Badge Box */}
          <div className="order-ref-box">
            <div className="ref-label">{t('orderNumber')}</div>
            <div className="ref-val-row">
              <span className="ref-code">{orderId || order?.id}</span>
              <button onClick={copyOrderId} className="btn-icon copy-btn" title="Copy Order ID">
                <Copy size={16} />
              </button>
            </div>
            {copied && (
              <span className="copied-text">{language === 'ar' ? 'تم نسخ رقم الطلب!' : 'Copied to clipboard!'}</span>
            )}
          </div>

          {/* REQUIRED CONFIRMATION BANNER AS SPECIFIED */}
          <div className="whatsapp-action-banner animate-glow">
            <div className="wa-banner-icon-box">
              <ShieldCheck size={32} />
            </div>
            <div className="wa-banner-content">
              <h2 className="wa-banner-headline">
                {language === 'ar'
                  ? 'شكراً لك! تم استلام طلبك وإيصال تحويل الدفعة بنجاح. سيقوم فريقنا بالتحقق من الدفع وتسليم منتجك في أقرب وقت.'
                  : 'Thank you! Your order and payment screenshot have been received. Our team will verify your payment and deliver your product shortly.'}
              </h2>
              <p className="wa-banner-sub">
                {language === 'ar'
                  ? 'طلبك الآن قيد التحقق اليدوي لدى الإدارة. سيتم إرسال بيانات التفعيل لحسابك وبريدك فور مراجعة الإيصال.'
                  : 'Your order is currently undergoing manual verification by our team. Activation details will be delivered once approved.'}
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-whatsapp-confirm"
              >
                <MessageCircle size={22} />
                <span>
                  {language === 'ar' ? 'متابعة مع الدعم عبر الواتساب' : 'WhatsApp Support & Inquiries'} ({whatsappNum})
                </span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>

          {/* Order Status Card */}
          <div className="order-status-card">
            <div className="status-indicator-line">
              <span className="status-label-heading">{t('status')}:</span>
              <span className={`badge ${
                order?.status === 'Delivered'
                  ? 'badge-success'
                  : order?.status === 'Confirmed'
                  ? 'badge-primary'
                  : order?.status === 'Cancelled'
                  ? 'badge-danger'
                  : 'badge-warning'
              } status-badge-large`}>
                <Clock size={14} />
                <span>
                  {order?.status === 'Pending Verification'
                    ? (language === 'ar' ? 'قيد التحقق من الدفع' : 'Pending Verification')
                    : order?.status === 'Confirmed'
                    ? (language === 'ar' ? 'تم تأكيد الدفع' : 'Confirmed')
                    : order?.status === 'Delivered'
                    ? (language === 'ar' ? 'تم التسليم' : 'Delivered')
                    : (order?.status || 'Pending Verification')}
                </span>
              </span>
            </div>
            <p className="status-explanation">
              {order?.status === 'Delivered'
                ? (language === 'ar' ? 'تم تسليم طلبك بنجاح! راجع بيانات التفعيل أدناه.' : 'Your product credentials have been delivered below.')
                : order?.status === 'Confirmed'
                ? (language === 'ar' ? 'تم التحقق من الدفع بنجاح! جاري تجهيز كود التفعيل وتسليمه لك.' : 'Payment confirmed! Support is preparing your credentials.')
                : (language === 'ar'
                  ? 'حالة الطلب الحالية: "قيد التحقق من الدفع". نقوم بمطابقة إشعار التحويل البنكي مع الحساب البنكي وتسليمك البيانات فوراً.'
                  : 'Current status: "Pending Verification". Our team is reviewing your Arab Bank transfer receipt and will fulfill your order shortly.')}
            </p>
          </div>

          {/* Payment Proof Screenshot Preview */}
          {order?.paymentProofUrl && (
            <div className="payment-proof-customer-box">
              <div className="proof-box-header">
                <Package size={18} className="text-purple" />
                <h4 className="proof-box-title">{t('paymentProofScreenshot')}</h4>
              </div>
              <div className="proof-image-wrapper">
                <a
                  href={order.paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-link-zoom"
                  title="Click to view full image"
                >
                  <img
                    src={order.paymentProofUrl}
                    alt="Payment Transfer Proof"
                    className="customer-proof-thumb"
                  />
                  <span className="zoom-hint">
                    <ExternalLink size={14} />
                    <span>{language === 'ar' ? 'عرض بالحجم الكامل' : 'Open Full Screenshot'}</span>
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* Digital Access / Fulfillment Details Box (ONLY shown if admin manually provided it) */}
          {order?.fulfillmentNotes ? (
            <div className="fulfillment-box">
              <div className="fulfillment-header">
                <ShieldCheck size={18} className="text-green" />
                <h3 className="fulfillment-title">{t('fulfillmentDetails')}</h3>
              </div>
              <code className="cred-code">{order.fulfillmentNotes}</code>
            </div>
          ) : null}

          {/* Order Receipt Details */}
          {order && (
            <div className="receipt-details">
              <h4 className="receipt-title">{t('orderSummary')}</h4>
              <div className="receipt-items-list">
                {order.items?.map((it, idx) => (
                  <div key={idx} className="receipt-item-line">
                    <span>
                      {language === 'ar' ? (it.name_ar || it.name_en) : it.name_en}
                      {it.variantName_en ? ` (${it.variantName_en})` : ''}
                      {' '}x{it.quantity}
                    </span>
                    <strong>{formatPrice(it.price * it.quantity, language)}</strong>
                  </div>
                ))}
              </div>
              <div className="receipt-total-line">
                <span>{t('total')}:</span>
                <span className="receipt-total-val">{formatPrice(order.total, language)}</span>
              </div>
            </div>
          )}

          {/* Secondary Actions */}
          <div className="success-actions-row">
            <button onClick={handlePrint} className="btn btn-secondary print-btn">
              <Printer size={16} />
              <span>{t('printReceipt')}</span>
            </button>
            <Link to="/account" className="btn btn-outline">
              <span>{t('viewMyOrders')}</span>
              <ArrowIcon size={16} />
            </Link>
            <Link to="/" className="btn btn-secondary">
              <Home size={16} />
              <span>{t('navHome')}</span>
            </Link>
          </div>
        </div></Reveal>
      </div>

      <style>{`
        .success-page-root {
          padding-block: 40px 80px;
        }
        .success-card {
          max-width: 720px;
          margin-inline: auto;
          padding: 44px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .success-icon-wrap {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          border: 2px solid #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.35);
        }
        .success-check-icon {
          color: #10B981;
        }
        .success-title {
          font-size: 2.2rem;
          color: var(--text-white);
          margin-bottom: 18px;
        }
        .order-ref-box {
          background: rgba(124, 92, 252, 0.1);
          border: 1px dashed var(--primary-purple);
          border-radius: var(--radius-md);
          padding: 14px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
          width: 100%;
          max-width: 380px;
        }
        .ref-label {
          font-size: 0.76rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.8px;
        }
        .ref-val-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ref-code {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--accent-purple);
          letter-spacing: 1px;
        }
        .copied-text {
          font-size: 0.75rem;
          color: #10B981;
        }
        /* Highlight WhatsApp Action Banner */
        .whatsapp-action-banner {
          width: 100%;
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(18, 140, 126, 0.1) 100%);
          border: 2px solid #25D366;
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow: 0 8px 30px rgba(37, 211, 102, 0.25);
        }
        .wa-banner-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #25D366;
          color: #0D0F1A;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-banner-headline {
          font-size: 1.35rem;
          color: var(--text-white);
          font-weight: 800;
          line-height: 1.35;
          margin-bottom: 6px;
        }
        .wa-banner-sub {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 18px;
        }
        .btn-whatsapp-confirm {
          background: #25D366;
          color: #080A12;
          font-weight: 800;
          font-size: 1.1rem;
          padding: 14px 28px;
          border-radius: var(--radius-md);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .btn-whatsapp-confirm:hover {
          background: #2ee672;
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(37, 211, 102, 0.55);
        }
        .order-status-card {
          width: 100%;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 18px 20px;
          margin-bottom: 24px;
          text-align: start;
        }
        .status-indicator-line {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .status-label-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-white);
        }
        .status-badge-large {
          font-size: 0.88rem;
          padding: 4px 12px;
        }
        .status-explanation {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .receipt-details {
          width: 100%;
          text-align: start;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-sm);
          padding: 18px;
          margin-bottom: 28px;
        }
        .receipt-title {
          font-size: 0.95rem;
          color: var(--text-white);
          margin-bottom: 12px;
        }
        .receipt-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }
        .receipt-item-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .receipt-total-line {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 10px;
          font-weight: 700;
          color: var(--text-white);
        }
        .receipt-total-val {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--accent-purple);
        }
        .fulfillment-box {
          width: 100%;
          text-align: start;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-sm);
          padding: 18px;
          margin-bottom: 24px;
        }
        .fulfillment-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          color: #10B981;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .cred-code {
          font-family: monospace;
          background: #090B13;
          padding: 10px 14px;
          border-radius: 4px;
          color: #F1F5F9;
          font-size: 0.9rem;
          display: block;
          word-break: break-all;
        }
        .payment-proof-customer-box {
          width: 100%;
          text-align: start;
          background: rgba(124, 92, 252, 0.06);
          border: 1px solid rgba(124, 92, 252, 0.25);
          border-radius: var(--radius-sm);
          padding: 16px;
          margin-bottom: 22px;
        }
        .proof-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .proof-box-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-white);
          margin: 0;
        }
        .proof-image-wrapper {
          display: flex;
          align-items: center;
        }
        .proof-link-zoom {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 8px 14px;
          transition: all 0.2s;
          text-decoration: none;
        }
        .proof-link-zoom:hover {
          border-color: var(--accent-purple);
          background: rgba(124, 92, 252, 0.12);
        }
        .customer-proof-thumb {
          width: 54px;
          height: 54px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .zoom-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          color: var(--accent-purple);
          font-weight: 600;
        }
        .success-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (max-width: 480px) {
          .success-page-root {
            padding-block: 24px 60px;
          }
          .success-card {
            padding: 24px 16px;
          }
          .success-title {
            font-size: 1.7rem;
          }
          .wa-banner-headline {
            font-size: 1.15rem;
          }
          .btn-whatsapp-confirm {
            width: 100%;
            justify-content: center;
            font-size: 0.95rem;
            padding: 12px 16px;
            white-space: normal;
            text-align: center;
          }
          .success-actions-row {
            flex-direction: column;
            width: 100%;
          }
          .success-actions-row .btn {
            width: 100%;
          }
          .ref-code {
            font-size: 1.3rem;
            word-break: break-all;
          }
        }
      `}</style>
    </div>
  );
};
