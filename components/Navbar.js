"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { LogOut, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">NextShop</Link>

                <div className="flex items-center gap-6">
                    <Link href="/" className="hover:text-indigo-600 font-medium text-gray-600">Store</Link>

                    {user?.role === 'admin' && (
                        <div className="flex gap-4">
                            <Link href="/admin/products" className="text-gray-600 hover:text-indigo-600 font-medium">Manage Products</Link>
                            <Link href="/admin/coupons" className="text-gray-600 hover:text-indigo-600 font-medium">Manage Coupons</Link>
                        </div>
                    )}

                    <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600">
                        <ShoppingBag size={24} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4 border-l pl-4 ml-2">
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-bold text-gray-500 uppercase">{user.role}</span>
                                <span className="text-sm font-semibold">{user.email?.split('@')[0]}</span>
                            </div>
                            <button onClick={logout} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><LogOut size={20} /></button>
                        </div>
                    ) : (
                        <Link href="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}