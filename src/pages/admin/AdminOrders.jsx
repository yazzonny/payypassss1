import React, { useState, useEffect } from 'react';
import { orderService } from '../../config/firebase';
import { useLanguage } from '../../../src/context/LanguageContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Save,
  MessageCircle,
  Mail,
  Phone,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  X,
  FileText,
  Truck
} from 'lucide-react';

export const AdminOrders = () => {
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox Modal State
  const [lightboxOrder, setLightboxOrder] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  // Delivery / Fulfillment Modal State
  const [deliverOrder, setDeliverOrder] = useState(null);
  const [fulfillmentInput, setFulfillmentInput] = useState('');
  const [savingDelivery, setSavingDelivery] = useState(false);

  // Rejection / Cancellation Modal State
  const [rejectOrder, setRejectOrder] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [savingRejection, setSavingRejection] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Keyboard shortcut to close lightbox on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOrder(null);
        setDeliverOrder(null);
        setRejectOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Open Lightbox
  const handleOpenLightbox = (order) => {
    setLightboxOrder(order);
    setZoomScale(1);
  };

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.35, 3));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.35, 0.6));
  const handleResetZoom = () => setZoomScale(1);

  // 1. Confirm Payment Action
  const handleConfirmPayment = async (orderId) => {
    try {
      await orderService.updateStatus(orderId, 'Confirmed');
      await fetchOrders();
      if (lightboxOrder && lightboxOrder.id === orderId) {
        setLightboxOrder((prev) => (prev ? { ...prev, status: 'Confirmed' } : null));
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      alert('Failed to update status');
    }
  };

  // 2. Mark as Delivered Action
  const handleOpenDeliverModal = (order) => {
    setDeliverOrder(order);
    setFulfillmentInput(order.fulfillmentNotes || '');
  };

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    if (!deliverOrder) return;
    setSavingDelivery(true);
    try {
      await orderService.updateStatus(deliverOrder.id, 'Delivered', fulfillmentInput);
      setDeliverOrder(null);
      await fetchOrders();
    } catch (err) {
      console.error('Error saving delivery:', err);
      alert('Failed to mark order as delivered');
    } finally {
      setSavingDelivery(false);
    }
  };

  // 3. Reject / Cancel Action
  const handleOpenRejectModal = (order) => {
    setRejectOrder(order);
    setRejectionNote(order.rejectionReason || '');
  };

  const handleSaveRejection = async (e) => {
    e.preventDefault();
    if (!rejectOrder) return;
    setSavingRejection(true);
    try {
      await orderService.updateStatus(rejectOrder.id, 'Cancelled', undefined, rejectionNote);
      setRejectOrder(null);
      if (lightboxOrder && lightboxOrder.id === rejectOrder.id) {
        setLightboxOrder((prev) => (prev ? { ...prev, status: 'Cancelled', rejectionReason: rejectionNote } : null));
      }
      await fetchOrders();
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert('Failed to cancel order');
    } finally {
      setSavingRejection(false);
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return 'Pending Verification';
    if (status === 'Pending' || status === 'Pending Payment') return 'Pending Verification';
    if (status === 'Paid') return 'Confirmed';
    return status;
  };

  const filteredOrders = orders.filter((order) => {
    const norm = normalizeStatus(order.status);
    if (statusFilter !== 'All' && norm !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const idMatch = (order.id || '').toLowerCase().includes(q);
      const nameMatch = (order.customerInfo?.name || '').toLowerCase().includes(q);
      const emailMatch = (order.customerInfo?.email || '').toLowerCase().includes(q);
      const phoneMatch = (order.customerInfo?.phone || '').toLowerCase().includes(q);
      return idMatch || nameMatch || emailMatch || phoneMatch;
    }
    return true;
  });

  const getStatusCount = (targetStatus) => {
    if (targetStatus === 'All') return orders.length;
    return orders.filter((o) => normalizeStatus(o.status) === targetStatus).length;
  };

  return (
    <div className="admin-orders-root">
      {/* Top Header */}
      <div className="orders-top-header">
        <div>
          <h2 className="admin-page-title">{t('adminTabOrders')}</h2>
          <p className="admin-page-sub">
            {language === 'ar'
              ? 'مراجعة إيصالات التحويل البنكي وتأكيد الدفع والتسليم اليدوي.'
              : 'Review Arab Bank transfer screenshots, verify payments, and deliver credentials.'}
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="orders-toolbar glass-card">
        <div className="orders-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={
              language === 'ar'
                ? 'بحث برقم الطلب، البريد، الاسم، أو الهاتف...'
                : 'Search by Order ID, customer name, email, or phone...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="orders-search-input"
          />
        </div>

        <div className="status-filter-buttons">
          {[
            { key: 'All', labelEn: 'All', labelAr: 'الكل' },
            { key: 'Pending Verification', labelEn: 'Pending Verification', labelAr: 'قيد التحقق' },
            { key: 'Confirmed', labelEn: 'Confirmed', labelAr: 'تم تأكيد الدفع' },
            { key: 'Delivered', labelEn: 'Delivered', labelAr: 'تم التسليم' },
            { key: 'Cancelled', labelEn: 'Cancelled', labelAr: 'ملغي' }
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`status-btn ${statusFilter === st.key ? 'active' : ''}`}
            >
              <span>{language === 'ar' ? st.labelAr : st.labelEn}</span>
              <span className="count-pill">{getStatusCount(st.key)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table & Cards */}
      <div className="orders-table-card glass-card">
        {loading ? (
          <div className="py-80 text-center">
            <div className="spinner" />
            <p>{language === 'ar' ? 'جاري استرجاع الطلبات...' : 'Loading orders...'}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-60 text-center text-secondary">
            <ShoppingBag size={42} className="text-muted mb-8" />
            <p>{language === 'ar' ? 'لا توجد طلبات في هذا القسم' : 'No orders found matching this filter.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('orderNumber')}</th>
                  <th>{t('adminCustomer')}</th>
                  <th>{language === 'ar' ? 'إيصال التحويل' : 'Payment Proof'}</th>
                  <th>{t('adminItems')}</th>
                  <th>{t('total')}</th>
                  <th>{t('status')}</th>
                  <th className="text-end">{t('adminActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const currentStatus = normalizeStatus(order.status);
                  const hasProof = Boolean(order.paymentProofUrl);

                  return (
                    <tr key={order.id} className={`order-row-status-${currentStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {/* 1. Order ID & Time */}
                      <td>
                        <div className="order-id-cell">
                          <strong className="order-id-highlight">{order.id}</strong>
                          <span className="order-time-sub">{formatDate(order.createdAt, language)}</span>
                        </div>
                      </td>

                      {/* 2. Customer Info */}
                      <td>
                        <div className="customer-info-cell">
                          <div className="customer-name-row">
                            <strong className="c-name">{order.customerInfo?.name || 'Customer'}</strong>
                            {order.customerInfo?.phone && (
                              <a
                                href={`https://wa.me/${order.customerInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${order.customerInfo.name || ''}, PlayPass support regarding Order #${order.id}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wa-customer-shortcut"
                                title="Message customer on WhatsApp"
                              >
                                <MessageCircle size={13} />
                              </a>
                            )}
                          </div>
                          <span className="c-meta">
                            <Mail size={12} /> {order.customerInfo?.email}
                          </span>
                          {order.customerInfo?.phone && (
                            <span className="c-meta">
                              <Phone size={12} /> {order.customerInfo.phone}
                            </span>
                          )}
                          {order.customerInfo?.notes && (
                            <span className="c-notes">Note: "{order.customerInfo.notes}"</span>
                          )}
                        </div>
                      </td>

                      {/* 3. Payment Screenshot Proof (Clickable Thumbnail) */}
                      <td>
                        {hasProof ? (
                          <div className="proof-thumbnail-cell">
                            <button
                              type="button"
                              onClick={() => handleOpenLightbox(order)}
                              className="proof-thumb-btn"
                              title="Click to view full screenshot in Lightbox"
                            >
                              <img
                                src={order.paymentProofUrl}
                                alt="Proof thumbnail"
                                className="proof-thumb-img"
                              />
                              <div className="thumb-hover-overlay">
                                <Eye size={15} />
                              </div>
                            </button>
                            <span className="proof-uploaded-tag">
                              {language === 'ar' ? 'إشعار مرفق' : 'Proof Attached'}
                            </span>
                          </div>
                        ) : (
                          <div className="no-proof-box">
                            <AlertTriangle size={14} className="text-yellow" />
                            <span>{language === 'ar' ? 'لا يوجد إشعار' : 'No Proof'}</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Items List */}
                      <td>
                        <div className="order-items-cell">
                          {order.items?.map((it, i) => (
                            <div key={i} className="order-item-inline">
                              <span>{language === 'ar' ? it.name_ar || it.name_en : it.name_en}</span>
                              <span className="item-q">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 5. Total */}
                      <td>
                        <strong className="order-total-highlight">
                          {formatPrice(order.total, language)}
                        </strong>
                      </td>

                      {/* 6. Current Status Badge */}
                      <td>
                        <div className="status-badge-container">
                          <span
                            className={`badge ${
                              currentStatus === 'Delivered'
                                ? 'badge-success'
                                : currentStatus === 'Confirmed'
                                ? 'badge-primary'
                                : currentStatus === 'Cancelled'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                          >
                            {currentStatus === 'Delivered' ? (
                              <CheckCircle2 size={13} />
                            ) : currentStatus === 'Confirmed' ? (
                              <ShieldCheck size={13} />
                            ) : currentStatus === 'Cancelled' ? (
                              <XCircle size={13} />
                            ) : (
                              <Clock size={13} />
                            )}
                            <span>
                              {currentStatus === 'Pending Verification'
                                ? language === 'ar'
                                  ? 'قيد التحقق'
                                  : 'Pending Verification'
                                : currentStatus === 'Confirmed'
                                ? language === 'ar'
                                  ? 'تم تأكيد الدفع'
                                  : 'Confirmed'
                                : currentStatus === 'Delivered'
                                ? language === 'ar'
                                  ? 'تم التسليم'
                                  : 'Delivered'
                                : currentStatus === 'Cancelled'
                                ? language === 'ar'
                                  ? 'ملغي'
                                  : 'Cancelled'
                                : currentStatus}
                            </span>
                          </span>

                          {/* If fulfilled credentials exist, show preview tag */}
                          {order.fulfillmentNotes && currentStatus === 'Delivered' && (
                            <code className="cred-preview-tag" title={order.fulfillmentNotes}>
                              {order.fulfillmentNotes.length > 24
                                ? `${order.fulfillmentNotes.slice(0, 24)}...`
                                : order.fulfillmentNotes}
                            </code>
                          )}

                          {/* If rejection reason exists, show warning note */}
                          {order.rejectionReason && currentStatus === 'Cancelled' && (
                            <span className="rejection-reason-sub" title={order.rejectionReason}>
                              {language === 'ar' ? 'السبب: ' : 'Reason: '}
                              {order.rejectionReason.length > 28
                                ? `${order.rejectionReason.slice(0, 28)}...`
                                : order.rejectionReason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="text-end">
                        <div className="actions-button-group">
                          {/* Confirm Payment button (for Pending Verification orders) */}
                          {currentStatus === 'Pending Verification' && (
                            <button
                              type="button"
                              onClick={() => handleConfirmPayment(order.id)}
                              className="btn btn-sm btn-primary action-btn-confirm"
                              title="Confirm payment after reviewing screenshot"
                            >
                              <ShieldCheck size={14} />
                              <span>{t('adminConfirmPayment')}</span>
                            </button>
                          )}

                          {/* Mark as Delivered button (for Confirmed orders or quick fulfillment) */}
                          {currentStatus === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleOpenDeliverModal(order)}
                              className="btn btn-sm btn-success action-btn-deliver"
                              title="Enter credentials and mark delivered"
                            >
                              <Truck size={14} />
                              <span>{t('adminMarkDelivered')}</span>
                            </button>
                          )}

                          {/* Edit Delivery if already delivered */}
                          {currentStatus === 'Delivered' && (
                            <button
                              type="button"
                              onClick={() => handleOpenDeliverModal(order)}
                              className="btn btn-sm btn-outline action-btn-edit-cred"
                              title="Edit fulfillment credentials"
                            >
                              <FileText size={13} />
                              <span>{language === 'ar' ? 'تعديل البيانات' : 'Edit Credentials'}</span>
                            </button>
                          )}

                          {/* Cancel / Reject Order (available for Pending or Confirmed) */}
                          {currentStatus !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(order)}
                              className="btn btn-sm btn-outline action-btn-cancel"
                              title="Cancel or reject this order with a note"
                            >
                              <XCircle size={14} />
                              <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
                            </button>
                          )}

                          {/* Reopen if cancelled */}
                          {currentStatus === 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleConfirmPayment(order.id)}
                              className="btn btn-sm btn-outline"
                              title="Reactivate and confirm order"
                            >
                              <span>{language === 'ar' ? 'إعادة التفعيل' : 'Reactivate'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. LIGHTBOX / ZOOM-IN SCREENSHOT MODAL */}
      {/* ========================================================================= */}
      {lightboxOrder && (
        <div className="lightbox-overlay" onClick={() => setLightboxOrder(null)}>
          <div className="lightbox-modal glass-card animate-glow" onClick={(e) => e.stopPropagation()}>
            {/* Lightbox Header Bar */}
            <div className="lightbox-header">
              <div className="lightbox-order-info">
                <div className="lightbox-title-row">
                  <h3 className="lightbox-title">
                    {language === 'ar' ? 'إشعار تحويل البنك العربي' : 'Arab Bank Payment Confirmation'}
                  </h3>
                  <span className="lightbox-order-badge">#{lightboxOrder.id}</span>
                </div>
                <div className="lightbox-meta-row">
                  <span className="lightbox-meta-item">
                    <strong>{lightboxOrder.customerInfo?.name}</strong> ({lightboxOrder.customerInfo?.phone || lightboxOrder.customerInfo?.email})
                  </span>
                  <span className="lightbox-meta-total">
                    {language === 'ar' ? 'المبلغ المطلوب: ' : 'Required: '}
                    <strong>{formatPrice(lightboxOrder.total, language)}</strong>
                  </span>
                </div>
              </div>

              {/* Lightbox Top Controls */}
              <div className="lightbox-top-controls">
                <div className="zoom-controls-cluster">
                  <button type="button" onClick={handleZoomIn} className="btn-zoom-icon" title="Zoom In">
                    <ZoomIn size={17} />
                  </button>
                  <button type="button" onClick={handleZoomOut} className="btn-zoom-icon" title="Zoom Out">
                    <ZoomOut size={17} />
                  </button>
                  <button type="button" onClick={handleResetZoom} className="btn-zoom-icon" title="Reset Zoom">
                    <RotateCcw size={16} />
                  </button>
                </div>

                <a
                  href={lightboxOrder.paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary lightbox-open-tab-btn"
                  title="Open in new tab"
                >
                  <ExternalLink size={14} />
                  <span>{language === 'ar' ? 'علامة تبويب جديدة' : 'New Tab'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setLightboxOrder(null)}
                  className="lightbox-close-btn"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Lightbox Image Stage (Scrollable & Zoomable) */}
            <div className="lightbox-viewport">
              <div className="lightbox-image-wrap" style={{ transform: `scale(${zoomScale})` }}>
                <img
                  src={lightboxOrder.paymentProofUrl}
                  alt={`Proof for Order #${lightboxOrder.id}`}
                  className="lightbox-full-img"
                />
              </div>
            </div>

            {/* Lightbox Footer with Immediate Decision Actions */}
            <div className="lightbox-footer-action-bar">
              <div className="lightbox-footer-status">
                <span>{language === 'ar' ? 'الحالة الحالية: ' : 'Current Status: '}</span>
                <strong>{normalizeStatus(lightboxOrder.status)}</strong>
              </div>

              <div className="lightbox-footer-actions">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenRejectModal(lightboxOrder);
                  }}
                  className="btn btn-sm btn-outline text-danger"
                >
                  <XCircle size={15} />
                  <span>{language === 'ar' ? 'رفض / إلغاء الطلب' : 'Reject / Cancel'}</span>
                </button>

                {normalizeStatus(lightboxOrder.status) !== 'Confirmed' &&
                  normalizeStatus(lightboxOrder.status) !== 'Delivered' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleConfirmPayment(lightboxOrder.id);
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      <ShieldCheck size={15} />
                      <span>{t('adminConfirmPayment')}</span>
                    </button>
                  )}

                {normalizeStatus(lightboxOrder.status) === 'Confirmed' && (
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxOrder(null);
                      handleOpenDeliverModal(lightboxOrder);
                    }}
                    className="btn btn-sm btn-success"
                  >
                    <Truck size={15} />
                    <span>{t('adminMarkDelivered')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MANUAL DELIVERY / FULFILLMENT MODAL */}
      {/* ========================================================================= */}
      {deliverOrder && (
        <div className="modal-overlay" onClick={() => setDeliverOrder(null)}>
          <div className="modal-content glass-card animate-glow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {language === 'ar' ? `تسليم الطلب رقم #${deliverOrder.id}` : `Fulfill Order #${deliverOrder.id}`}
                </h3>
                <span className="modal-sub">
                  {deliverOrder.customerInfo?.name} ({deliverOrder.customerInfo?.email})
                </span>
              </div>
              <button onClick={() => setDeliverOrder(null)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDelivery} className="modal-form">
              <div className="delivery-notice-pill">
                <ShieldCheck size={16} className="text-green" />
                <span>{t('adminDeliverNotice')}</span>
              </div>

              <div className="form-group">
                <label className="form-label">{t('adminEnterCredentials')} *</label>
                <textarea
                  rows={4}
                  value={fulfillmentInput}
                  onChange={(e) => setFulfillmentInput(e.target.value)}
                  placeholder="e.g. Netflix Email: user99@stream.vip | Password: **** | Profile: VIP 3 | PIN: 9281"
                  className="form-textarea code-font"
                  required
                />
                <span className="form-hint">
                  {language === 'ar'
                    ? 'هذه البيانات ستظهر فوراً في حساب العميل وشاشة تفاصيل الطلب.'
                    : 'These details will appear immediately on the customer’s order receipt and account dashboard.'}
                </span>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setDeliverOrder(null)} className="btn btn-secondary">
                  {t('adminCancel')}
                </button>
                <button type="submit" disabled={savingDelivery} className="btn btn-success">
                  <Save size={16} />
                  <span>{savingDelivery ? 'Saving...' : t('adminMarkDelivered')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. REJECTION / CANCELLATION MODAL */}
      {/* ========================================================================= */}
      {rejectOrder && (
        <div className="modal-overlay" onClick={() => setRejectOrder(null)}>
          <div className="modal-content glass-card animate-glow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title text-danger">
                  {language === 'ar' ? `إلغاء / رفض الطلب #${rejectOrder.id}` : `Reject Order #${rejectOrder.id}`}
                </h3>
                <span className="modal-sub">
                  {rejectOrder.customerInfo?.name} ({rejectOrder.customerInfo?.email})
                </span>
              </div>
              <button onClick={() => setRejectOrder(null)} className="modal-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRejection} className="modal-form">
              <div className="reject-warning-pill">
                <AlertTriangle size={16} className="text-yellow" />
                <span>
                  {language === 'ar'
                    ? 'سيتم تحويل حالة الطلب إلى "ملغي" وحفظ سبب الرفض.'
                    : 'The order status will be changed to "Cancelled" and the note will be recorded.'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">{t('adminRejectReasonLabel')}</label>
                <textarea
                  rows={3}
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder={t('adminRejectReasonPlaceholder')}
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setRejectOrder(null)} className="btn btn-secondary">
                  {t('adminCancel')}
                </button>
                <button type="submit" disabled={savingRejection} className="btn btn-danger">
                  <XCircle size={16} />
                  <span>{savingRejection ? 'Cancelling...' : t('adminConfirmCancelBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-orders-root {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .orders-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .orders-toolbar {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .orders-search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 280px;
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
        .orders-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 14px 10px 40px;
          color: var(--text-white);
          font-size: 0.9rem;
          outline: none;
          transition: var(--transition-normal);
        }
        [dir="rtl"] .orders-search-input {
          padding: 10px 40px 10px 14px;
        }
        .orders-search-input:focus {
          border-color: var(--accent-purple);
          background: rgba(124, 92, 252, 0.05);
        }
        .status-filter-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .status-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 7px 14px;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .status-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-white);
        }
        .status-btn.active {
          background: rgba(124, 92, 252, 0.18);
          border-color: var(--accent-purple);
          color: #FFFFFF;
        }
        .count-pill {
          background: rgba(255, 255, 255, 0.1);
          padding: 1px 7px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
        }
        .status-btn.active .count-pill {
          background: var(--accent-purple);
          color: #FFFFFF;
        }
        .orders-table-card {
          padding: 6px;
          overflow: hidden;
        }
        .order-id-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .order-id-highlight {
          font-family: var(--font-heading);
          color: var(--accent-purple);
          font-size: 0.95rem;
          letter-spacing: 0.5px;
        }
        .order-time-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .customer-info-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .customer-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .c-name {
          font-size: 0.88rem;
          color: var(--text-white);
        }
        .wa-customer-shortcut {
          color: #10B981;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.12);
          transition: transform 0.2s;
        }
        .wa-customer-shortcut:hover {
          transform: scale(1.15);
        }
        .c-meta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.76rem;
          color: var(--text-secondary);
        }
        .c-notes {
          font-size: 0.74rem;
          color: #FBBF24;
          font-style: italic;
          margin-top: 2px;
        }

        /* Proof Thumbnail Cell */
        .proof-thumbnail-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .proof-thumb-btn {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 6px;
          overflow: hidden;
          background: #020617;
          border: 1px solid rgba(124, 92, 252, 0.4);
          padding: 0;
          cursor: pointer;
          display: block;
          transition: transform 0.2s, border-color 0.2s;
        }
        .proof-thumb-btn:hover {
          transform: scale(1.08);
          border-color: #A78BFA;
        }
        .proof-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumb-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .proof-thumb-btn:hover .thumb-hover-overlay {
          opacity: 1;
        }
        .proof-uploaded-tag {
          font-size: 0.68rem;
          color: #10B981;
          font-weight: 600;
        }
        .no-proof-box {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.76rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.03);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .order-items-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.82rem;
          max-width: 220px;
        }
        .order-item-inline {
          display: flex;
          justify-content: space-between;
          color: var(--text-secondary);
        }
        .item-q {
          color: var(--accent-purple);
          font-weight: 700;
          margin-left: 6px;
        }
        [dir="rtl"] .item-q {
          margin-left: 0;
          margin-right: 6px;
        }
        .order-total-highlight {
          font-family: var(--font-heading);
          font-size: 1rem;
          color: var(--text-white);
        }

        /* Status Badge Container */
        .status-badge-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .cred-preview-tag {
          font-size: 0.7rem;
          font-family: monospace;
          background: rgba(255, 255, 255, 0.05);
          color: #A78BFA;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rejection-reason-sub {
          font-size: 0.72rem;
          color: #EF4444;
          font-style: italic;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Actions Button Group */
        .actions-button-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          flex-wrap: wrap;
        }
        .action-btn-confirm {
          background: rgba(124, 92, 252, 0.2);
          border-color: rgba(124, 92, 252, 0.45);
          color: #FFFFFF;
        }
        .action-btn-confirm:hover {
          background: var(--accent-purple);
        }
        .action-btn-deliver {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #10B981;
        }
        .action-btn-deliver:hover {
          background: #10B981;
          color: #FFFFFF;
        }
        .action-btn-cancel {
          color: #EF4444;
          border-color: rgba(239, 68, 68, 0.3);
        }
        .action-btn-cancel:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        /* ========================================================================= */
        /* LIGHTBOX STYLES */
        /* ========================================================================= */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.88);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .lightbox-modal {
          width: 100%;
          max-width: 920px;
          height: 90vh;
          background: #0B0F1E;
          border: 1px solid rgba(124, 92, 252, 0.35);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.75);
        }
        .lightbox-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 23, 42, 0.5);
          gap: 16px;
        }
        .lightbox-order-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lightbox-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lightbox-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-white);
          margin: 0;
        }
        .lightbox-order-badge {
          background: rgba(124, 92, 252, 0.2);
          border: 1px solid rgba(124, 92, 252, 0.4);
          color: #DDD6FE;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .lightbox-meta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .lightbox-meta-total strong {
          color: var(--accent-purple);
        }
        .lightbox-top-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .zoom-controls-cluster {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .btn-zoom-icon {
          background: transparent;
          border: none;
          color: var(--text-white);
          padding: 8px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .btn-zoom-icon:hover {
          background: rgba(124, 92, 252, 0.25);
        }
        .lightbox-open-tab-btn {
          gap: 6px;
          font-size: 0.82rem;
        }
        .lightbox-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid var(--border-subtle);
          color: var(--text-white);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lightbox-close-btn:hover {
          background: #EF4444;
          border-color: #EF4444;
        }
        .lightbox-viewport {
          flex: 1;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050814;
          padding: 20px;
          user-select: none;
        }
        .lightbox-image-wrap {
          transition: transform 0.2s ease-out;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox-full-img {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .lightbox-footer-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: rgba(15, 23, 42, 0.65);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          gap: 12px;
          flex-wrap: wrap;
        }
        .lightbox-footer-status {
          font-size: 0.86rem;
          color: var(--text-secondary);
        }
        .lightbox-footer-status strong {
          color: var(--text-white);
        }
        .lightbox-footer-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Modal Overlays & Pills */
        .delivery-notice-pill, .reject-warning-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          margin-bottom: 14px;
        }
        .delivery-notice-pill {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #10B981;
        }
        .reject-warning-pill {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #F87171;
        }
        .text-danger { color: #EF4444; }

        @media (max-width: 768px) {
          .orders-toolbar {
            min-width: 100%;
          }
          .status-filter-buttons {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }
          .status-btn {
            flex-shrink: 0;
            padding: 6px 10px;
            font-size: 0.78rem;
          }
          .orders-table-card {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
};
