"use client";
import { useCart } from "@/context/CartContext";
import { Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => {
      setProducts(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let res = [...products];
    if (category !== "All") res = res.filter(p => p.category === category);

    if (sort === "low-high") res.sort((a, b) => a.price - b.price);
    if (sort === "high-low") res.sort((a, b) => b.price - a.price);

    setFiltered(res);
  }, [category, sort, products]);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  return (
    <div>
      {/* Banner */}
      <div className="bg-indigo-900 text-white p-8 rounded-2xl mb-8 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-2">Summer Collection</h1>
        <p className="opacity-80">Up to 50% off on selected items.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <span className="font-semibold text-gray-700">Filters:</span>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded-lg bg-gray-50 flex-1">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border p-2 rounded-lg bg-gray-50 flex-1">
            <option value="default">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group border border-gray-100">
            <div className="h-48 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="p-4">
              <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{product.category}</span>
              <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                {/* ... inside the map loop in app/page.js ... */}

                <div className="flex gap-2 mt-4">
                  {/* VIEW DETAILS BUTTON */}
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    View
                  </Link>

                  {/* ADD TO CART BUTTON */}
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 active:scale-95 transition"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* ... end of map loop ... */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}