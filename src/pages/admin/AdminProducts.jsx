import React, { useState, useEffect } from 'react';
import { productService, imageService } from '../../config/firebase';
import { useLanguage } from '../../../src/context/LanguageContext';
import { formatPrice } from '../../utils/formatters';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  UploadCloud,
  Layers,
  AlertCircle,
  Eye,
  Tv,
  Gamepad2
} from 'lucide-react';

export const AdminProducts = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    category: 'subscriptions',
    price: 9.99,
    imageUrl: '',
    inStock: true,
    badge_en: '',
    badge_ar: '',
    variants: [
      { id: '1m', name_en: '1 Month', name_ar: 'شهر واحد', price: 9.99 }
    ]
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      category: 'subscriptions',
      price: 9.99,
      imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      badge_en: 'Instant Delivery',
      badge_ar: 'تسليم فوري',
      variants: [
        { id: '1m', name_en: '1 Month', name_ar: 'شهر واحد', price: 9.99 }
      ]
    });
    setImagePreview('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name_en: product.name_en || '',
      name_ar: product.name_ar || '',
      description_en: product.description_en || '',
      description_ar: product.description_ar || '',
      category: product.category || 'subscriptions',
      price: product.price || 9.99,
      imageUrl: product.imageUrl || '',
      inStock: product.inStock !== false,
      badge_en: product.badge_en || '',
      badge_ar: product.badge_ar || '',
      variants: product.variants?.length ? product.variants : [
        { id: '1m', name_en: '1 Month', name_ar: 'شهر واحد', price: product.price || 9.99 }
      ]
    });
    setImagePreview(product.imageUrl || '');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = await imageService.upload(file);
      setImagePreview(url);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `var-${Date.now()}`,
          name_en: 'New Duration / Denomination',
          name_ar: 'باقة جديدة',
          price: prev.price
        }
      ]
    }));
  };

  const handleUpdateVariant = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  const handleRemoveVariant = (index) => {
    if (formData.variants.length <= 1) {
      alert(language === 'ar' ? 'يجب الإبقاء على باقة واحدة على الأقل' : 'Must have at least one variant');
      return;
    }
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name_en || !formData.name_ar) {
      alert(language === 'ar' ? 'يرجى إدخال اسم المنتج باللغتين' : 'Please provide product name in both languages');
      return;
    }

    setSaving(true);
    try {
      const productPayload = {
        ...formData,
        id: currentId || `prod-${Date.now()}`,
        price: parseFloat(formData.price) || 0
      };

      await productService.save(productPayload);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setDeleteConfirmId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const toggleStock = async (product) => {
    try {
      const updated = { ...product, inStock: !product.inStock };
      await productService.save(updated);
      fetchProducts();
    } catch (err) {
      console.error('Error toggling stock:', err);
    }
  };

  return (
    <div className="admin-products-root">
      {/* Top Header & Add Button */}
      <div className="products-top-header">
        <div>
          <h2 className="admin-page-title">{t('adminTabProducts')}</h2>
          <p className="admin-page-sub">
            {products.length} {language === 'ar' ? 'منتجات مسجلة في المتجر' : 'total items in catalog'}
          </p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>{t('adminAddNewProduct')}</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="products-table-card glass-card">
        {loading ? (
          <div className="py-80 text-center">
            <div className="spinner" />
            <p>{language === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{language === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th>{t('adminCategory')}</th>
                  <th>{t('adminBasePrice')}</th>
                  <th>{language === 'ar' ? 'الباقات' : 'Variants'}</th>
                  <th>{t('adminStockStatus')}</th>
                  <th className="text-end">{t('adminActions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>
                      <div className="prod-cell">
                        <img src={prod.imageUrl} alt="" className="prod-thumb" />
                        <div className="prod-names">
                          <strong className="prod-en-name">{prod.name_en}</strong>
                          <span className="prod-ar-name">{prod.name_ar}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-category">
                        {prod.category === 'subscriptions' ? (
                          <><Tv size={12} /> {language === 'ar' ? 'اشتراكات' : 'Subs'}</>
                        ) : (
                          <><Gamepad2 size={12} /> {language === 'ar' ? 'ألعاب' : 'Gaming'}</>
                        )}
                      </span>
                    </td>
                    <td>
                      <strong className="prod-price-text">{formatPrice(prod.price, language)}</strong>
                    </td>
                    <td>
                      <span className="variants-badge">
                        {prod.variants?.length || 1} {language === 'ar' ? 'خيارات' : 'options'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleStock(prod)}
                        className={`stock-toggle-btn ${prod.inStock ? 'in-stock' : 'out-stock'}`}
                        title="Click to toggle availability"
                      >
                        <span className="dot" />
                        <span>{prod.inStock ? t('inStock') : t('outOfStock')}</span>
                      </button>
                    </td>
                    <td className="text-end">
                      <div className="actions-cell">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="btn-icon edit-action-btn"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          className="btn-icon delete-action-btn"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-glow">
            <div className="modal-header">
              <h3 className="modal-title">
                {isEditing ? t('adminEditProduct') : t('adminAddNewProduct')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-form">
              {/* English & Arabic Names */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">{t('adminProductEnName')} *</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Netflix Premium 4K UHD"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('adminProductArName')} *</label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    className="form-input"
                    placeholder="مثال: اشتراك نتفلكس 4K ألترا HD"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Category, Base Price & Stock */}
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">{t('adminCategory')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="subscriptions">{t('navSubscriptions')}</option>
                    <option value="gaming">{t('navGaming')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('adminBasePrice')}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('adminStockStatus')}</label>
                  <div className="checkbox-wrap">
                    <label className="switch-label">
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="switch-input"
                      />
                      <span>{formData.inStock ? t('inStock') : t('outOfStock')}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Upload & Preview */}
              <div className="form-group">
                <label className="form-label">{t('adminImageUpload')}</label>
                <div className="image-upload-wrapper">
                  <div className="image-preview-box">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="preview-img" />
                    ) : (
                      <ImageIcon size={32} className="text-muted" />
                    )}
                  </div>
                  <div className="upload-input-col">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="file-input-native"
                      id="product-img-file"
                    />
                    <label htmlFor="product-img-file" className="btn btn-sm btn-outline">
                      <UploadCloud size={16} />
                      <span>{language === 'ar' ? 'اختر صورة من جهازك' : 'Upload Image File'}</span>
                    </label>
                    <input
                      type="url"
                      placeholder={language === 'ar' ? 'أو أدخل رابط صورة مباشر URL' : 'Or paste direct image URL'}
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="form-input mt-8"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions EN / AR */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">{t('adminDescEn')}</label>
                  <textarea
                    rows={3}
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="form-textarea"
                    placeholder="Key specifications, warranty details, etc."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('adminDescAr')}</label>
                  <textarea
                    rows={3}
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    className="form-textarea"
                    placeholder="المواصفات والضمان باللغة العربية"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Variants Section */}
              <div className="variants-editor-block">
                <div className="variants-editor-head">
                  <h4 className="variants-editor-title">{t('adminVariants')}</h4>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="btn btn-sm btn-secondary"
                  >
                    <Plus size={14} />
                    <span>{t('adminAddVariant')}</span>
                  </button>
                </div>

                <div className="variants-list-edit">
                  {formData.variants.map((v, idx) => (
                    <div key={v.id || idx} className="variant-edit-row">
                      <input
                        type="text"
                        placeholder="Variant (EN)"
                        value={v.name_en}
                        onChange={(e) => handleUpdateVariant(idx, 'name_en', e.target.value)}
                        className="form-input var-input"
                      />
                      <input
                        type="text"
                        placeholder="الباقة (عربي)"
                        value={v.name_ar}
                        onChange={(e) => handleUpdateVariant(idx, 'name_ar', e.target.value)}
                        className="form-input var-input"
                        dir="rtl"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price ($)"
                        value={v.price}
                        onChange={(e) => handleUpdateVariant(idx, 'price', e.target.value)}
                        className="form-input var-price-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="btn-icon delete-var-btn"
                        title="Remove Variant"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  {t('adminCancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <span>{language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                  ) : (
                    <span>{t('adminSaveProduct')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="delete-confirm-box glass-card">
            <AlertCircle size={44} className="text-danger mb-12" />
            <h3 className="confirm-title">{t('adminDeleteProduct')}</h3>
            <p className="confirm-p">{t('adminDeleteConfirm')}</p>
            <div className="confirm-actions">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-secondary"
              >
                {t('adminCancel')}
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="btn btn-primary bg-danger-solid"
              >
                {t('adminDeleteProduct')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-products-root {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .products-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-page-title {
          font-size: 1.6rem;
          color: var(--text-white);
          margin-bottom: 2px;
        }
        .admin-page-sub {
          color: var(--text-secondary);
          font-size: 0.88rem;
        }
        .products-table-card {
          padding: 20px;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .prod-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .prod-thumb {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          border: 1px solid var(--border-subtle);
          background: #0d0f1a;
        }
        .prod-names {
          display: flex;
          flex-direction: column;
        }
        .prod-en-name {
          font-size: 0.95rem;
          color: var(--text-white);
        }
        .prod-ar-name {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .prod-price-text {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          color: var(--text-white);
        }
        .variants-badge {
          font-size: 0.76rem;
          background: rgba(124, 92, 252, 0.12);
          color: var(--accent-purple);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .stock-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .stock-toggle-btn.in-stock {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
        }
        .stock-toggle-btn.out-stock {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }
        .stock-toggle-btn .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }
        .actions-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }
        .text-end { text-align: end; }
        .edit-action-btn:hover {
          color: var(--accent-purple);
          border-color: var(--primary-purple);
        }
        .delete-action-btn:hover {
          color: var(--danger);
          border-color: var(--danger);
        }
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 740px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          background: #121526;
          border: 1px solid var(--border-active);
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .modal-title {
          font-size: 1.35rem;
          color: var(--text-white);
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 16px;
        }
        .image-upload-wrapper {
          display: flex;
          gap: 18px;
          align-items: center;
        }
        .image-preview-box {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-sm);
          border: 1px dashed var(--border-active);
          background: #090B13;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .upload-input-col {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .file-input-native {
          display: none;
        }
        .mt-8 { margin-top: 8px; }
        .variants-editor-block {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-sm);
          padding: 16px;
        }
        .variants-editor-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .variants-editor-title {
          font-size: 0.95rem;
          color: var(--text-white);
        }
        .variants-list-edit {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .variant-edit-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .var-input {
          flex: 1;
        }
        .var-price-input {
          width: 110px;
        }
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 18px;
          margin-top: 8px;
        }
        .delete-confirm-box {
          max-width: 440px;
          padding: 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .bg-danger-solid {
          background: var(--danger) !important;
        }
        .confirm-title {
          font-size: 1.3rem;
          color: var(--text-white);
          margin-bottom: 8px;
        }
        .confirm-p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .confirm-actions {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr;
          }
          .variant-edit-row {
            flex-wrap: wrap;
          }
        }
        @media (max-width: 640px) {
          .products-table-card {
            padding: 14px;
          }
          .modal-overlay {
            padding: 10px;
          }
          .modal-content {
            padding: 18px 14px;
          }
          .image-upload-wrapper {
            flex-direction: column;
            align-items: flex-start;
          }
          .var-price-input {
            width: 100%;
          }
          .confirm-actions {
            flex-direction: column;
            width: 100%;
          }
          .confirm-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
