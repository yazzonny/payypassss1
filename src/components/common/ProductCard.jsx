import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { Tilt } from '../fx/Tilt';
import { ShoppingCart, Star, Zap } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { language, t, tObj } = useLanguage();
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    addToCart(product, defaultVariant, 1);
  };

  const name = tObj(product, 'name');
  const description = tObj(product, 'description');
  const badge = tObj(product, 'badge');
  const defaultVariant = product.variants?.[0];
  const displayPrice = defaultVariant ? defaultVariant.price : product.price;

  return (
    <Tilt max={7}>
    <div className="product-card glass-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        {/* Image & Badges */}
        <div className="product-image-wrap">
          <img
            src={product.imageUrl}
            alt={name}
            className="product-img"
            loading="lazy"
          />
          <div className="product-badge-overlay">
            {badge && (
              <span className="badge badge-primary">
                <Zap size={11} /> {badge}
              </span>
            )}
            <span className="badge badge-category">
              {product.category === 'subscriptions' ? (language === 'ar' ? 'اشتراكات' : 'Subscription') : (language === 'ar' ? 'ألعاب' : 'Gaming')}
            </span>
          </div>

          <div className="stock-indicator">
            <span className={`stock-dot ${product.inStock ? 'in-stock' : 'out-stock'}`} />
            <span className="stock-text">
              {product.inStock ? (language === 'ar' ? 'تسليم فوري' : 'Instant') : (language === 'ar' ? 'نفد' : 'Sold Out')}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="product-info-wrap">
          <div className="product-rating-row">
            <div className="stars-group">
              <Star size={13} className="star-icon filled" />
              <span className="rating-val">{product.rating || '4.9'}</span>
            </div>
            <span className="reviews-val">({product.reviewsCount || 150}+)</span>
          </div>

          <h3 className="product-title">{name}</h3>
          <p className="product-desc-clamp">{description}</p>

          {/* Variants Quick preview */}
          {product.variants && product.variants.length > 1 && (
            <div className="variants-pill-row">
              <span className="variants-count-badge">
                {product.variants.length} {language === 'ar' ? 'باقات متوفرة' : 'Options available'}
              </span>
            </div>
          )}

          {/* Price & Action Row */}
          <div className="product-footer-row">
            <div className="price-box">
              <span className="price-from-label">{language === 'ar' ? 'يبدأ من' : 'From'}</span>
              <span className="price-amount">{formatPrice(displayPrice, language)}</span>
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`btn btn-sm btn-primary add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
              aria-label={t('addToCart')}
            >
              <ShoppingCart size={15} />
              <span>{t('addToCart')}</span>
            </button>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          border-color: var(--border-active);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45), var(--shadow-glow);
        }
        .product-card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          color: inherit;
        }
        .product-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #0f1220;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
        .product-badge-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          z-index: 2;
        }
        [dir="rtl"] .product-badge-overlay {
          left: auto;
          right: 10px;
        }
        .stock-indicator {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(13, 15, 26, 0.85);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 2;
        }
        [dir="rtl"] .stock-indicator {
          right: auto;
          left: 10px;
        }
        .stock-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .stock-dot.in-stock {
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }
        .stock-dot.out-stock {
          background: #EF4444;
        }
        .stock-text {
          font-size: 0.7rem;
          color: var(--text-white);
          font-weight: 600;
        }
        .product-info-wrap {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 0.78rem;
        }
        .stars-group {
          display: flex;
          align-items: center;
          gap: 3px;
          color: #FBBF24;
        }
        .star-icon.filled {
          fill: #FBBF24;
        }
        .rating-val {
          font-weight: 700;
          color: var(--text-white);
        }
        .reviews-val {
          color: var(--text-muted);
        }
        .product-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 6px;
          line-height: 1.35;
          color: var(--text-white);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-desc-clamp {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .variants-pill-row {
          margin-bottom: 12px;
        }
        .variants-count-badge {
          display: inline-block;
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(124, 92, 252, 0.1);
          color: var(--accent-purple);
          border: 1px dashed rgba(124, 92, 252, 0.3);
        }
        .product-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-top: auto;
          gap: 8px;
        }
        .price-box {
          display: flex;
          flex-direction: column;
        }
        .price-from-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .price-amount {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-white);
          font-family: var(--font-heading);
          letter-spacing: 0.5px;
        }
        .add-to-cart-btn {
          padding: 8px 14px;
          font-size: 0.85rem;
        }
        @media (max-width: 540px) {
          .product-info-wrap {
            padding: 12px;
          }
          .product-desc-clamp {
            display: none;
          }
          .product-title {
            font-size: 0.95rem;
            margin-bottom: 4px;
          }
          .price-amount {
            font-size: 1.1rem;
          }
        }
        @media (max-width: 440px) {
          .add-to-cart-btn {
            padding: 8px 10px;
          }
          .add-to-cart-btn span {
            display: none;
          }
          .product-badge-overlay {
            top: 6px;
            left: 6px;
          }
          [dir="rtl"] .product-badge-overlay {
            left: auto;
            right: 6px;
          }
          .badge-category {
            display: none;
          }
        }
      `}</style>
    </div>
    </Tilt>
  );
};
