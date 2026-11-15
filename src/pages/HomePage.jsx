import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { CategoryBanners } from '../components/home/CategoryBanners';
import { TrustSection } from '../components/home/TrustSection';
import { Reveal } from '../components/fx/Reveal';
import { ProductCard } from '../components/common/ProductCard';
import { productService } from '../config/firebase';
import { useLanguage } from '../../src/context/LanguageContext';
import { Sparkles, ArrowRight, ArrowLeft, Star } from 'lucide-react';

export const HomePage = () => {
  const { language, t, isRTL } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load home products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.featured || p.badge_en === 'Best Seller').slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="home-page-root">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Category Sections */}
      <CategoryBanners />

      {/* 3. Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div>
              <div className="section-pill">
                <Sparkles size={13} />
                <span>{language === 'ar' ? 'أفضل العروض المختارة' : 'Curated Best Sellers'}</span>
              </div>
              <h2 className="section-title">{t('featuredTitle')}</h2>
              <p className="section-subtitle">{t('featuredSubtitle')}</p>
            </div>
            <Link to="/catalog" className="btn btn-outline view-all-btn">
              <span>{t('viewAll')}</span>
              <ArrowIcon size={16} />
            </Link>
          </div>

          <div className="grid-products">
            {displayProducts.map((prod, i) => (
              <Reveal key={prod.id} delay={i * 80}><ProductCard product={prod} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust & Security Section */}
      <TrustSection />

      {/* 5. Customer Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <div className="reviews-header text-center">
            <h2 className="section-title">
              {language === 'ar' ? 'ماذا يقول عملاؤنا عن PlayPass' : 'Loved by Over 50,000 Gamers'}
            </h2>
            <p className="section-subtitle">
              {language === 'ar' ? 'تقييمات حقيقية من عملاء موثقين في الشرق الأوسط والعالم' : 'Real reviews from verified buyers across streaming and gaming'}
            </p>
          </div>

          <div className="reviews-grid">
            <div className="review-card glass-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="star-filled" />
                ))}
              </div>
              <p className="review-text">
                {language === 'ar'
                  ? 'اشتريت اشتراك نتفلكس 4K وتم التسليم في أقل من دقيقة واحدة! الملف خاص ومقفل برمز سري والجودة خرافية.'
                  : 'Bought Netflix 4K and received my private PIN in less than 60 seconds. Flawless streaming quality and warranty!'}
              </p>
              <div className="review-author">
                <div className="author-avatar">FA</div>
                <div>
                  <div className="author-name">Faisal Al-Otaibi</div>
                  <div className="author-tag">Riyadh, KSA • Verified Buyer</div>
                </div>
              </div>
            </div>

            <div className="review-card glass-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="star-filled" />
                ))}
              </div>
              <p className="review-text">
                {language === 'ar'
                  ? 'شحنت كود بلايستيشن ستور 50 دولار، الكود وصلني فوراً وشحنته في حسابي الأمريكي بدون أي مشاكل.'
                  : 'Instant code for my $50 US PSN wallet card. Smooth checkout, great price, and instant code right on screen.'}
              </p>
              <div className="review-author">
                <div className="author-avatar">MJ</div>
                <div>
                  <div className="author-name">Mark Johnson</div>
                  <div className="author-tag">Dubai, UAE • Verified Gamer</div>
                </div>
              </div>
            </div>

            <div className="review-card glass-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="star-filled" />
                ))}
              </div>
              <p className="review-text">
                {language === 'ar'
                  ? 'اشتراك IPTV ممتاز وسيرفرات البث الرياضي سريعة جداً في مباريات الدوري الإنجليزي ودوري الأبطال.'
                  : 'The VIP IPTV subscription has zero buffering during Premier League matches. Outstanding customer care on WhatsApp!'}
              </p>
              <div className="review-author">
                <div className="author-avatar">TA</div>
                <div>
                  <div className="author-name">Tariq Al-Mansoor</div>
                  <div className="author-tag">Kuwait City • Verified Buyer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter / CTA Community Bar */}
      <section className="community-bar-section">
        <div className="container">
          <div className="community-banner glass-card">
            <div className="community-content">
              <h3 className="community-title">
                {language === 'ar' ? 'انضم إلى مجتمع PlayPass الحصري' : 'Join the VIP Gamer Club'}
              </h3>
              <p className="community-desc">
                {language === 'ar'
                  ? 'احصل على خصومات حصرية، تنبيهات الألعاب الجديدة، وأكواد مجانية أسبوعياً.'
                  : 'Get exclusive subscriber discounts, flash deals on PSN/Steam, and priority delivery.'}
              </p>
            </div>
            <div className="community-action">
              <Link to="/catalog" className="btn btn-lg btn-primary">
                <span>{t('heroCtaShop')}</span>
                <ArrowIcon size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .featured-section {
          padding-block: 40px 60px;
        }
        .featured-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .section-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(124, 92, 252, 0.12);
          border: 1px solid rgba(124, 92, 252, 0.3);
          color: var(--accent-purple);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .reviews-section {
          padding-block: 50px 70px;
          background: rgba(0, 0, 0, 0.2);
        }
        .reviews-header {
          margin-bottom: 40px;
        }
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .review-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .review-stars {
          display: flex;
          gap: 4px;
          color: #FBBF24;
        }
        .star-filled {
          fill: #FBBF24;
        }
        .review-text {
          font-size: 0.92rem;
          color: var(--text-primary);
          line-height: 1.6;
          flex: 1;
        }
        .review-author {
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 14px;
        }
        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C5CFC 0%, #4c28d4 100%);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }
        .author-name {
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--text-white);
        }
        .author-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .community-bar-section {
          padding-block: 40px 60px;
        }
        .community-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40px 48px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #161a2e 0%, #101324 100%);
          border: 1px solid var(--border-active);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), var(--shadow-glow);
          gap: 30px;
          flex-wrap: wrap;
        }
        .community-title {
          font-size: 1.8rem;
          color: var(--text-white);
          margin-bottom: 8px;
        }
        .community-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          max-width: 550px;
        }
        @media (max-width: 900px) {
          .reviews-grid {
            grid-template-columns: 1fr;
          }
          .community-banner {
            flex-direction: column;
            text-align: center;
            padding: 30px 24px;
          }
          .community-desc {
            margin-inline: auto;
          }
        }
      `}</style>
    </div>
  );
};
