import React, { useEffect, useMemo, useState } from 'react';
import { settingsService } from '../../config/firebase';
import { useLanguage } from '../../context/LanguageContext';
import { Save, RotateCcw, CheckCircle2, Type } from 'lucide-react';

/** Every storefront text the admin can edit. `key` maps to LanguageContext keys. */
const GROUPS = [
  { id: 'hero', en: 'Home · Hero', ar: 'الرئيسية · الواجهة', fields: [
    ['heroBadge', 'Top badge', 'الشارة العلوية'],
    ['heroTitleLine1', 'Title – line 1', 'العنوان – السطر 1'],
    ['heroTitleLine2', 'Title – line 2 (highlighted)', 'العنوان – السطر 2 (مميز)'],
    ['heroSubtitle', 'Subtitle', 'الوصف', true],
    ['heroCtaShop', 'Main button', 'الزر الرئيسي'],
    ['heroCtaSubs', 'Second button', 'الزر الثاني'],
    ['heroStat1Number', 'Stat 1 – number', 'إحصائية 1 – الرقم'],
    ['heroStat1Label', 'Stat 1 – label', 'إحصائية 1 – الوصف'],
    ['heroStat2Number', 'Stat 2 – number', 'إحصائية 2 – الرقم'],
    ['heroStat2Label', 'Stat 2 – label', 'إحصائية 2 – الوصف'],
    ['heroStat3Number', 'Stat 3 – number', 'إحصائية 3 – الرقم'],
    ['heroStat3Label', 'Stat 3 – label', 'إحصائية 3 – الوصف'],
  ]},
  { id: 'cats', en: 'Home · Categories', ar: 'الرئيسية · الأقسام', fields: [
    ['catSectionTitle', 'Section title', 'عنوان القسم'],
    ['catSectionSubtitle', 'Section subtitle', 'وصف القسم'],
    ['catSubsTitle', 'Subscriptions title', 'عنوان الاشتراكات'],
    ['catSubsDesc', 'Subscriptions description', 'وصف الاشتراكات', true],
    ['catGamingTitle', 'Gaming title', 'عنوان الألعاب'],
    ['catGamingDesc', 'Gaming description', 'وصف الألعاب', true],
  ]},
  { id: 'trust', en: 'Home · Why choose us', ar: 'الرئيسية · لماذا نحن', fields: [
    ['trustTitle', 'Section title', 'عنوان القسم'],
    ['trustSubtitle', 'Section subtitle', 'وصف القسم'],
    ['trustFeature1Title', 'Feature 1 – title', 'ميزة 1 – العنوان'],
    ['trustFeature1Desc', 'Feature 1 – text', 'ميزة 1 – النص', true],
    ['trustFeature2Title', 'Feature 2 – title', 'ميزة 2 – العنوان'],
    ['trustFeature2Desc', 'Feature 2 – text', 'ميزة 2 – النص', true],
    ['trustFeature3Title', 'Feature 3 – title', 'ميزة 3 – العنوان'],
    ['trustFeature3Desc', 'Feature 3 – text', 'ميزة 3 – النص', true],
    ['trustFeature4Title', 'Feature 4 – title', 'ميزة 4 – العنوان'],
    ['trustFeature4Desc', 'Feature 4 – text', 'ميزة 4 – النص', true],
  ]},
  { id: 'footer', en: 'Footer', ar: 'التذييل', fields: [
    ['footerDesc', 'About text', 'نص التعريف', true],
    ['footerAllRights', 'Copyright line', 'سطر الحقوق'],
  ]},
];

