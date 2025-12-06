"use client";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState({ code: "", type: "percent", value: 0, minCart: 0, expiry: "", validCategory: "All" });
    const [errors, setErrors] = useState({});

    useEffect(() => { fetch('/api/coupons').then(res => res.json()).then(setCoupons); }, []);

    const validate = () => {
        const err = {};
        if (form.code.length < 3) err.code = "Code too short";
        if (form.value <= 0) err.value = "Value must be positive";
        if (form.type === 'percent' && form.value > 100) err.value = "Percent cannot exceed 100";
        if (new Date(form.expiry) < new Date()) err.expiry = "Date must be in future";
        if (form.minCart < 0) err.minCart = "Cannot be negative";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await fetch('/api/coupons', { method: 'POST', body: JSON.stringify(form) });
        window.location.reload();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Coupons</h1>
            <div className="bg-white p-6 rounded-xl border mb-8">
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-start">

                    <div className="lg:col-span-2">
                        <input placeholder="Code (e.g. SAVE10)" className={`w-full border p-2 rounded ${errors.code ? 'border-red-500' : ''}`} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                        {errors.code && <p className="text-red-500 text-xs">{errors.code}</p>}
                    </div>

                    <div>
                        <select className="w-full border p-2 rounded" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="percent">Percent (%)</option>
                            <option value="flat">Flat ($)</option>
                        </select>
                    </div>

                    <div>
                        <input type="number" placeholder="Val" className={`w-full border p-2 rounded ${errors.value ? 'border-red-500' : ''}`} value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} />
                        {errors.value && <p className="text-red-500 text-xs">{errors.value}</p>}
                    </div>

                    <div>
                        <input type="number" placeholder="Min Cart" className={`w-full border p-2 rounded ${errors.minCart ? 'border-red-500' : ''}`} value={form.minCart} onChange={e => setForm({ ...form, minCart: Number(e.target.value) })} />
                        {errors.minCart && <p className="text-red-500 text-xs">{errors.minCart}</p>}
                    </div>

                    <div>
                        <input type="date" className={`w-full border p-2 rounded ${errors.expiry ? 'border-red-500' : ''}`} value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
                        {errors.expiry && <p className="text-red-500 text-xs">Invalid Date</p>}
                    </div>

                    <button type="submit" className="bg-green-600 text-white p-2 rounded h-10 w-full flex justify-center items-center"><Plus /></button>
                </form>
            </div>

            {/* List Display */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {coupons.map(c => (
                    <div key={c.id} className="bg-white border p-4 rounded-xl flex justify-between">
                        <div>
                            <div className="font-bold text-indigo-600">{c.code}</div>
                            <div className="text-sm">{c.type === 'percent' ? `${c.value}%` : `$${c.value}`} OFF</div>
                            <div className="text-xs text-gray-400">Exp: {c.expiry}</div>
                        </div>
                        <button onClick={async () => { if (confirm("Delete?")) { await fetch(`/api/coupons/${c.id}`, { method: 'DELETE' }); window.location.reload(); } }} className="text-red-400"><Trash2 /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}