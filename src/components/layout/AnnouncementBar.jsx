import React, { useEffect, useState } from 'react';
import { settingsService } from '../../config/firebase';
import { useLanguage } from '../../context/LanguageContext';

/** Optional top banner, controlled from Admin → Settings. */
export const AnnouncementBar = () => {
  const { language } = useLanguage();
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    settingsService.get().then(s => { if (alive) setData(s.announcement); });
    const onUpdate = (e) => setData(e.detail?.announcement || null);
    window.addEventListener('playpass_settings_updated', onUpdate);
    return () => { alive = false; window.removeEventListener('playpass_settings_updated', onUpdate); };
  }, []);

  const text = data && (language === 'ar' ? data.text_ar || data.text_en : data.text_en || data.text_ar);
  if (!data?.enabled || !text) return null;

  return (
    <div className="announcement-bar" role="status">
      <span>{text}</span>
      <style>{`
        .announcement-bar {
          background: linear-gradient(90deg, #6842f4, #7c5cfc, #a78bfa);
          color: #fff; text-align: center; font-weight: 600; font-size: 0.88rem;
          padding: 9px 16px; line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
