import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../src/context/LanguageContext';
import { useCart } from '../../src/context/CartContext';
import { useAuth } from '../../src/context/AuthContext';
import { orderService } from '../config/firebase';
import { formatPrice } from '../utils/formatters';
import { PaymentPlaceholder } from '../components/checkout/PaymentPlaceholder';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  FileText,
  Lock,
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage = () => {
  const { language, t, isRTL } = useLanguage();
  const { items, subtotal, discountAmount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = language === 'ar' ? 'الاسم مطلوب' : 'Full name is required';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Valid email is required for delivery';
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      newErrors.phone = language === 'ar' ? 'رقم الهاتف / الواتساب مطلوب' : 'Phone or WhatsApp number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteOrder = async (paymentProofUrl) => {
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      throw new Error('Validation failed');
    }

    if (items.length === 0) {
      navigate('/catalog');
      return;
    }

    setIsProcessing(true);
    try {
      const orderPayload = {
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes
        },
        items: items.map(it => ({
          id: it.productId,
          name_en: it.name_en,
          name_ar: it.name_ar,
          variantName_en: it.variantName_en,
          variantName_ar: it.variantName_ar,
          price: it.price,
          quantity: it.quantity,
          imageUrl: it.imageUrl
        })),
        subtotal,
        discountAmount,
        couponCode: coupon?.code || null,
        total,
        paymentProofUrl: paymentProofUrl || '',
        userId: user?.uid || null
      };

      const createdOrder = await orderService.create(orderPayload);
      clearCart();
      navigate(`/order-success/${createdOrder.id}`, { state: { order: createdOrder } });
    } catch (err) {
      if (err.message !== 'Validation failed') {
        console.error('Order creation error:', err);
        alert(language === 'ar' ? 'حدث خطأ أثناء إنشاء الطلب' : 'Failed to create order. Please try again.');
      }
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-80 text-center">
        <h2>{t('emptyCart')}</h2>
        <Link to="/catalog" className="btn btn-primary mt-20">
          {language === 'ar' ? 'الذهاب للمتجر' : 'Browse Catalog'}
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-root">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">{t('checkoutTitle')}</h1>
          <p className="checkout-subtitle">{t('checkoutSubtitle')}</p>
        </div>

        <div className="checkout-layout-grid">
          {/* Main Form Column */}
          <div className="checkout-main-col">
            {/* Step 1: Customer Details */}
            <div className="checkout-card glass-card">
              <div className="card-step-header">
                <User size={20} className="step-icon" />
                <h2 className="step-title">{t('contactInfo')}</h2>
              </div>

              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">{t('fullName')} *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('fullNamePlaceholder')}
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label">{t('emailAddress')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('emailPlaceholder')}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Phone / WhatsApp */}
                <div className="form-group">
                  <label className="form-label">{t('phone')} *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('phonePlaceholder')}
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                {/* Optional Notes */}
                <div className="form-group">
                  <label className="form-label">{t('orderNotes')}</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={t('notesPlaceholder')}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Component Placeholder */}
            <div className="checkout-card glass-card mt-24">
              <div className="card-step-header">
                <Lock size={20} className="step-icon" />
                <h2 className="step-title">{t('paymentStep')}</h2>
              </div>

              <PaymentPlaceholder
                total={total}
                onPaymentSuccess={handleCompleteOrder}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="checkout-sidebar-col">
            <div className="checkout-summary-card glass-card">
              <h3 className="summary-title">{t('orderSummary')}</h3>

              <div className="summary-items-list">
                {items.map((item) => {
                  const name = language === 'ar' ? (item.name_ar || item.name_en) : item.name_en;
                  const variant = language === 'ar' ? (item.variantName_ar || item.variantName_en) : item.variantName_en;
                  return (
                    <div key={item.cartItemId} className="checkout-item-row">
                      <img src={item.imageUrl} alt={name} className="checkout-item-img" />
                      <div className="checkout-item-info">
                        <span className="checkout-item-title">{name}</span>
                        <div className="checkout-item-meta">
                          <span className="item-variant">{variant}</span>
                          <span className="item-qty">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="checkout-item-total">
                        {formatPrice(item.price * item.quantity, language)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="summary-divider" />

              <div className="summary-breakdown">
                <div className="summary-line">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(subtotal, language)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-line text-green">
                    <span>{t('discount')} ({coupon?.percentage}%)</span>
                    <span>-{formatPrice(discountAmount, language)}</span>
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-line total-line">
                  <span>{t('total')}</span>
                  <span className="total-val">{formatPrice(total, language)}</span>
                </div>
              </div>

              <div className="checkout-security-box">
                <ShieldCheck size={18} className="text-green" />
                <span>
                  {language === 'ar'
                    ? 'تسوق آمن ومحمي بأعلى معايير التشفير'
                    : '256-Bit SSL Encrypted Checkout'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page-root {
          padding-block: 36px 80px;
        }
        .checkout-header {
          margin-bottom: 28px;
        }
        .checkout-title {
          font-size: 2.2rem;
          color: var(--text-white);
          margin-bottom: 4px;
        }
        .checkout-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .checkout-layout-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 32px;
          align-items: flex-start;
        }
        .checkout-card {
          padding: 26px;
        }
        .card-step-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 14px;
        }
        .step-icon {
          color: var(--accent-purple);
        }
        .step-title {
          font-size: 1.25rem;
          color: var(--text-white);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .input-error {
          border-color: var(--danger) !important;
        }
        .error-text {
          font-size: 0.78rem;
          color: var(--danger);
          margin-top: 4px;
        }
        .checkout-summary-card {
          padding: 26px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 320px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .checkout-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .checkout-item-img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          background: #0f1220;
          border: 1px solid var(--border-subtle);
        }
        .checkout-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .checkout-item-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-white);
          line-height: 1.3;
        }
        .checkout-item-meta {
          display: flex;
          gap: 8px;
          font-size: 0.76rem;
          color: var(--text-muted);
        }
        .checkout-item-total {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-white);
        }
        .checkout-security-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
        }
        .mt-24 { margin-top: 24px; }
        @media (max-width: 900px) {
          .checkout-layout-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .checkout-page-root {
            padding-block: 20px 60px;
          }
          .checkout-card, .checkout-summary-card {
            padding: 16px;
          }
          .checkout-title {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </div>
  );
};
