import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';
import { ApiResponse, Product } from '../../types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    const filters = {
      ...(category && { category }),
      ...(featured && { featured: featured === 'true' })
    };

    const products = await db.products.findMany(filters);

    return NextResponse.json({
      success: true,
      data: { products }
    } as ApiResponse<{ products: Product[] }>);

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}