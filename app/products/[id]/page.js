"use client";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Product not found");
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // Reset button after 2 seconds
    };

    if (loading) return <div className="p-10 text-center">Loading product...</div>;
    if (!product) return <div className="p-10 text-center">Product not found.</div>;

    return (
        <div className="max-w-6xl mx-auto mt-6">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6">
                <ArrowLeft size={20} /> Back to Store
            </Link>

            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Image */}
                <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4 h-[400px]">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                </div>

                {/* Right: Details */}
                <div className="flex flex-col justify-center">
                    <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">
                        {product.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {product.name}
                    </h1>
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-b py-6 mb-8">
                        <div className="text-3xl font-bold text-gray-900">
                            ${product.price}
                        </div>
                        <div className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                            In Stock
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 flex justify-center items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${added
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-900 text-white hover:bg-gray-800"
                                }`}
                        >
                            {added ? (
                                <> <Check size={24} /> Added to Cart </>
                            ) : (
                                <> <ShoppingCart size={24} /> Add to Cart </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}