"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserSignup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validate = () => {
        const newErrors = {};
        if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address";
        if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(form)
        });
        const data = await res.json();

        if (res.ok) {
            router.push('/login?registered=true');
        } else {
            setErrors({ api: data.error });
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border">
                <h1 className="text-2xl font-bold mb-6 text-center">User Registration</h1>

                {errors.api && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">{errors.api}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500">Full Name</label>
                        <input
                            className={`w-full border p-3 rounded-lg outline-none ${errors.name ? 'border-red-500' : 'focus:ring-2 focus:ring-indigo-500'}`}
                            value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500">Email</label>
                        <input
                            className={`w-full border p-3 rounded-lg outline-none ${errors.email ? 'border-red-500' : 'focus:ring-2 focus:ring-indigo-500'}`}
                            value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500">Password</label>
                        <input
                            type="password"
                            className={`w-full border p-3 rounded-lg outline-none ${errors.password ? 'border-red-500' : 'focus:ring-2 focus:ring-indigo-500'}`}
                            value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }) }}
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center">
                        {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">Need an Admin account? <Link href="/admin/signup" className="text-indigo-600 font-bold">Click here</Link></p>
            </div>
        </div>
    );
}