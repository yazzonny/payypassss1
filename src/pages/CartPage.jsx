import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../src/context/LanguageContext';
import { useCart } from '../../src/context/CartContext';
import { formatPrice } from '../utils/formatters';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CartPage = () => {
  const { language, t, isRTL } = useLanguage();
  const {
    items,
    itemsCount,
    subtotal,
    discountAmount,
    total,
    coupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    if (res.success) {
      setPromoFeedback({ type: 'success', msg: t('promoApplied') });
    } else {
      setPromoFeedback({ type: 'error', msg: t('promoInvalid') });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-80">
        <div className="empty-cart-card glass-card text-center">
          <div className="empty-cart-icon-box">
            <ShoppingBag size={48} className="empty-bag-icon" />
          </div>
          <h2 className="empty-title">{t('emptyCart')}</h2>
          <p className="empty-subtitle">
            {language === 'ar'
              ? 'تصفح تشكيلتنا من اشتراكات نتفلكس، IPTV، وبطاقات بلايستيشن وستيم.'
              : 'Explore our selection of Netflix, IPTV, PlayStation cards, and Steam credit.'}
          </p>
          <Link to="/catalog" className="btn btn-lg btn-primary">
            <span>{language === 'ar' ? 'ابدأ التسوق الآن' : 'Start Shopping Now'}</span>
            <ArrowIcon size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-root">
      <div className="container">
        {/* Page Title */}
        <div className="cart-header">
          <h1 className="cart-title">{t('cartTitle')}</h1>
          <p className="cart-subtitle">
            {itemsCount} {language === 'ar' ? 'عناصر مختارة في سلتك' : 'items currently in your basket'}
          </p>
        </div>

        <div className="cart-layout-grid">
          {/* Items List Table/Cards */}
          <div className="cart-items-col">
            <div className="cart-items-card glass-card">
              <div className="cart-table-head">
                <span className="th-item">{t('item')}</span>
                <span className="th-price">{t('price')}</span>
                <span className="th-qty">{t('qty')}</span>
                <span className="th-total">{t('total')}</span>
                <span className="th-act"></span>
              </div>

              <div className="cart-items-list">
                {items.map((item) => {
                  const name = language === 'ar' ? (item.name_ar || item.name_en) : item.name_en;
                  const variant = language === 'ar' ? (item.variantName_ar || item.variantName_en) : item.variantName_en;
                  return (
                    <div key={item.cartItemId} className="cart-item-row">
                      <div className="item-meta">
                        <img src={item.imageUrl} alt={name} className="cart-item-img" />
                        <div className="item-text">
                          <Link to={`/product/${item.productId}`} className="item-name">
                            {name}
                          </Link>
                          {variant && <span className="item-variant-pill">{variant}</span>}
                          <span className="item-mobile-price">
                            {formatPrice(item.price, language)}
                          </span>
                        </div>
                      </div>

                      <div className="item-price-unit desktop-only">
                        {formatPrice(item.price, language)}
                      </div>

                      <div className="item-quantity-stepper">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="stepper-btn"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="stepper-val">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="stepper-btn"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="item-subtotal-val">
                        {formatPrice(item.price * item.quantity, language)}
                      </div>

                      <div className="item-remove-cell">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="item-remove-btn"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Footer Actions */}
              <div className="cart-table-footer">
                <Link to="/catalog" className="btn btn-outline btn-sm">
                  <ArrowIcon size={14} className="flip-rtl" />
                  <span>{t('continueShopping')}</span>
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="btn btn-text-clear"
                >
                  <Trash2 size={14} />
                  <span>{t('clearCart')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="cart-summary-col">
            <div className="cart-summary-card glass-card">
              <h3 className="summary-title">{t('orderSummary')}</h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="promo-form">
                <div className="promo-input-group">
                  <Tag size={16} className="promo-icon" />
                  <input
                    type="text"
                    placeholder={t('havePromo')}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="promo-input"
                  />
                  <button type="submit" className="btn btn-sm btn-secondary">
                    {t('apply')}
                  </button>
                </div>
                {promoFeedback && (
                  <div className={`promo-msg ${promoFeedback.type}`}>
                    {promoFeedback.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    <span>{promoFeedback.msg}</span>
                  </div>
                )}
                {coupon && (
                  <div className="applied-coupon-pill">
                    <span>Code: <strong>{coupon.code}</strong> (-{coupon.percentage}%)</span>
                    <button type="button" onClick={removeCoupon} className="coupon-remove-btn">✕</button>
                  </div>
                )}
              </form>

              {/* Totals Breakdown */}
              <div className="summary-breakdown">
                <div className="summary-line">
                  <span>{t('subtotal')}</span>
                  <span className="val">{formatPrice(subtotal, language)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-line text-green">
                    <span>{t('discount')} ({coupon?.percentage}%)</span>
                    <span className="val">-{formatPrice(discountAmount, language)}</span>
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-line total-line">
                  <span>{t('total')}</span>
                  <span className="total-val">{formatPrice(total, language)}</span>
                </div>
              </div>

              {/* Delivery Assurance */}
              <div className="summary-trust-badge">
                <Zap size={16} className="text-yellow" />
                <span>{t('deliveryNote')}</span>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="btn btn-lg btn-primary w-full checkout-cta-btn"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page-root {
          padding-block: 36px 80px;
        }
        .cart-header {
          margin-bottom: 28px;
        }
        .cart-title {
          font-size: 2.2rem;
          color: var(--text-white);
          margin-bottom: 4px;
        }
        .cart-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .cart-layout-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 32px;
          align-items: flex-start;
        }
        .cart-items-card {
          padding: 24px;
        }
        .cart-table-head {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1fr 1fr 40px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .cart-item-row {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1fr 1fr 40px;
          align-items: center;
          padding-block: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .item-meta {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cart-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          background: #0f1220;
          border: 1px solid var(--border-subtle);
        }
        .item-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .item-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-white);
          line-height: 1.3;
        }
        .item-name:hover {
          color: var(--accent-purple);
        }
        .item-variant-pill {
          font-size: 0.74rem;
          color: var(--accent-purple);
          background: rgba(124, 92, 252, 0.12);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }
        .item-mobile-price {
          display: none;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-white);
        }
        .item-price-unit {
          font-size: 0.92rem;
          color: var(--text-secondary);
        }
        .item-subtotal-val {
          font-size: 1.05rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-white);
        }
        .item-remove-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          transition: color 0.15s ease;
        }
        .item-remove-btn:hover {
          color: var(--danger);
        }
        .cart-table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
        }
        .btn-text-clear {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }
        .btn-text-clear:hover {
          color: var(--danger);
        }
        .cart-summary-card {
          padding: 26px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .summary-title {
          font-size: 1.3rem;
          color: var(--text-white);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 14px;
        }
        .promo-input-group {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .promo-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        [dir="rtl"] .promo-icon {
          left: auto;
          right: 12px;
        }
        .promo-input {
          flex: 1;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 12px 10px 36px;
          color: var(--text-white);
          font-size: 0.88rem;
        }
        [dir="rtl"] .promo-input {
          padding: 10px 36px 10px 12px;
        }
        .promo-msg {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          margin-top: 6px;
        }
        .promo-msg.success { color: #10B981; }
        .promo-msg.error { color: var(--danger); }
        .applied-coupon-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
          font-size: 0.82rem;
          color: #10B981;
          margin-top: 8px;
        }
        .coupon-remove-btn {
          background: transparent;
          border: none;
          color: #10B981;
          cursor: pointer;
          font-weight: 700;
        }
        .summary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.92rem;
          color: var(--text-secondary);
        }
        .summary-line.total-line {
          font-size: 1.15rem;
          color: var(--text-white);
          font-weight: 700;
        }
        .total-val {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          color: var(--accent-purple);
          font-weight: 900;
        }
        .summary-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin-block: 4px;
        }
        .summary-trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
        }
        .checkout-cta-btn {
          font-size: 1.05rem;
        }
        .empty-cart-card {
          max-width: 540px;
          margin-inline: auto;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        .empty-cart-icon-box {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(124, 92, 252, 0.12);
          border: 1px solid var(--border-active);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-purple);
        }
        @media (max-width: 900px) {
          .cart-layout-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .cart-table-head {
            display: none;
          }
          .desktop-only {
            display: none;
          }
          .item-mobile-price {
            display: block;
          }
        }
        @media (max-width: 600px) {
          .cart-page-root {
            padding-block: 20px 60px;
          }
          .cart-items-card {
            padding: 16px;
          }
          .cart-summary-card {
            padding: 18px;
          }
          .cart-item-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding-block: 16px;
          }
          .item-meta {
            width: 100%;
            align-items: flex-start;
          }
          .cart-item-img {
            width: 48px;
            height: 48px;
          }
          .item-quantity-stepper {
            order: 2;
          }
          .item-subtotal-val {
            order: 3;
            font-size: 1.15rem;
          }
          .item-remove-cell {
            order: 4;
          }
          .cart-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};
