export const INITIAL_PRODUCTS = [
  {
    id: 'prod-netflix-4k',
    name_en: 'Netflix Premium 4K Ultra HD',
    name_ar: 'اشتراك نتفلكس بريميوم 4K ألترا HD',
    description_en: 'Private profile with personal PIN code. Watch unlimited movies and TV shows in 4K HDR with spatial audio on phone, tablet, laptop, or smart TV. 100% genuine warranty.',
    description_ar: 'ملف خاص مقفل برمز PIN سري. استمتع بمشاهدة غير محدودة للأفلام والمسلسلات بجودة 4K HDR وصوت مكاني على التلفزيون أو الجوال أو الكمبيوتر. ضمان كامل طوال فترة الاشتراك.',
    category: 'subscriptions',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 328,
    badge_en: 'Best Seller',
    badge_ar: 'الأكثر طلباً',
    features_en: ['Private Profile with PIN', 'Ultra HD 4K Quality', 'Instant Digital Delivery', 'Full Duration Warranty'],
    features_ar: ['ملف خاص برمز سري', 'جودة 4K ألترا HD فائقة', 'تسليم رقمي فوري', 'ضمان كامل المدة'],
    variants: [
      { id: '1m', name_en: '1 Month', name_ar: 'شهر واحد', price: 4.99 },
      { id: '3m', name_en: '3 Months (Save 15%)', name_ar: '3 أشهر (وفر 15%)', price: 12.99 },
      { id: '6m', name_en: '6 Months (Save 20%)', name_ar: '6 أشهر (وفر 20%)', price: 23.99 },
      { id: '12m', name_en: '12 Months (Best Value)', name_ar: '12 شهر (أفضل توفير)', price: 42.99 }
    ]
  },
  {
    id: 'prod-iptv-ultra',
    name_en: 'IPTV 4K VIP Premium (10,000+ Channels)',
    name_ar: 'اشتراك IPTV ألترا 4K (أكثر من 10,000 قناة ومكتبة)',
    description_en: 'Stream all global sports channels (beIN Sports, SSC, Sky Sports), live entertainment, and 50,000+ VOD movies and series with anti-buffering ultra servers.',
    description_ar: 'بث مباشر لجميع القنوات الرياضية العالمية المشفرة (beIN, SSC, Sky) والمفتوحة، مع مكتبة ضخمة تتجاوز 50,000 فيلم ومسلسل مترجم، بسيرفرات فائقة السرعة بدون تقطيع.',
    category: 'subscriptions',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 512,
    badge_en: 'Live Sports',
    badge_ar: 'شامل الرياضة',
    features_en: ['10,000+ Live Channels', '4K / FHD / HD Streaming', 'Compatible with all devices (Smart TV, Firestick, iOS, Android)', 'Free M3U & Xtream code'],
    features_ar: ['أكثر من 10,000 قناة حية', 'جودات متعددة 4K / FHD / HD', 'يعمل على الشاشات الذكية، أندرويد، آيفون، الكمبيوتر', 'بيانات M3U و Xtream جاهزة'],
    variants: [
      { id: '3m', name_en: '3 Months VIP', name_ar: '3 أشهر VIP', price: 9.99 },
      { id: '6m', name_en: '6 Months VIP', name_ar: '6 أشهر VIP', price: 16.99 },
      { id: '12m', name_en: '12 Months VIP (Save 35%)', name_ar: '12 شهر VIP (وفر 35%)', price: 28.99 }
    ]
  },
  {
    id: 'prod-playstation-card',
    name_en: 'PlayStation Store PSN Gift Card (US)',
    name_ar: 'بطاقة بلايستيشن ستور المتجر الأمريكي (PSN Card)',
    description_en: 'Instant digital code for PlayStation Network. Top up your PS4 and PS5 wallet to purchase digital games, PlayStation Plus, DLCs, and in-game currencies.',
    description_ar: 'كود رقمي فوري لمتجر بلايستيشن الأمريكي. اشحن رصيد حسابك على PS4 و PS5 لشراء أحدث الألعاب الرقمية، اشتراك بلايستيشن بلس، والإضافات الحصرية فورياً.',
    category: 'gaming',
    price: 10.49,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: true,
    rating: 5.0,
    reviewsCount: 420,
    badge_en: 'Instant Code',
    badge_ar: 'كود فوري',
    features_en: ['Official Sony Authorized Code', 'Works on PS5 & PS4', 'Instant Code on Screen & Email', 'No Expiration Date'],
    features_ar: ['أكواد رسمية معتمدة 100%', 'يعمل على PS5 و PS4', 'تسليم الكود فوراً على الشاشة والإيميل', 'لا تنتهي صلاحية الرصيد'],
    variants: [
      { id: 'psn-10', name_en: '$10 Card', name_ar: 'بطاقة 10 دولار', price: 10.49 },
      { id: 'psn-25', name_en: '$25 Card', name_ar: 'بطاقة 25 دولار', price: 25.49 },
      { id: 'psn-50', name_en: '$50 Card (Special Discount)', name_ar: 'بطاقة 50 دولار (خصم خاص)', price: 49.49 },
      { id: 'psn-100', name_en: '$100 Card (VIP Pack)', name_ar: 'بطاقة 100 دولار (باقة VIP)', price: 96.99 }
    ]
  },
  {
    id: 'prod-xbox-game-pass',
    name_en: 'Xbox Game Pass Ultimate (Console & PC)',
    name_ar: 'اشتراك إكس بوكس جيم باس ألتيميت (Console & PC)',
    description_en: 'Access over 100 high-quality games on Xbox Series X|S, Xbox One, Windows PC, and Cloud Gaming. Includes EA Play membership and online multiplayer.',
    description_ar: 'وصول لمئات الألعاب العالمية الضخمة على أجهزة Xbox والكمبيوتر واللعب السحابي مع مكتبة ألعاب اليوم الأول، ويتضمن اشتراك EA Play واللعب أونلاين مجاناً.',
    category: 'gaming',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewsCount: 285,
    badge_en: 'Includes EA Play',
    badge_ar: 'شامل EA Play',
    features_en: ['Play on Xbox, PC & Cloud', 'Includes EA Play & Online Gold', 'Day One First-Party Releases', 'Exclusive Member Discounts'],
    features_ar: ['يعمل على إكس بوكس والكمبيوتر والسحابة', 'يشمل EA Play واشتراك الأونلاين', 'إصدارات اليوم الأول الحصرية', 'خصومات إضافية للأعضاء'],
    variants: [
      { id: '1m', name_en: '1 Month Ultimate', name_ar: 'شهر واحد ألتيميت', price: 7.99 },
      { id: '3m', name_en: '3 Months Ultimate', name_ar: '3 أشهر ألتيميت', price: 21.99 },
      { id: '12m', name_en: '12 Months Ultimate (Best Deal)', name_ar: '12 شهر ألتيميت (العرض الأقوى)', price: 68.99 }
    ]
  },
  {
    id: 'prod-spotify-premium',
    name_en: 'Spotify Premium Individual',
    name_ar: 'اشتراك سبوتيفاي بريميوم حساب خاص',
    description_en: 'Enjoy ad-free music listening, offline downloads, unlimited skips, and superior sound quality on your personal Spotify account.',
    description_ar: 'استمتع بملايين الأغاني والبودكاست بدون إعلانات مزعجة، مع إمكانية التحميل والاستماع أوفلاين وتخطي لا محدود وجودة صوت فائقة على حسابك الخاص.',
    category: 'subscriptions',
    price: 2.99,
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: false,
    rating: 4.9,
    reviewsCount: 198,
    badge_en: 'On Your Account',
    badge_ar: 'على حسابك الخاص',
    features_en: ['Ad-free Music Listening', 'Offline Downloads', 'Highest Audio Quality', 'Works Worldwide'],
    features_ar: ['بدون أي إعلانات', 'تحميل للاستماع بدون إنترنت', 'أعلى جودة صوت نقية', 'يعمل في جميع دول العالم'],
    variants: [
      { id: '1m', name_en: '1 Month Individual', name_ar: 'شهر واحد', price: 2.99 },
      { id: '3m', name_en: '3 Months Individual', name_ar: '3 أشهر', price: 7.49 },
      { id: '6m', name_en: '6 Months Individual', name_ar: '6 أشهر', price: 13.99 },
      { id: '12m', name_en: '12 Months Individual (Save 30%)', name_ar: '12 شهر (وفر 30%)', price: 24.99 }
    ]
  },
  {
    id: 'prod-steam-wallet',
    name_en: 'Steam Wallet Card Global / USD',
    name_ar: 'بطاقة رصيد محفظة ستيم العالمية بالدولار',
    description_en: 'Redeem directly on your Steam account to buy games, software, in-game items, and community market items on PC / Mac.',
    description_ar: 'اشحن رصيد محفظتك على منصة ستيم لشراء ألعاب الكمبيوتر، الحزم الإضافية، وأغراض سوق مجتمع ستيم فورياً وبأفضل سعر.',
    category: 'gaming',
    price: 10.50,
    imageUrl: 'https://images.unsplash.com/photo-1612287271176-5991448b1115?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: false,
    rating: 4.9,
    reviewsCount: 310,
    badge_en: 'Global Key',
    badge_ar: 'كود عالمي',
    features_en: ['Instant Delivery Code', 'Global Activation', 'No Fees or Expiry', 'Thousands of PC Games'],
    features_ar: ['تسليم الكود فوراً', 'تفعيل عالمي على جميع الحسابات', 'بدون أي رسوم إضافية أو انتهاء صلاحية', 'آلاف ألعاب الكمبيوتر'],
    variants: [
      { id: 'steam-10', name_en: '$10 Global Code', name_ar: 'كود 10 دولار', price: 10.50 },
      { id: 'steam-20', name_en: '$20 Global Code', name_ar: 'كود 20 دولار', price: 20.50 },
      { id: 'steam-50', name_en: '$50 Global Code', name_ar: 'كود 50 دولار', price: 49.50 },
      { id: 'steam-100', name_en: '$100 Global Code', name_ar: 'كود 100 دولار', price: 98.00 }
    ]
  },
  {
    id: 'prod-youtube-premium',
    name_en: 'YouTube Premium & Music (Individual)',
    name_ar: 'اشتراك يوتيوب بريميوم وموسيقى (حساب خاص)',
    description_en: 'Watch YouTube videos completely ad-free, play in background with screen locked, and access YouTube Music Premium with offline playback.',
    description_ar: 'تخلص من إعلانات يوتيوب نهائياً، مع تشغيل المقاطع في الخلفية أثناء قفل الشاشة، واشتراك مجاني في يوتيوب ميوزك بريميوم بدون قيود.',
    category: 'subscriptions',
    price: 3.49,
    imageUrl: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: false,
    rating: 4.8,
    reviewsCount: 165,
    badge_en: 'Ad-Free',
    badge_ar: 'بدون إعلانات',
    features_en: ['Ad-free Videos on TV & Mobile', 'Background Video Playback', 'YouTube Music Premium Included', 'Offline Video Downloads'],
    features_ar: ['بدون إعلانات على التلفزيون والجوال', 'تشغيل المقاطع في الخلفية والشاشة مغلقة', 'يشمل يوتيوب ميوزك بريميوم', 'تحميل المقاطع للمشاهدة بدون نت'],
    variants: [
      { id: '1m', name_en: '1 Month', name_ar: 'شهر واحد', price: 3.49 },
      { id: '6m', name_en: '6 Months', name_ar: '6 أشهر', price: 16.99 },
      { id: '12m', name_en: '12 Months (Recommended)', name_ar: '12 شهر (الأكثر توفيراً)', price: 29.99 }
    ]
  },
  {
    id: 'prod-razer-gold',
    name_en: 'Razer Gold Global PIN',
    name_ar: 'بطاقة ريزر جولد العالمية (Razer Gold PIN)',
    description_en: 'Unified virtual credits for gamers worldwide. Use Razer Gold to buy games and in-game content for over 42,000 games and entertainment apps.',
    description_ar: 'العملة الافتراضية الموحدة للاعبين. استخدم رصيد ريزر جولد لشحن أكثر من 42,000 لعبة وتطبيق ترفيهي مثل ببجي وفري فاير وروبلوكس.',
    category: 'gaming',
    price: 10.49,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    featured: false,
    rating: 4.9,
    reviewsCount: 220,
    badge_en: 'PUBG & Roblox',
    badge_ar: 'شحن ألعاب وتطبيقات',
    features_en: ['Works on PUBG, Free Fire, Roblox', 'Earn Razer Silver Rewards', 'Instant PIN Delivery', 'Global Currency'],
    features_ar: ['يدعم شحن ببجي وفري فاير وروبلوكس', 'اكسب نقاط ريزر سيلفر مع كل شحن', 'تسليم فوري للكود والـ PIN', 'صالح لجميع الحسابات العالمية'],
    variants: [
      { id: 'razer-10', name_en: '$10 PIN', name_ar: 'كود 10 دولار', price: 10.49 },
      { id: 'razer-25', name_en: '$25 PIN', name_ar: 'كود 25 دولار', price: 25.49 },
      { id: 'razer-50', name_en: '$50 PIN', name_ar: 'كود 50 دولار', price: 49.99 }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'PP-98214',
    customerInfo: {
      name: 'Khalid Al-Mansoor',
      email: 'khalid.gamer@gmail.com',
      phone: '+966501234567',
      notes: 'Please send credentials via WhatsApp too.'
    },
    items: [
      {
        id: 'prod-netflix-4k',
        name_en: 'Netflix Premium 4K Ultra HD',
        name_ar: 'اشتراك نتفلكس بريميوم 4K ألترا HD',
        variantName_en: '12 Months (Best Value)',
        variantName_ar: '12 شهر (أفضل توفير)',
        price: 42.99,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80'
      }
    ],
    total: 42.99,
    status: 'Delivered',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    fulfillmentNotes: 'Account: netflix-user-91@playpass.vip | PIN: 8492 | Expires: 2027-09-07',
    rejectionReason: '',
    createdAt: '2026-09-07T14:30:00.000Z'
  },
  {
    id: 'PP-98215',
    customerInfo: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@outlook.com',
      phone: '+14155552671',
      notes: ''
    },
    items: [
      {
        id: 'prod-playstation-card',
        name_en: 'PlayStation Store PSN Gift Card (US)',
        name_ar: 'بطاقة بلايستيشن ستور المتجر الأمريكي',
        variantName_en: '$50 Card',
        variantName_ar: 'بطاقة 50 دولار',
        price: 49.49,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80'
      }
    ],
    total: 98.98,
    status: 'Confirmed',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80',
    fulfillmentNotes: 'Payment verified from Arab Bank app statement. Preparing PSN codes.',
    rejectionReason: '',
    createdAt: '2026-09-07T16:45:00.000Z'
  },
  {
    id: 'PP-98216',
    customerInfo: {
      name: 'Omar Farooq',
      email: 'omar.f@yahoo.com',
      phone: '+971509876543',
      notes: 'Need M3U playlist link.'
    },
    items: [
      {
        id: 'prod-iptv-ultra',
        name_en: 'IPTV 4K VIP Premium (10,000+ Channels)',
        name_ar: 'اشتراك IPTV ألترا 4K',
        variantName_en: '12 Months VIP',
        variantName_ar: '12 شهر VIP',
        price: 28.99,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80'
      }
    ],
    total: 28.99,
    status: 'Pending Verification',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    fulfillmentNotes: '',
    rejectionReason: '',
    createdAt: '2026-09-07T18:10:00.000Z'
  }
];
