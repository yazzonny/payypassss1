import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'playpass_cart_items_v1';
const COUPON_STORAGE_KEY = 'playpass_coupon_v1';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [coupon]);

  const addToCart = (product, selectedVariant = null, quantity = 1) => {
    const variantId = selectedVariant ? selectedVariant.id : 'default';
    const cartItemId = `${product.id}_${variantId}`;
    const itemPrice = selectedVariant ? selectedVariant.price : product.price;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem = {
          cartItemId,
          productId: product.id,
          name_en: product.name_en,
          name_ar: product.name_ar,
          category: product.category,
          imageUrl: product.imageUrl,
          variantId,
          variantName_en: selectedVariant ? selectedVariant.name_en : 'Standard',
          variantName_ar: selectedVariant ? selectedVariant.name_ar : 'أساسي',
          price: itemPrice,
          quantity
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PLAYPASS10' || clean === 'WELCOME10') {
      const couponObj = { code: clean, percentage: 10 };
      setCoupon(couponObj);
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'VIP20') {
      const couponObj = { code: clean, percentage: 20 };
      setCoupon(couponObj);
      return { success: true, message: '20% VIP discount applied!' };
    }
    return { success: false, message: 'Invalid promo code' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon ? (subtotal * (coupon.percentage / 100)) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        itemsCount,
        subtotal,
        discountAmount,
        total,
        coupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
