import { getJSON, saveJSON } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
    const { id } = await params; // FIX: Next.js 15 await
    let coupons = await getJSON('coupons.json');
    coupons = coupons.filter(c => String(c.id) !== String(id));
    await saveJSON('coupons.json', coupons);
    return NextResponse.json({ success: true });
}

export async function PUT(req, { params }) {
    const { id } = await params; // FIX: Next.js 15 await
    const body = await req.json();
    const coupons = await getJSON('coupons.json');
    const index = coupons.findIndex(c => String(c.id) === String(id));

    if (index > -1) {
        coupons[index] = { ...coupons[index], ...body };
        await saveJSON('coupons.json', coupons);
        return NextResponse.json(coupons[index]);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}