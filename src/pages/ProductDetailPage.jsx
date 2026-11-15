import { Tilt } from '../components/fx/Tilt';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../config/firebase';
import { useLanguage } from '../../src/context/LanguageContext';
import { useCart } from '../../src/context/CartContext';
import { formatPrice } from '../utils/formatters';
import { ProductCard } from '../components/common/ProductCard';
import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Sparkles,
  Lock
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t, tObj, isRTL } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const prod = await productService.getById(id);
        if (prod) {
          setProduct(prod);
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          } else {
            setSelectedVariant(null);
          }
          // Load related products
          const all = await productService.getAll();
          const related = all
            .filter(p => p.id !== prod.id && p.category === prod.category)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="container py-80 text-center">
        <div className="spinner" />
        <p>{language === 'ar' ? 'جاري تحميل تفاصيل المنتج...' : 'Loading product...'}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-80 text-center">
        <h2>{language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
        <Link to="/catalog" className="btn btn-primary mt-20">
          {t('viewAll')}
        </Link>
      </div>
    );
  }

  const name = tObj(product, 'name');
  const description = tObj(product, 'description');
  const badge = tObj(product, 'badge');
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const features = language === 'ar' ? (product.features_ar || product.features_en) : (product.features_en || product.features_ar);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  return (
    <div className="detail-page-root">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb">
          <Link to="/">{t('navHome')}</Link>
          <ChevronIcon size={14} />
          <Link to="/catalog">{t('navCatalog')}</Link>
          <ChevronIcon size={14} />
          <span className="breadcrumb-current">{name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="detail-grid">
          {/* Product Media Column */}
          <div className="detail-media-wrap">
            <div className="detail-image-box glass-card">
              <Tilt max={8} scale={1.02}><img src={product.imageUrl} alt={name} className="detail-main-img" /></Tilt>
              {badge && (
                <span className="badge badge-primary detail-badge-top">
                  <Zap size={12} /> {badge}
                </span>
              )}
            </div>

            {/* Quick Guarantees Box */}
            <div className="detail-guarantees glass-card">
              <div className="guarantee-row">
                <Zap size={18} className="guarantee-icon text-yellow" />
                <span>{t('deliveryNote')}</span>
              </div>
              <div className="guarantee-row">
                <ShieldCheck size={18} className="guarantee-icon text-green" />
                <span>{t('guaranteeNote')}</span>
              </div>
              <div className="guarantee-row">
                <Lock size={18} className="guarantee-icon text-purple" />
                <span>{language === 'ar' ? 'بيانات مشفرة ومحمية بالكامل' : '100% Encrypted & Private Account'}</span>
              </div>
            </div>
          </div>

          {/* Product Actions & Info Column */}
          <div className="detail-info-col">
            <div className="detail-header-meta">
              <span className="badge badge-category">
                {product.category === 'subscriptions'
                  ? (language === 'ar' ? 'اشتراكات رقمية' : 'Digital Subscription')
                  : (language === 'ar' ? 'ألعاب وبطاقات' : 'Gaming & Gift Cards')}
              </span>
              <div className="detail-reviews-badge">
                <div className="stars-group">
                  <Star size={14} className="star-filled" />
                  <span className="rating-num">{product.rating || '4.9'}</span>
                </div>
                <span>({product.reviewsCount || 150}+ {t('reviews')})</span>
              </div>
            </div>

            <h1 className="detail-title">{name}</h1>
            <p className="detail-desc">{description}</p>

            {/* Price Display */}
            <div className="detail-price-box">
              <div className="price-tag-row">
                <span className="detail-price-val">
                  {formatPrice(currentPrice * quantity, language)}
                </span>
                {quantity > 1 && (
                  <span className="detail-price-per-unit">
                    ({formatPrice(currentPrice, language)} / {language === 'ar' ? 'للقطعة' : 'each'})
                  </span>
                )}
              </div>
              <div className="stock-pill">
                <span className="stock-dot in-stock" />
                <span>{t('inStock')}</span>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="detail-variants-group">
                <label className="variant-group-label">
                  <Sparkles size={15} />
                  <span>{t('selectVariant')}</span>
                </label>
                <div className="variants-options-grid">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vName = language === 'ar' ? (v.name_ar || v.name_en) : v.name_en;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`variant-select-btn ${isSelected ? 'active' : ''}`}
                      >
                        <span className="variant-name">{vName}</span>
                        <span className="variant-price">{formatPrice(v.price, language)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="detail-qty-row">
              <span className="qty-label">{t('qty')}:</span>
              <div className="qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="stepper-btn"
                  aria-label="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="stepper-val">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="stepper-btn"
                  aria-label="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="detail-action-buttons">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-lg btn-outline flex-1 add-cart-btn"
              >
                <ShoppingCart size={18} />
                <span>{t('addToCart')}</span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="btn btn-lg btn-primary flex-1 buy-now-btn"
              >
                <Zap size={18} />
                <span>{t('buyNow')}</span>
              </button>
            </div>

            {/* Toast Notification */}
            {addedToast && (
              <div className="added-toast animate-glow">
                <CheckCircle2 size={16} />
                <span>{language === 'ar' ? 'تمت إضافة المنتج إلى سلة المشتريات!' : 'Added to cart successfully!'}</span>
                <Link to="/cart" className="toast-cart-link">{t('cart')}</Link>
              </div>
            )}

            {/* Features Checklist */}
            {features && features.length > 0 && (
              <div className="detail-features-box">
                <h3 className="features-title">{t('featuresTitle')}</h3>
                <ul className="features-list">
                  {features.map((feat, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="feature-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <h2 className="section-title">{t('relatedProducts')}</h2>
            <div className="grid-products mt-24">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .detail-page-root {
          padding-block: 28px 80px;
        }
        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.86rem;
          color: var(--text-muted);
          margin-bottom: 28px;
        }
        .detail-breadcrumb a:hover {
          color: var(--accent-purple);
        }
        .breadcrumb-current {
          color: var(--text-white);
          font-weight: 600;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 48px;
          align-items: flex-start;
          margin-bottom: 60px;
        }
        .detail-media-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .detail-image-box {
          position: relative;
          aspect-ratio: 16 / 11;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #0f1220;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .detail-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-badge-top {
          position: absolute;
          top: 16px;
          left: 16px;
          font-size: 0.82rem;
          padding: 6px 14px;
        }
        [dir="rtl"] .detail-badge-top {
          left: auto;
          right: 16px;
        }
        .detail-guarantees {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .guarantee-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }
        .text-yellow { color: #FBBF24; }
        .text-green { color: #10B981; }
        .detail-info-col {
          display: flex;
          flex-direction: column;
        }
        .detail-header-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .detail-reviews-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .detail-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-white);
          margin-bottom: 14px;
          line-height: 1.25;
        }
        .detail-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .detail-price-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          background: rgba(124, 92, 252, 0.08);
          border: 1px solid var(--border-active);
          margin-bottom: 28px;
        }
        .detail-price-val {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--text-white);
          line-height: 1;
        }
        .detail-price-per-unit {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-inline-start: 8px;
        }
        .stock-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #10B981;
        }
        .detail-variants-group {
          margin-bottom: 24px;
        }
        .variant-group-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--text-white);
          margin-bottom: 12px;
        }
        .variants-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 10px;
        }
        .variant-select-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--transition-fast);
          color: inherit;
        }
        [dir="rtl"] .variant-select-btn {
          align-items: flex-start;
          text-align: start;
        }
        .variant-select-btn:hover {
          border-color: var(--border-active);
          background: var(--bg-surface-elevated);
        }
        .variant-select-btn.active {
          background: rgba(124, 92, 252, 0.15);
          border-color: var(--primary-purple);
          box-shadow: 0 0 14px rgba(124, 92, 252, 0.25);
        }
        .variant-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-white);
          margin-bottom: 4px;
        }
        .variant-price {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--accent-purple);
        }
        .detail-qty-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .qty-label {
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--text-secondary);
        }
        .qty-stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          overflow: hidden;
        }
        .stepper-btn {
          background: transparent;
          border: none;
          color: var(--text-white);
          padding: 8px 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .stepper-btn:hover {
          background: var(--primary-soft);
          color: var(--accent-purple);
        }
        .stepper-val {
          padding-inline: 14px;
          font-weight: 700;
          font-size: 0.95rem;
          min-width: 32px;
          text-align: center;
        }
        .detail-action-buttons {
          display: flex;
          gap: 14px;
          margin-bottom: 20px;
        }
        .flex-1 { flex: 1; }
        .added-toast {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid #10B981;
          color: #10B981;
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .toast-cart-link {
          margin-inline-start: auto;
          text-decoration: underline;
          color: var(--text-white);
        }
        .detail-features-box {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .features-title {
          font-size: 1.05rem;
          color: var(--text-white);
          margin-bottom: 12px;
        }
        .features-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .features-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }
        .feature-check {
          color: #10B981;
          flex-shrink: 0;
        }
        .related-products-section {
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .mt-24 { margin-top: 24px; }
        .py-80 { padding-block: 80px; }
        @media (max-width: 860px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .features-list {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .detail-page-root {
            padding-block: 18px 60px;
          }
          .detail-title {
            font-size: 1.65rem;
          }
          .detail-price-val {
            font-size: 1.8rem;
          }
          .detail-price-box {
            padding: 12px 14px;
            flex-wrap: wrap;
            gap: 8px;
          }
          .variants-options-grid {
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 8px;
          }
          .variant-select-btn {
            padding: 10px;
          }
          .detail-action-buttons {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }
          .detail-action-buttons .btn {
            width: 100%;
          }
          .detail-guarantees {
            padding: 14px;
            gap: 10px;
          }
          .guarantee-row {
            font-size: 0.82rem;
          }
        }
      `}</style>
    </div>
  );
};
