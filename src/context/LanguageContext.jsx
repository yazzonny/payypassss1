import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    storeName: 'PlayPass',
    tagline: 'All Access, Everywhere',
    navHome: 'Home',
    navCatalog: 'Store Catalog',
    navSubscriptions: 'Subscriptions',
    navGaming: 'Gaming & Gift Cards',
    navMyOrders: 'My Orders',
    navAdmin: 'Admin Panel',
    navLogin: 'Sign In',
    navAccount: 'Account',
    navLogout: 'Sign Out',
    cart: 'Cart',
    emptyCart: 'Your cart is empty',

    // Hero & Home
    heroBadge: '⚡ Instant Digital Delivery • 100% Genuine Warranty',
    heroTitle: 'Unlock Premium Streaming & Next-Gen Gaming',
    heroSubtitle: 'Access top subscriptions like Netflix, IPTV, and Spotify alongside PlayStation, Xbox, and Steam credit at unbeatable prices.',
    heroCtaShop: 'Shop Now',
    heroCtaSubs: 'Browse Subscriptions',
    heroStat1Number: '50K+',
    heroStat1Label: 'Happy Gamers & Streamers',
    heroStat2Number: '100%',
    heroStat2Label: 'Instant Delivery Guarantee',
    heroStat3Number: '24/7',
    heroStat3Label: 'Dedicated VIP Support',

    // Trust & Features
    trustTitle: 'Why Gamers & Streamers Choose PlayPass',
    trustSubtitle: 'Engineered for instant speed, reliability, and security.',
    trustFeature1Title: 'Instant Delivery',
    trustFeature1Desc: 'Digital codes and credentials are sent to your screen & email within seconds of ordering.',
    trustFeature2Title: '100% Genuine & Safe',
    trustFeature2Desc: 'All subscriptions and game keys are authentic, with guaranteed replacement warranty.',
    trustFeature3Title: 'Bilingual VIP Support',
    trustFeature3Desc: 'Friendly Arabic and English customer care available around the clock via WhatsApp & Chat.',
    trustFeature4Title: 'Secure Flexible Checkout',
    trustFeature4Desc: 'Convenient payment options tailored for our Middle Eastern and global clientele.',

    // Categories
    catSectionTitle: 'Explore Categories',
    catSectionSubtitle: 'Select your entertainment world below',
    catSubsTitle: 'Digital Subscriptions',
    catSubsDesc: 'Netflix 4K, IPTV sports streaming, Spotify Premium, YouTube & more.',
    catGamingTitle: 'Gaming & Gift Cards',
    catGamingDesc: 'PlayStation, Xbox Game Pass, Steam Wallet, Razer Gold credits.',
    featuredTitle: 'Featured & Best Sellers',
    featuredSubtitle: 'Hand-picked deals loved by our community',
    viewAll: 'View All Products',

    // Catalog & Filter
    catalogTitle: 'Digital Store Catalog',
    catalogSubtitle: 'Browse our complete selection of digital passes, cards, and subscriptions.',
    searchPlaceholder: 'Search games, gift cards, subscriptions...',
    allCategories: 'All Categories',
    filterByPrice: 'Sort By',
    sortFeatured: 'Featured Deals',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    inStockOnly: 'In Stock Only',
    noProductsFound: 'No products match your search or filter.',
    resetFilters: 'Reset Filters',

    // Product Card & Detail
    inStock: 'In Stock - Instant Delivery',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    viewDetails: 'View Details',
    selectVariant: 'Choose Duration / Denomination',
    featuresTitle: 'Product Highlights & Specs',
    deliveryNote: '⚡ Delivered immediately via email & dashboard',
    guaranteeNote: '🛡️ 100% Replacement Warranty Guaranteed',
    relatedProducts: 'You May Also Like',
    reviews: 'verified reviews',

    // Cart
    cartTitle: 'Shopping Cart',
    cartSubtitle: 'Review your selected passes and subscriptions',
    item: 'Item',
    price: 'Price',
    qty: 'Qty',
    total: 'Total',
    subtotal: 'Subtotal',
    discount: 'Discount',
    havePromo: 'Have a promo code?',
    apply: 'Apply',
    promoApplied: 'Promo code applied: 10% discount!',
    promoInvalid: 'Invalid promo code (Try PLAYPASS10)',
    proceedToCheckout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    clearCart: 'Clear Cart',

    // Checkout
    checkoutTitle: 'Secure Checkout',
    checkoutSubtitle: 'Complete your order details below',
    contactInfo: '1. Customer Information',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    emailAddress: 'Email for Digital Delivery',
    emailPlaceholder: 'you@example.com (credentials will be sent here)',
    phone: 'WhatsApp / Phone Number',
    phonePlaceholder: '+966 50 000 0000',
    orderNotes: 'Order Notes (Optional)',
    notesPlaceholder: 'e.g. Account region or preferred delivery time',
    orderSummary: 'Order Summary',
    paymentStep: '2. Payment Method',
    paymentPlaceholderNotice: 'Merchant Payment Gateway / Transfer Area',
    paymentPlaceholderSubtext: 'The payment link, hosted gateway, or bank transfer instructions will be plugged in here.',
    paymentTestHint: 'Test Simulation: Click below to simulate completing payment and generate your order.',
    simulatePaymentBtn: 'Confirm & Place Order ($',
    processingOrder: 'Generating your order...',

    // Order Success
    orderSuccessTitle: 'Order Confirmed!',
    orderSuccessSubtitle: 'Thank you for shopping with PlayPass. Your digital goods are ready.',
    orderNumber: 'Order Reference',
    deliveryInstructions: 'Delivery Instructions & Credentials',
    supportNotice: 'Need immediate help? Reach our team on WhatsApp with your Order Reference ID.',
    backToHome: 'Back to Home',
    viewMyOrders: 'View in My Orders',
    printReceipt: 'Print Receipt',

    // Auth & Accounts
    authTitleLogin: 'Welcome Back',
    authSubtitleLogin: 'Sign in to access your order history and digital passes.',
    authTitleRegister: 'Create an Account',
    authSubtitleRegister: 'Join PlayPass for instant delivery and order tracking.',
    email: 'Email Address',
    password: 'Password',
    loginBtn: 'Sign In',
    registerBtn: 'Create Account',
    needAccount: "Don't have an account? Sign up",
    haveAccount: 'Already have an account? Sign in',
    demoAdminBtn: 'Quick Login as Admin',
    demoUserBtn: 'Quick Login as Customer',
    myAccountTitle: 'My Account & Order History',
    myAccountSubtitle: 'Track your subscriptions, view credentials, and check order statuses.',
    noOrdersYet: "You haven't placed any orders yet.",
    startShopping: 'Start Shopping',
    status: 'Status',
    statusPending: 'Pending Payment',
    statusPendingPayment: 'Pending Payment',
    statusPaid: 'Paid',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
    payNow: 'Pay Now',
    afterPaymentContactWhatsApp: 'After completing payment, contact us on WhatsApp to confirm your payment and receive your product.',
    contactWhatsAppToConfirm: 'Confirm on WhatsApp',
    fulfillmentDetails: 'Digital Access Details / Credentials',

    // Admin Dashboard
    adminTitle: 'PlayPass Control Center',
    adminSubtitle: 'Manage store products, live orders, and system settings.',
    adminTabOverview: 'Overview',
    adminTabProducts: 'Products Management',
    adminTabOrders: 'Orders Management',
    adminTabSettings: 'Settings & Payment',
    adminStatsRevenue: 'Total Revenue',
    adminStatsOrders: 'Total Orders',
    adminStatsProducts: 'Active Products',
    adminStatsPending: 'Pending Fulfillment',
    adminRecentOrders: 'Recent Orders Feed',
    adminAddNewProduct: 'Add New Product',
    adminEditProduct: 'Edit Product',
    adminDeleteProduct: 'Delete Product',
    adminDeleteConfirm: 'Are you sure you want to delete this product?',
    adminSaveProduct: 'Save Product',
    adminCancel: 'Cancel',
    adminProductEnName: 'Product Name (English)',
    adminProductArName: 'Product Name (Arabic)',
    adminCategory: 'Category',
    adminBasePrice: 'Base Price ($)',
    adminStockStatus: 'In Stock Availability',
    adminImageUpload: 'Product Image',
    adminUploadOrUrl: 'Upload Image File or Paste URL',
    adminPreview: 'Image Preview',
    adminDescEn: 'Description (English)',
    adminDescAr: 'Description (Arabic)',
    adminVariants: 'Duration / Value Variants',
    adminAddVariant: '+ Add Variant',
    adminActions: 'Actions',
    adminUpdateStatus: 'Update Status',
    adminCustomer: 'Customer',
    adminItems: 'Items',
    adminDate: 'Date',
    adminEnterCredentials: 'Enter Credentials / Serial Codes to Deliver:',
    adminSaveNotes: 'Update Fulfillment Notes',

    // Footer
    footerDesc: 'PlayPass is your premier destination for digital entertainment, sports streaming, and gaming credit with instant automated delivery.',
    footerQuickLinks: 'Quick Links',
    footerCategories: 'Categories',
    footerSupport: '24/7 Customer Care',
    footerAllRights: 'All rights reserved. Designed for elite gaming & streaming.'
  },

  ar: {
    // Navigation
    storeName: 'بلاي باس',
    tagline: 'وصول شامل، في كل مكان',
    navHome: 'الرئيسية',
    navCatalog: 'المتجر والمنتجات',
    navSubscriptions: 'الاشتراكات الرقمية',
    navGaming: 'ألعاب وبطاقات شحن',
    navMyOrders: 'طلباتي',
    navAdmin: 'لوحة التحكم',
    navLogin: 'تسجيل الدخول',
    navAccount: 'حسابي',
    navLogout: 'تسجيل الخروج',
    cart: 'السلة',
    emptyCart: 'سلة المشتريات فارغة',

    // Hero & Home
    heroBadge: '⚡ تسليم رقمي فوري • ضمان ذهبي 100%',
    heroTitle: 'عالم الاشتراكات الترفيهية وبطاقات الألعاب الرقمية',
    heroSubtitle: 'احصل على اشتراكات نتفلكس، IPTV، وسبوتيفاي مع بطاقات شحن بلايستيشن، إكس بوكس وستيم بأفضل الأسعار وأسرع تسليم.',
    heroCtaShop: 'تسوق الآن',
    heroCtaSubs: 'تصفح الاشتراكات',
    heroStat1Number: '+50 ألف',
    heroStat1Label: 'عميل سعيد ومستمر',
    heroStat2Number: '100%',
    heroStat2Label: 'ضمان التسليم الفوري',
    heroStat3Number: '24/7',
    heroStat3Label: 'دعم فني مباشر على مدار الساعة',

    // Trust & Features
    trustTitle: 'لماذا يختار اللاعبون والمشاهدون PlayPass؟',
    trustSubtitle: 'مصمم خصيصاً لتوفير السرعة الفائقة والأمان التام والراحة.',
    trustFeature1Title: 'تسليم رقمي فوري',
    trustFeature1Desc: 'تصلك الأكواد وبيانات الحسابات فور إتمام الطلب مباشرة على الشاشة والإيميل.',
    trustFeature2Title: 'رسمي ومضمون 100%',
    trustFeature2Desc: 'جميع الاشتراكات والبطاقات أصلية ومضمونة بضمان استبدال كامل المدة.',
    trustFeature3Title: 'دعم VIP عربي وإنجليزي',
    trustFeature3Desc: 'فريق دعم محترف متواجد طوال الوقت عبر الواتساب والمحادثة لمساعدتك فوراً.',
    trustFeature4Title: 'طرق دفع مرنة وآمنة',
    trustFeature4Desc: 'خيارات دفع مريحة ومتنوعة تناسب عملاءنا في الخليج ومختلف دول العالم.',

    // Categories
    catSectionTitle: 'استكشف الأقسام',
    catSectionSubtitle: 'اختر عالم الترفيه المناسب لك',
    catSubsTitle: 'الاشتراكات الرقمية',
    catSubsDesc: 'نتفلكس 4K، اشتراكات IPTV للمباريات، سبوتيفاي، يوتيوب والمزيد.',
    catGamingTitle: 'ألعاب وبطاقات الشحن',
    catGamingDesc: 'شحن بلايستيشن ستور، إكس بوكس جيم باس، بطاقات ستيم، ورصيد ريزر جولد.',
    featuredTitle: 'العروض الأكثر طلباً ومبيعاً',
    featuredSubtitle: 'باقات مختارة بعناية تحظى بثقة مجتمعنا',
    viewAll: 'عرض جميع المنتجات',

    // Catalog & Filter
    catalogTitle: 'كتالوج المتجر الرقمي',
    catalogSubtitle: 'تصفح تشكيلتنا الشاملة من الاشتراكات والبطاقات الرقمية والألعاب.',
    searchPlaceholder: 'ابحث عن ألعاب، اشتراكات، بطاقات شحن...',
    allCategories: 'جميع الأقسام',
    filterByPrice: 'ترتيب حسب',
    sortFeatured: 'العروض المميزة',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    inStockOnly: 'المتوفر فقط',
    noProductsFound: 'لم يتم العثور على منتجات تطابق بحثك.',
    resetFilters: 'إعادة ضبط الفلاتر',

    // Product Card & Detail
    inStock: 'متوفر - تسليم فوري',
    outOfStock: 'نفد من المخزون',
    addToCart: 'أضف للسلة',
    buyNow: 'شراء الآن',
    viewDetails: 'عرض التفاصيل',
    selectVariant: 'اختر المدة أو فئة البطاقة',
    featuresTitle: 'مميزات ومواصفات المنتج',
    deliveryNote: '⚡ تسليم تلقائي فوري عبر الإيميل ولوحة الحساب',
    guaranteeNote: '🛡️ ضمان استبدال كامل المدة رسمي 100%',
    relatedProducts: 'منتجات قد تعجبك أيضاً',
    reviews: 'تقييم موثق',

    // Cart
    cartTitle: 'سلة المشتريات',
    cartSubtitle: 'راجع طلباتك والاشتراكات المختارة',
    item: 'المنتج',
    price: 'السعر',
    qty: 'الكمية',
    total: 'الإجمالي',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    havePromo: 'هل لديك كود خصم؟',
    apply: 'تطبيق',
    promoApplied: 'تم تطبيق كود الخصم بنجاح: خصم 10%!',
    promoInvalid: 'كود الخصم غير صالح (جرّب: PLAYPASS10)',
    proceedToCheckout: 'متابعة الدفع والطلب',
    continueShopping: 'متابعة التسوق',
    clearCart: 'تفريغ السلة',

    // Checkout
    checkoutTitle: 'إتمام الطلب',
    checkoutSubtitle: 'أدخل بيانات الاستلام وطريقة الدفع أدناه',
    contactInfo: '1. بيانات العميل والتسليم',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخل اسمك الكريم',
    emailAddress: 'البريد الإلكتروني للتسليم الرقمي',
    emailPlaceholder: 'you@example.com (ستصلك بيانات الاشتراك هنا)',
    phone: 'رقم الجوال أو الواتساب',
    phonePlaceholder: '+966 50 000 0000',
    orderNotes: 'ملاحظات إضافية (اختياري)',
    notesPlaceholder: 'مثال: رغبة في استلام البيانات عبر الواتساب أو ريجن الحساب',
    orderSummary: 'ملخص الطلب',
    paymentStep: '2. وسيلة الدفع',
    paymentPlaceholderNotice: 'مساحة مخصصة لبوابة الدفع / التحويل البنكي',
    paymentPlaceholderSubtext: 'يمكنك وضع رابط الدفع المباشر، زر الدفع، أو تعليمات التحويل البنكي في هذا المكان.',
    paymentTestHint: 'تجربة الطلب: اضغط على الزر أدناه لمحاكاة الدفع وإنشاء الطلب فورياً.',
    simulatePaymentBtn: 'تأكيد وإتمام الطلب ($',
    processingOrder: 'جاري إنشاء طلبك وتجهيز البيانات...',

    // Order Success
    orderSuccessTitle: 'تم تأكيد طلبك بنجاح!',
    orderSuccessSubtitle: 'شكراً لثقتك في PlayPass! تم تسجيل طلبك وبياناتك الرقمية جاهزة.',
    orderNumber: 'رقم الطلب المرجعي',
    deliveryInstructions: 'بيانات التسليم والتعليمات',
    supportNotice: 'تحتاج لمساعدة سريعة؟ تواصل معنا عبر الواتساب برقم طلبك المرجعي.',
    backToHome: 'العودة للرئيسية',
    viewMyOrders: 'عرض في طلباتي',
    printReceipt: 'طباعة الإيصال',

    // Auth & Accounts
    authTitleLogin: 'مرحباً بك مجدداً',
    authSubtitleLogin: 'سجّل دخولك للوصول إلى طلباتك وبيانات اشتراكاتك الرقمية.',
    authTitleRegister: 'إنشاء حساب جديد',
    authSubtitleRegister: 'انضم إلى PlayPass لمتابعة مشترياتك واستلام العروض الحصرية.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'تسجيل الدخول',
    registerBtn: 'إنشاء الحساب',
    needAccount: 'ليس لديك حساب؟ سجّل الآن',
    haveAccount: 'لديك حساب بالفعل؟ سجّل دخولك',
    demoAdminBtn: 'دخول سريع بحساب المسؤول (Admin)',
    demoUserBtn: 'دخول سريع بحساب العميل',
    myAccountTitle: 'حسابي وسجل الطلبات',
    myAccountSubtitle: 'متابعة حالة الاشتراكات، عرض بيانات التفعيل، وتفاصيل العمليات.',
    noOrdersYet: 'لم تقم بإجراء أي طلبات حتى الآن.',
    startShopping: 'ابدأ التسوق الآن',
    status: 'الحالة',
    statusPending: 'بانتظار تأكيد الدفع',
    statusPendingPayment: 'بانتظار تأكيد الدفع',
    statusPaid: 'تم تأكيد الدفع',
    statusDelivered: 'تم التسليم',
    statusCancelled: 'ملغي',
    payNow: 'ادفع الآن',
    afterPaymentContactWhatsApp: 'بعد إتمام الدفع، تواصل معنا عبر الواتساب لتأكيد الدفع واستلام طلبك.',
    contactWhatsAppToConfirm: 'تأكيد الدفع عبر الواتساب',
    fulfillmentDetails: 'بيانات الوصول الرقمي والأكواد',

    // Admin Dashboard
    adminTitle: 'مركز التحكم PlayPass',
    adminSubtitle: 'إدارة المنتجات، متابعة الطلبات الواردة، وإعدادات النظام.',
    adminTabOverview: 'نظرة عامة',
    adminTabProducts: 'إدارة المنتجات',
    adminTabOrders: 'إدارة الطلبات',
    adminTabSettings: 'الإعدادات وبوابة الدفع',
    adminStatsRevenue: 'إجمالي المبيعات',
    adminStatsOrders: 'عدد الطلبات',
    adminStatsProducts: 'المنتجات النشطة',
    adminStatsPending: 'طلبات قيد التسليم',
    adminRecentOrders: 'أحدث الطلبات الواردة',
    adminAddNewProduct: 'إضافة منتج جديد',
    adminEditProduct: 'تعديل المنتج',
    adminDeleteProduct: 'حذف المنتج',
    adminDeleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا المنتج؟',
    adminSaveProduct: 'حفظ المنتج',
    adminCancel: 'إلغاء',
    adminProductEnName: 'اسم المنتج (بالإنجليزية)',
    adminProductArName: 'اسم المنتج (بالعربية)',
    adminCategory: 'القسم',
    adminBasePrice: 'السعر الأساسي ($)',
    adminStockStatus: 'حالة التوفر بالمخزون',
    adminImageUpload: 'صورة المنتج',
    adminUploadOrUrl: 'رفع ملف صورة أو إدخال رابط مباشر',
    adminPreview: 'معاينة الصورة',
    adminDescEn: 'الوصف (بالإنجليزية)',
    adminDescAr: 'الوصف (بالعربية)',
    adminVariants: 'خيارات المدة / الفئات والأسعار',
    adminAddVariant: '+ إضافة خيار / باقة',
    adminActions: 'إجراءات',
    adminUpdateStatus: 'تحديث الحالة',
    adminCustomer: 'العميل',
    adminItems: 'المنتجات',
    adminDate: 'التاريخ',
    adminEnterCredentials: 'أدخل أكواد البطاقات أو بيانات الحساب المسلّمة للعميل:',
    adminSaveNotes: 'حفظ بيانات التسليم',

    // Footer
    footerDesc: 'بلاي باس وجهتك الأولى للاشتراكات الترفيهية الرقمية، بث المباريات، وبطاقات الألعاب بأفضل الأسعار وتسليم آلي فوري.',
    footerQuickLinks: 'روابط سريعة',
    footerCategories: 'الأقسام',
    footerSupport: 'خدمة العملاء 24/7',
    footerAllRights: 'جميع الحقوق محفوظة. مصمم لتجربة ألعاب وترفيه استثنائية.'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('playpass_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('playpass_lang', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const setLang = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguage(lang);
    }
  };

  const t = (key, fallback = '') => {
    return translations[language]?.[key] || translations.en[key] || fallback || key;
  };

  // Helper for localized object field (e.g. name_en vs name_ar)
  const tObj = (obj, fieldBase) => {
    if (!obj) return '';
    const localizedKey = `${fieldBase}_${language}`;
    const fallbackKey = `${fieldBase}_en`;
    return obj[localizedKey] || obj[fallbackKey] || obj[fieldBase] || '';
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, isRTL, toggleLanguage, setLang, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
