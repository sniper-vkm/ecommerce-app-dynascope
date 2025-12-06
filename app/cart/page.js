"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Cart() {
    const { cart, updateQty, removeFromCart, subtotal, discountAmount, tax, total, setCoupon } = useCart();
    const { user } = useAuth();
    const [couponCode, setCouponCode] = useState("");
    const [couponMsg, setCouponMsg] = useState({ text: "", type: "" });

    const applyCoupon = async () => {
        if (!couponCode) return;
        setCouponMsg({ text: "Verifying...", type: "info" });

        const res = await fetch('/api/coupons/verify', {
            method: 'POST',
            body: JSON.stringify({ code: couponCode, cartTotal: subtotal, cartItems: cart })
        });
        const data = await res.json();

        if (res.ok) {
            setCoupon(data.coupon);
            setCouponMsg({ text: `Success! ${data.coupon.code} applied.`, type: "success" });
        } else {
            setCoupon(null);
            setCouponMsg({ text: data.error, type: "error" });
        }
    };

    if (cart.length === 0) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
            <Link href="/" className="text-indigo-600 mt-4 inline-block hover:underline">Continue Shopping</Link>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* List */}
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Shopping Cart ({cart.length})</h2>
                {cart.map(item => (
                    <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                        <img src={item.image} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                            <div className="font-bold text-gray-900">${item.price}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                                <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full lg:w-96 bg-white p-6 rounded-2xl shadow-sm h-fit border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>

                <div className="mb-6">
                    <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Promo Code</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="border rounded-lg px-3 py-2 w-full text-sm outline-none focus:border-indigo-500"
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        />
                        <button onClick={applyCoupon} className="bg-gray-900 text-white px-4 rounded-lg text-sm font-medium">Apply</button>
                    </div>
                    {couponMsg.text && (
                        <p className={`text-xs mt-2 ${couponMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                            {couponMsg.text}
                        </p>
                    )}
                </div>

                <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
                    <div className="flex justify-between"><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between text-green-600"><span>Discount</span> <span>-${discountAmount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between"><span>VAT/GST (18%)</span> <span>${tax.toFixed(2)}</span></div>
                    <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Total Pay</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {user ? (
                    <Link href="/checkout" className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl mt-6 font-bold shadow-lg shadow-indigo-200 transition">
                        Proceed to Checkout
                    </Link>
                ) : (
                    <Link href="/login" className="block text-center w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl mt-6 font-bold">
                        Login to Checkout
                    </Link>
                )}
            </div>
        </div>
    );
}