export const AdminContent = () => {
  const { language, t } = useLanguage();
  const ar = language === 'ar';
  const [content, setContent] = useState({ en: {}, ar: {} });
  const [defaults, setDefaults] = useState({ en: {}, ar: {} });
  const [openGroup, setOpenGroup] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.get().then(s => setContent(s.content || { en: {}, ar: {} }));
  }, []);

  // Built-in text per language, so the form shows what is live right now.
  useEffect(() => {
    const probe = {};
    GROUPS.flatMap(g => g.fields).forEach(([k]) => { probe[k] = t(k); });
    setDefaults(prev => ({ ...prev, [language]: probe }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const setValue = (lang, key, value) =>
    setContent(prev => ({ ...prev, [lang]: { ...prev[lang], [key]: value } }));

  const resetKey = (key) =>
    setContent(prev => {
      const en = { ...prev.en }; const arr = { ...prev.ar };
      delete en[key]; delete arr[key];
      return { en, ar: arr };
    });

  const dirtyCount = useMemo(
    () => Object.keys(content.en || {}).length + Object.keys(content.ar || {}).length,
    [content]
  );

  const save = async () => {
    setSaving(true);
    try {
      const clean = (o) => Object.fromEntries(Object.entries(o || {}).filter(([, v]) => String(v).trim() !== ''));
      await settingsService.update({ content: { en: clean(content.en), ar: clean(content.ar) } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
      alert(ar ? 'تعذّر الحفظ' : 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="content-root">
      <div className="content-head">
        <div>
          <h2 className="admin-page-title"><Type size={22} /> {ar ? 'محتوى الموقع' : 'Site Content'}</h2>
          <p className="admin-page-sub">
            {ar
              ? 'عدّل أي نص في الواجهة بالعربي والإنجليزي. اترك الحقل فارغاً للرجوع للنص الأصلي.'
              : 'Edit any storefront text in English and Arabic. Leave a field empty to use the original text.'}
          </p>
        </div>
        <button className="btn btn-primary content-save" onClick={save} disabled={saving}>
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          <span>{saved ? (ar ? 'تم الحفظ' : 'Saved') : (ar ? 'حفظ التغييرات' : 'Save changes')}</span>
        </button>
      </div>

      {GROUPS.map(g => (
        <section key={g.id} className="content-group glass-card">
          <button
            type="button"
            className="content-group-head"
            aria-expanded={openGroup === g.id}
            onClick={() => setOpenGroup(openGroup === g.id ? '' : g.id)}
          >
            <span>{ar ? g.ar : g.en}</span>
            <span className="content-chevron">{openGroup === g.id ? '−' : '+'}</span>
          </button>

          {openGroup === g.id && (
            <div className="content-fields">
              {g.fields.map(([key, labelEn, labelAr, multi]) => {
                const Input = multi ? 'textarea' : 'input';
                const edited = content.en?.[key] !== undefined || content.ar?.[key] !== undefined;
                return (
                  <div key={key} className="content-field">
                    <div className="content-field-top">
                      <label className="form-label">{ar ? labelAr : labelEn}</label>
                      {edited && (
                        <button type="button" className="content-reset" onClick={() => resetKey(key)}>
                          <RotateCcw size={12} /> {ar ? 'استعادة' : 'Reset'}
                        </button>
                      )}
                    </div>
                    <div className="content-pair">
                      <div>
                        <span className="content-lang">EN</span>
                        <Input
                          className={`form-input ${multi ? 'form-textarea' : ''}`}
                          rows={multi ? 3 : undefined}
                          dir="ltr"
                          value={content.en?.[key] ?? ''}
                          placeholder={t(key)}
                          onChange={e => setValue('en', key, e.target.value)}
                        />
                      </div>
                      <div>
                        <span className="content-lang">AR</span>
                        <Input
                          className={`form-input ${multi ? 'form-textarea' : ''}`}
                          rows={multi ? 3 : undefined}
                          dir="rtl"
                          value={content.ar?.[key] ?? ''}
                          onChange={e => setValue('ar', key, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}

      <p className="content-hint">
        {ar ? `${dirtyCount} تعديل غير محفوظ أو محفوظ حالياً` : `${dirtyCount} custom value(s) in the form`}
      </p>

      <style>{`
        .content-root { display: flex; flex-direction: column; gap: 16px; }
        .content-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
        .content-head .admin-page-title { display: flex; align-items: center; gap: 10px; }
        .content-group { padding: 0; overflow: hidden; }
        .content-group-head {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          padding: 16px 18px; background: transparent; border: 0; color: var(--text-white);
          font-size: 1rem; font-weight: 700; cursor: pointer; text-align: start; min-height: 52px;
        }
        .content-chevron { color: var(--accent-purple); font-size: 1.4rem; line-height: 1; }
        .content-fields { padding: 4px 18px 18px; display: flex; flex-direction: column; gap: 18px; }
        .content-field-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .content-reset {
          display: inline-flex; align-items: center; gap: 4px; background: none; border: 0;
          color: var(--accent-purple); font-size: 0.78rem; cursor: pointer; padding: 4px 6px;
        }
        .content-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .content-lang { display: block; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; letter-spacing: 1px; }
        .content-hint { color: var(--text-muted); font-size: 0.82rem; text-align: center; }
        @media (max-width: 720px) {
          .content-pair { grid-template-columns: 1fr; }
          .content-save { width: 100%; }
        }
      `}</style>
    </div>
  );
};
