import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

// GET - получение всех продуктов с фильтрами
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    let query = db.select().from(products);

    const conditions = [];

    if (category && category !== 'all') {
      conditions.push(eq(products.category, category));
    }

    if (minPrice) {
      conditions.push(gte(products.price, parseFloat(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, parseFloat(maxPrice)));
    }

    if (search) {
      conditions.push(
        sql`${products.title} ILIKE ${`%${search}%`}`
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(products.createdAt);

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке товаров' },
      { status: 500 }
    );
  }
}

// POST - создание нового продукта (только для админа)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      title,
      price,
      category,
      description,
      photos,
      linkVk,
      linkTelegram,
      linkAvito,
      linkKopeyka,
    } = data;

    if (!title || !price || !category || !description) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        title,
        price: parseFloat(price),
        category,
        description,
        photos: photos || [],
        linkVk,
        linkTelegram,
        linkAvito,
        linkKopeyka,
      })
      .returning();

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании товара' },
      { status: 500 }
    );
  }
}
