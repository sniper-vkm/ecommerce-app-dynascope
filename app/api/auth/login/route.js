import { getJSON } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET = 'dev-secret-key';

export async function POST(req) {
    const { email, password } = await req.json();
    const users = await getJSON('users.json');

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const safeRole = user.role.toLowerCase();

    const token = jwt.sign({ id: user.id, email: user.email, role: safeRole }, SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({
        success: true,
        token: token,
        user: {
            name: user.name,
            role: safeRole
        }
    });

    response.cookies.set('token', token, {
        httpOnly: false,
        path: '/',
        maxAge: 86400
    });

    return response;
}