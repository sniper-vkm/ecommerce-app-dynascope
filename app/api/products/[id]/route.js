import { getJSON, saveJSON } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    // FIX: Await params before using them (Next.js 15 Requirement)
    const { id } = await params;

    const products = await getJSON('products.json');

    // Ensure we compare strings to strings
    const product = products.find(p => String(p.id) === String(id));

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PUT(req, { params }) {
    const { id } = await params; // FIX: Await params here too
    const body = await req.json();
    const products = await getJSON('products.json');

    const index = products.findIndex(p => String(p.id) === String(id));

    if (index > -1) {
        products[index] = { ...products[index], ...body };
        await saveJSON('products.json', products);
        return NextResponse.json(products[index]);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    let products = await getJSON('products.json');

    products = products.filter(p => String(p.id) !== String(id));

    await saveJSON('products.json', products);
    return NextResponse.json({ success: true });
}