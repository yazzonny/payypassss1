export const formatPrice = (amount, language = 'en') => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  if (language === 'ar') {
    return `$${num.toFixed(2)}`;
  }
  return `$${num.toFixed(2)}`;
};

export const formatDate = (dateString, language = 'en') => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateString;
  }
};
