"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [coupon, setCoupon] = useState(null);

    // Load cart from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let discountAmount = 0;
    if (coupon) {
        if (coupon.type === 'percent') discountAmount = (subtotal * coupon.value) / 100;
        else discountAmount = coupon.value;
    }

    // Prevent discount from exceeding subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.18; // 18% GST/VAT
    const total = taxableAmount + tax;

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const updateQty = (id, change) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                const newQty = Math.max(1, p.quantity + change);
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQty,
            subtotal, discountAmount, tax, total,
            coupon, setCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);