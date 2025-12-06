import { getJSON, saveJSON } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const users = await getJSON('users.json');

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Create new user (ALWAYS force role to 'user')
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In a real app, you should hash this password (e.g., bcrypt)
            role: 'user'
        };

        users.push(newUser);
        await saveJSON('users.json', users);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}