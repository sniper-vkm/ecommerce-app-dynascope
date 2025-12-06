import { getJSON, saveJSON } from '@/lib/db';
import { NextResponse } from 'next/server';

const ADMIN_SECRET = "secret123";

export async function POST(req) {
    try {
        const { name, email, password, adminKey } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const users = await getJSON('users.json');

        if (users.find(u => u.email === email)) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        let role = 'user';
        if (adminKey) {
            if (adminKey === ADMIN_SECRET) {
                role = 'admin';
            } else {
                return NextResponse.json({ error: 'Invalid Admin Secret Key' }, { status: 403 });
            }
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role
        };

        users.push(newUser);
        await saveJSON('users.json', users);

        return NextResponse.json({ success: true, role });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}