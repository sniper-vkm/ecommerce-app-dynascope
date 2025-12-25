"use client";
export const dynamic = "force-dynamic";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('registered')) setError("Account created! Please login.");
        if (searchParams.get('admin')) setError("Admin account created! Please login.");
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) return setError("Please fill all fields");

        setLoading(true);
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(form)
        });
        const data = await res.json();
        setLoading(false);

        if (res.ok) login(data.token, { ...data.user, email: form.email });
        else setError(data.error);
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {error && <div className={`p-3 rounded mb-4 text-sm text-center ${error.includes('created') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input type="password" placeholder="Password" className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center">
                        {loading ? <Loader2 className="animate-spin" /> : "Login"}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">Don't have an account? <Link href="/signup" className="text-indigo-600 font-bold">Sign up</Link></div>
            </div>
        </div>
    );
}
