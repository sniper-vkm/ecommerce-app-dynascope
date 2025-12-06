"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CheckCircle, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Checkout() {
    const { cart, subtotal, discountAmount, tax, total, coupon, setCoupon } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (cart.length === 0 && !success) {
            router.push('/');
        } else {
            setLoading(false);
        }
    }, [user, cart, router, success]);

    const handlePlaceOrder = () => {
        setSuccess(true);
        localStorage.removeItem("cart"); // Clear local storage
        setTimeout(() => {
            window.location.href = "/";
        }, 4000);
    };

    if (loading) return null;

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <CheckCircle size={64} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8 max-w-md">
                    Thank you, <strong>{user?.name}</strong>. Your order has been placed successfully.
                    You will be redirected to the homepage shortly.
                </p>
                <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                    Return Home Now
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4 mb-20">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Secure Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                            <MapPin className="text-indigo-600" />
                            <h2 className="text-xl font-bold text-gray-800">Shipping Details</h2>
                        </div>
                        <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">First Name</label>
                                    <input required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Last Name</label>
                                    <input required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Street Address</label>
                                <input required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123 Main St" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">City</label>
                                    <input required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-indigo-500" placeholder="New York" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Zip Code</label>
                                    <input required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-indigo-500" placeholder="10001" />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                            <CreditCard className="text-indigo-600" />
                            <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Card Number</label>
                                <input form="checkout-form" required placeholder="0000 0000 0000 0000" className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date</label>
                                    <input form="checkout-form" required placeholder="MM / YY" className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">CVC / CVV</label>
                                    <input form="checkout-form" required placeholder="123" className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingBag className="text-indigo-600" size={20} />
                            <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
                        </div>

                        <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-3 items-start">
                                    <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-0 right-0 bg-gray-900 text-white text-[10px] px-1 font-bold">x{item.quantity}</span>
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                                        <p className="text-gray-500 text-xs">{item.category}</p>
                                    </div>
                                    <div className="font-bold text-sm text-gray-800">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="border-dashed border-gray-200 my-4" />

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
                                    <span className="flex items-center gap-1">
                                        Coupon <span className="font-bold text-xs uppercase bg-green-200 px-1 rounded">{coupon?.code}</span>
                                    </span>
                                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-600">
                                <span>GST / VAT (18%)</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-900 font-bold text-lg">Total Payable</span>
                            <span className="text-2xl font-bold text-indigo-700">${total.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-gray-200 transition transform active:scale-95"
                        >
                            Pay ${total.toFixed(2)}
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <CheckCircle size={12} /> Secure SSL Encryption
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}