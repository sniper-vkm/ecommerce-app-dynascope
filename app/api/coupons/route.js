import { getJSON, saveJSON } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(await getJSON('coupons.json'));
}

export async function POST(req) {
    const body = await req.json();
    const products = await getJSON('coupons.json');
    const newProduct = { ...body, id: Date.now().toString() };
    products.push(newProduct);
    await saveJSON('coupons.json', products);
    return NextResponse.json(newProduct);
}