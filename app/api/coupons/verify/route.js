import { getJSON } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { code, cartTotal, cartItems } = await req.json();
    const coupons = await getJSON('coupons.json');

    const coupon = coupons.find(c => c.code === code);
    if (!coupon) return NextResponse.json({ error: 'Invalid Coupon Code' }, { status: 400 });

    if (new Date(coupon.expiry) < new Date()) {
        return NextResponse.json({ error: 'Coupon Expired' }, { status: 400 });
    }

    if (Number(cartTotal) < Number(coupon.minCart)) {
        return NextResponse.json({ error: `Minimum cart value of $${coupon.minCart} required` }, { status: 400 });
    }

    if (coupon.validCategory && coupon.validCategory !== 'All') {
        const hasCategoryItem = cartItems.some(item => item.category === coupon.validCategory);
        if (!hasCategoryItem) {
            return NextResponse.json({ error: `This coupon is only for ${coupon.validCategory} items` }, { status: 400 });
        }
    }

    return NextResponse.json({ success: true, coupon });
}