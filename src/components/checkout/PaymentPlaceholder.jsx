import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BANK_DETAILS, imageService } from '../../config/firebase';
import { formatPrice } from '../../utils/formatters';
import {
  Building2,
  Copy,
  Check,
  UploadCloud,
  Image as ImageIcon,
  Camera,
  X,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const PaymentPlaceholder = ({ total, onPaymentSuccess, isProcessing: externalProcessing }) => {
  const { language, t, isRTL } = useLanguage();
  const [copiedField, setCopiedField] = useState(null);

  // Screenshot Upload State
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const uploadBoxRef = useRef(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const copyToClipboard = (text, fieldName) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2200);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(
        language === 'ar'
          ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, JPEG, WEBP).'
          : 'Please select a valid image file (PNG, JPG, JPEG, WEBP).'
      );
      return;
    }

    // Limit size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError(
        language === 'ar'
          ? 'حجم الصورة كبير جداً (الحد الأقصى 15 ميجابايت).'
          : 'Image file is too large (maximum 15MB).'
      );
      return;
    }

    setUploadError('');
    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // STRICT VALIDATION: Screenshot proof is mandatory
    if (!screenshotFile && !screenshotPreview) {
      setUploadError(t('uploadProofRequiredError'));
      if (uploadBoxRef.current) {
        uploadBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      let uploadedUrl = screenshotPreview;
      if (screenshotFile) {
        // Upload to Firebase Storage or get local DataURL
        uploadedUrl = await imageService.uploadPaymentProof(screenshotFile);
      }

      await onPaymentSuccess(uploadedUrl);
    } catch (err) {
      console.error('Failed uploading payment proof screenshot:', err);
      setUploadError(
        language === 'ar'
          ? 'حدث خطأ أثناء رفع صورة الإشعار. يرجى المحاولة مرة أخرى.'
          : 'Failed to upload screenshot. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || externalProcessing;

  const bankName = language === 'ar' ? BANK_DETAILS.bankName_ar : BANK_DETAILS.bankName_en;
  const accountName = language === 'ar' ? BANK_DETAILS.accountName_ar : BANK_DETAILS.accountName_en;
  const phoneVal = BANK_DETAILS.phone;

  return (
    <div className="bank-payment-root">
      {/* 1. Header Banner & Total */}
      <div className="transfer-summary-card glass-card">
        <div className="transfer-badge-row">
          <div className="security-tag">
            <ShieldCheck size={16} />
            <span>{language === 'ar' ? 'تحويل بنكي آمن ومباشر' : 'Direct & Verified Bank Transfer'}</span>
          </div>
          <div className="manual-tag">
            <Clock size={14} />
            <span>{language === 'ar' ? 'التحقق والتسليم يدوياً من المشرف' : 'Admin Verified Before Delivery'}</span>
          </div>
        </div>

        <div className="transfer-amount-block">
          <div className="amount-label">{language === 'ar' ? 'إجمالي المبلغ المطلوب تحويله:' : 'Total Amount to Transfer:'}</div>
          <div className="amount-value">{formatPrice(total, language)}</div>
        </div>

        <p className="transfer-intro-text">{t('bankTransferInstructions')}</p>
      </div>

      {/* 2. Bank Transfer Account Details Box */}
      <div className="bank-details-box glass-card">
        <div className="details-header">
          <Building2 size={20} className="details-header-icon" />
          <h3 className="details-title">{t('bankDetailsTitle')}</h3>
        </div>

        <div className="copy-fields-grid">
          {/* Field 1: Bank Name */}
          <div className="copy-field-card">
            <div className="field-info">
              <span className="field-label">{t('bankNameLabel')}</span>
              <strong className="field-value">{bankName}</strong>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(bankName, 'bank')}
              className={`btn-copy-field ${copiedField === 'bank' ? 'copied' : ''}`}
              title="Copy Bank Name"
            >
              {copiedField === 'bank' ? (
                <>
                  <Check size={15} />
                  <span>{t('copiedBtn')}</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>{t('copyBtn')}</span>
                </>
              )}
            </button>
          </div>

          {/* Field 2: Beneficiary Account Name */}
          <div className="copy-field-card">
            <div className="field-info">
              <span className="field-label">{t('accountNameLabel')}</span>
              <strong className="field-value">{accountName}</strong>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(accountName, 'account')}
              className={`btn-copy-field ${copiedField === 'account' ? 'copied' : ''}`}
              title="Copy Account Name"
            >
              {copiedField === 'account' ? (
                <>
                  <Check size={15} />
                  <span>{t('copiedBtn')}</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>{t('copyBtn')}</span>
                </>
              )}
            </button>
          </div>

          {/* Field 3: Phone Number / Reference */}
          <div className="copy-field-card highlight-field">
            <div className="field-info">
              <span className="field-label">{t('phoneReferenceLabel')}</span>
              <strong className="field-value phone-number-display" dir="ltr">{phoneVal}</strong>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(phoneVal, 'phone')}
              className={`btn-copy-field ${copiedField === 'phone' ? 'copied' : ''}`}
              title="Copy Phone Reference"
            >
              {copiedField === 'phone' ? (
                <>
                  <Check size={15} />
                  <span>{t('copiedBtn')}</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>{t('copyBtn')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Payment Screenshot Upload Area (MANDATORY) */}
      <div
        ref={uploadBoxRef}
        className={`upload-step-box glass-card ${uploadError ? 'has-error' : ''} ${screenshotPreview ? 'has-preview' : ''}`}
      >
        <div className="upload-step-head">
          <div className="upload-step-icon">
            <UploadCloud size={22} />
          </div>
          <div className="upload-step-titles">
            <h3 className="upload-main-title">
              {t('uploadProofTitle')} <span className="required-star">*</span>
            </h3>
            <p className="upload-sub-title">{t('uploadProofSubtitle')}</p>
          </div>
        </div>

        {/* Hidden inputs: regular file picker & direct camera capture */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {screenshotPreview ? (
          /* Uploaded Preview State */
          <div className="screenshot-preview-card">
            <div className="preview-image-container">
              <img src={screenshotPreview} alt="Payment Proof Screenshot" className="proof-img-tag" />
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="remove-preview-btn"
                title="Remove & Choose Another"
              >
                <X size={16} />
              </button>
            </div>

            <div className="preview-meta-info">
              <div className="preview-success-badge">
                <Check size={14} />
                <span>{language === 'ar' ? 'تم اختيار إشعار التحويل بنجاح' : 'Screenshot Ready to Submit'}</span>
              </div>
              <span className="file-name-label">{screenshotFile?.name || 'payment-proof.png'}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-replace-screenshot"
              >
                {language === 'ar' ? 'تغيير الصورة' : 'Change Image'}
              </button>
            </div>
          </div>
        ) : (
          /* Dropzone / Upload Area */
          <div
            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-center">
              <div className="dropzone-circle">
                <ImageIcon size={30} />
              </div>
              <p className="dropzone-text">{t('uploadProofPlaceholder')}</p>

              {/* Mobile friendly quick action triggers */}
              <div className="mobile-upload-buttons" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-upload-choice"
                >
                  <UploadCloud size={16} />
                  <span>{language === 'ar' ? 'اختيار من الملفات' : 'Browse Files'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="btn-upload-choice camera-choice"
                >
                  <Camera size={16} />
                  <span>{language === 'ar' ? 'التقاط صورة' : 'Take Photo'}</span>
                </button>
              </div>

              <span className="dropzone-subhint">
                {language === 'ar'
                  ? 'مطلوب إرفاق صورة إشعار التحويل لتتم مراجعة الطلب'
                  : 'Screenshot confirmation required before submission'}
              </span>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="upload-error-alert animate-shake">
            <AlertCircle size={16} />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* 4. Action Button: Submit Order & Proof */}
      <div className="submit-action-wrapper">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isBusy}
          className="btn btn-lg btn-primary w-full submit-order-proof-btn animate-glow"
        >
          {isBusy ? (
            <div className="btn-loading-row">
              <span className="button-spinner" />
              <span>{isUploading ? t('uploadingProof') : t('submittingOrder')}</span>
            </div>
          ) : (
            <>
              <Lock size={18} />
              <span>
                {t('submitOrderWithProof')} ({formatPrice(total, language)})
              </span>
              <ArrowIcon size={18} />
            </>
          )}
        </button>

        <p className="post-submit-note">
          <ShieldCheck size={14} className="text-green" />
          <span>
            {language === 'ar'
              ? 'سيتم تسجيل الطلب بحالة "قيد التحقق من الدفع" وتسليمه لك فور تدقيق الإشعار من المشرف.'
              : 'Your order will be placed with "Pending Verification" status and fulfilled upon admin review.'}
          </span>
        </p>
      </div>

      <style>{`
        .bank-payment-root {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 10px;
        }

        /* Top Summary Card */
        .transfer-summary-card {
          background: rgba(124, 92, 252, 0.07);
          border: 1px solid rgba(124, 92, 252, 0.28);
          border-radius: var(--radius-md);
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .transfer-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .security-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #10B981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .manual-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #FBBF24;
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.25);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .transfer-amount-block {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-block: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 8px;
        }

        .amount-label {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .amount-value {
          font-family: var(--font-heading);
          font-size: 2.1rem;
          font-weight: 900;
          color: var(--accent-purple);
        }

        .transfer-intro-text {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        /* Bank Details Box */
        .bank-details-box {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .details-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .details-header-icon {
          color: var(--accent-purple);
        }

        .details-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-white);
          margin: 0;
        }

        .copy-fields-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .copy-field-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: var(--transition-normal);
        }

        .copy-field-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(124, 92, 252, 0.4);
        }

        .highlight-field {
          background: rgba(124, 92, 252, 0.06);
          border-color: rgba(124, 92, 252, 0.35);
        }

        .field-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .field-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-value {
          font-size: 1.05rem;
          color: var(--text-white);
          font-weight: 700;
        }

        .phone-number-display {
          font-family: var(--font-heading);
          color: #A78BFA;
          letter-spacing: 0.8px;
        }

        .btn-copy-field {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124, 92, 252, 0.15);
          border: 1px solid rgba(124, 92, 252, 0.35);
          color: #DDD6FE;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-copy-field:hover {
          background: rgba(124, 92, 252, 0.3);
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .btn-copy-field.copied {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
          color: #10B981;
        }

        /* Screenshot Upload Box */
        .upload-step-box {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: var(--transition-normal);
        }

        .upload-step-box.has-error {
          border-color: rgba(239, 68, 68, 0.6);
          background: rgba(239, 68, 68, 0.03);
        }

        .upload-step-head {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .upload-step-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(124, 92, 252, 0.15);
          border: 1px solid rgba(124, 92, 252, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-purple);
          flex-shrink: 0;
        }

        .upload-step-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .upload-main-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-white);
          margin: 0;
        }

        .required-star {
          color: #EF4444;
          font-weight: 900;
        }

        .upload-sub-title {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Dropzone */
        .upload-dropzone {
          border: 2px dashed rgba(124, 92, 252, 0.35);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .upload-dropzone:hover, .upload-dropzone.dragging {
          border-color: var(--accent-purple);
          background: rgba(124, 92, 252, 0.08);
          transform: scale(1.005);
        }

        .dropzone-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .dropzone-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(124, 92, 252, 0.12);
          border: 1px solid rgba(124, 92, 252, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-purple);
        }

        .dropzone-text {
          font-size: 0.95rem;
          color: var(--text-white);
          font-weight: 600;
          margin: 0;
        }

        .mobile-upload-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 4px;
        }

        .btn-upload-choice {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid var(--border-subtle);
          color: var(--text-white);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-upload-choice:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .camera-choice {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.3);
          color: #10B981;
        }

        .camera-choice:hover {
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
        }

        .dropzone-subhint {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        /* Screenshot Preview */
        .screenshot-preview-card {
          display: flex;
          align-items: center;
          gap: 18px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: var(--radius-md);
          padding: 14px;
        }

        .preview-image-container {
          position: relative;
          width: 90px;
          height: 110px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #020617;
          border: 1px solid rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }

        .proof-img-tag {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-preview-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.75);
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-preview-btn:hover {
          background: #EF4444;
        }

        .preview-meta-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .preview-success-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #10B981;
        }

        .file-name-label {
          font-size: 0.82rem;
          color: var(--text-secondary);
          word-break: break-all;
        }

        .btn-replace-screenshot {
          background: transparent;
          border: none;
          color: var(--accent-purple);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-align: start;
          text-decoration: underline;
        }

        .upload-error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
        }

        /* Submit Button */
        .submit-action-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .submit-order-proof-btn {
          padding-block: 18px;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.4px;
          box-shadow: 0 6px 28px rgba(124, 92, 252, 0.45);
        }

        .btn-loading-row {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .post-submit-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          justify-content: center;
          text-align: center;
          margin: 0;
        }

        .text-green { color: #10B981; }

        @media (max-width: 600px) {
          .copy-field-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .btn-copy-field {
            width: 100%;
            justify-content: center;
          }
          .transfer-amount-block {
            flex-direction: column;
            gap: 4px;
          }
          .amount-value {
            font-size: 1.8rem;
          }
          .screenshot-preview-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .preview-image-container {
            width: 100%;
            height: 180px;
          }
          .submit-order-proof-btn {
            font-size: 1rem;
            padding-block: 14px;
          }
        }
      `}</style>
    </div>
  );
};
