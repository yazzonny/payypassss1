import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { productService } from '../config/firebase';
import { useLanguage } from '../../src/context/LanguageContext';
import { Search, Filter, Layers, Tv, Gamepad2, SlidersHorizontal, X } from 'lucide-react';

export const CatalogPage = () => {
  const { language, t, tObj } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const categoryParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sync category param with state
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    searchParams.delete('category');
    setSearchParams(searchParams);
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && !p.inStock) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameEn = (p.name_en || '').toLowerCase();
          const nameAr = (p.name_ar || '').toLowerCase();
          const descEn = (p.description_en || '').toLowerCase();
          const descAr = (p.description_ar || '').toLowerCase();
          return nameEn.includes(q) || nameAr.includes(q) || descEn.includes(q) || descAr.includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="catalog-page-root">
      <div className="container catalog-container">
        {/* Page Header */}
        <div className="catalog-page-header">
          <h1 className="catalog-title">{t('catalogTitle')}</h1>
          <p className="catalog-subtitle">{t('catalogSubtitle')}</p>
        </div>

        {/* Filter Toolbar */}
        <div className="catalog-toolbar glass-card">
          {/* Search Box */}
          <div className="catalog-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="catalog-category-tabs">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`cat-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              <Layers size={16} />
              <span>{t('allCategories')}</span>
            </button>
            <button
              onClick={() => handleCategorySelect('subscriptions')}
              className={`cat-tab-btn ${selectedCategory === 'subscriptions' ? 'active' : ''}`}
            >
              <Tv size={16} />
              <span>{t('navSubscriptions')}</span>
            </button>
            <button
              onClick={() => handleCategorySelect('gaming')}
              className={`cat-tab-btn ${selectedCategory === 'gaming' ? 'active' : ''}`}
            >
              <Gamepad2 size={16} />
              <span>{t('navGaming')}</span>
            </button>
          </div>

          {/* Sorting & Options */}
          <div className="catalog-controls-row">
            <div className="sort-group">
              <label className="sort-label">{t('filterByPrice')}:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select sort-select"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price_asc">{t('sortPriceAsc')}</option>
                <option value="price_desc">{t('sortPriceDesc')}</option>
              </select>
            </div>

            <label className="stock-toggle-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="stock-checkbox"
              />
              <span>{t('inStockOnly')}</span>
            </label>
          </div>
        </div>

        {/* Results Bar */}
        <div className="catalog-results-meta">
          <span>
            {language === 'ar'
              ? `عرض ${filteredProducts.length} من إجمالي ${products.length} منتج`
              : `Showing ${filteredProducts.length} of ${products.length} products`}
          </span>
          {(selectedCategory !== 'all' || searchQuery || inStockOnly || sortBy !== 'featured') && (
            <button onClick={handleResetFilters} className="btn-text-reset">
              <X size={14} />
              <span>{t('resetFilters')}</span>
            </button>
          )}
        </div>

        {/* Products Grid or Empty State */}
        {loading ? (
          <div className="catalog-loading-state">
            <div className="spinner" />
            <p>{language === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading catalog...'}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid-products">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty-card glass-card">
            <Filter size={48} className="empty-icon" />
            <h3 className="empty-title">{t('noProductsFound')}</h3>
            <p className="empty-desc">
              {language === 'ar'
                ? 'جرّب كتابة كلمات بحث أخرى أو إزالة الفلاتر المحددة.'
                : 'Try different search keywords or clear your active category filters.'}
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              {t('resetFilters')}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .catalog-page-root {
          padding-block: 40px 80px;
        }
        .catalog-page-header {
          margin-bottom: 28px;
        }
        .catalog-title {
          font-size: 2.4rem;
          color: var(--text-white);
          margin-bottom: 6px;
        }
        .catalog-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
        }
        .catalog-toolbar {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 24px;
        }
        .catalog-search-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }
        [dir="rtl"] .search-icon {
          left: auto;
          right: 14px;
        }
        .catalog-search-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 14px 44px;
          color: var(--text-white);
          font-size: 0.98rem;
          transition: all var(--transition-fast);
        }
        .catalog-search-input:focus {
          outline: none;
          border-color: var(--primary-purple);
          box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.25);
        }
        .search-clear-btn {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        [dir="rtl"] .search-clear-btn {
          right: auto;
          left: 14px;
        }
        .catalog-category-tabs {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .cat-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .cat-tab-btn:hover {
          color: var(--text-white);
          border-color: var(--border-active);
          background: var(--primary-soft);
        }
        .cat-tab-btn.active {
          color: var(--text-white);
          background: var(--primary-purple);
          border-color: var(--primary-purple);
          box-shadow: 0 4px 14px rgba(124, 92, 252, 0.35);
        }
        .catalog-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 14px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .sort-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sort-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .sort-select {
          padding: 8px 12px;
          font-size: 0.88rem;
          width: auto;
          min-width: 170px;
        }
        .stock-toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          cursor: pointer;
          user-select: none;
        }
        .stock-checkbox {
          accent-color: var(--primary-purple);
          width: 16px;
          height: 16px;
        }
        .catalog-results-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 0.86rem;
          color: var(--text-muted);
        }
        .btn-text-reset {
          background: transparent;
          border: none;
          color: var(--accent-purple);
          font-size: 0.85rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }
        .btn-text-reset:hover {
          text-decoration: underline;
        }
        .catalog-loading-state {
          text-align: center;
          padding-block: 80px;
          color: var(--text-secondary);
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-subtle);
          border-top-color: var(--primary-purple);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .catalog-empty-card {
          text-align: center;
          padding: 60px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .empty-icon {
          color: var(--text-muted);
        }
        .empty-title {
          font-size: 1.3rem;
          color: var(--text-white);
        }
        .empty-desc {
          color: var(--text-secondary);
          font-size: 0.92rem;
          max-width: 450px;
          margin-bottom: 10px;
        }
        @media (max-width: 680px) {
          .catalog-page-root {
            padding-block: 24px 60px;
          }
          .catalog-toolbar {
            padding: 14px;
            gap: 14px;
          }
          .catalog-category-tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 6px;
            margin-inline: -4px;
            padding-inline: 4px;
          }
          .catalog-category-tabs::-webkit-scrollbar {
            display: none;
          }
          .cat-tab-btn {
            padding: 8px 14px;
            font-size: 0.84rem;
            flex-shrink: 0;
          }
          .catalog-controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .sort-group {
            width: 100%;
            justify-content: space-between;
          }
          .sort-select {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};
