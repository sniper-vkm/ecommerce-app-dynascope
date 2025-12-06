"use client";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Sports"];

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", price: "", category: "", image: "", description: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => { fetch('/api/products').then(res => res.json()).then(setProducts); }, []);

    const validate = () => {
        const err = {};
        if (form.name.length < 3) err.name = "Name too short";
        if (Number(form.price) <= 0) err.price = "Price must be positive";
        if (!form.category) err.category = "Select a category";
        if (!form.image.startsWith('http')) err.image = "Must be a valid URL";
        if (form.description.length < 10) err.description = "Description too short";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const method = editing ? 'PUT' : 'POST';
        const url = editing ? `/api/products/${editing.id}` : '/api/products';

        await fetch(url, { method, body: JSON.stringify(form) });
        window.location.reload();
    };

    const openModal = (p = null) => {
        setEditing(p);
        setForm(p || { name: "", price: "", category: "", image: "", description: "" });
        setErrors({});
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"><Plus size={18} /> Add Product</button>
            </div>

            {/* Product List Table (omitted for brevity, assume same as before) */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b"><tr><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b">
                                <td className="p-4">{p.name} <span className="text-xs bg-gray-200 px-2 py-1 rounded ml-2">{p.category}</span></td>
                                <td className="p-4">${p.price}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => openModal(p)} className="text-blue-600 mr-4"><Edit size={18} /></button>
                                    <button onClick={async () => { if (confirm("Delete?")) { await fetch(`/api/products/${p.id}`, { method: 'DELETE' }); window.location.reload(); } }} className="text-red-500"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{editing ? 'Edit' : 'New'} Product</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <input placeholder="Product Name" className={`w-full border p-2 rounded ${errors.name && 'border-red-500'}`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input type="number" placeholder="Price" className={`w-full border p-2 rounded ${errors.price && 'border-red-500'}`} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                    {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                                </div>
                                <div>
                                    <select className={`w-full border p-2 rounded ${errors.category && 'border-red-500'}`} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                                </div>
                            </div>

                            <div>
                                <input placeholder="Image URL (http...)" className={`w-full border p-2 rounded ${errors.image && 'border-red-500'}`} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                                {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                            </div>

                            <div>
                                <textarea placeholder="Description" className={`w-full border p-2 rounded ${errors.description && 'border-red-500'}`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}