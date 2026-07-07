import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { viewHistory, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// POST - добавление просмотра
export async function POST(request: NextRequest) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId и productId обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, не был ли этот товар уже просмотрен
    const existing = await db
      .select()
      .from(viewHistory)
      .where(
        and(
          eq(viewHistory.userId, userId),
          eq(viewHistory.productId, productId)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(viewHistory).values({
        userId,
        productId,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding view history:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении просмотра' },
      { status: 500 }
    );
  }
}

// GET - получение просмотренных товаров пользователя
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId обязателен' },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        id: products.id,
        title: products.title,
        price: products.price,
        category: products.category,
        description: products.description,
        photos: products.photos,
        linkVk: products.linkVk,
        linkTelegram: products.linkTelegram,
        linkAvito: products.linkAvito,
        linkKopeyka: products.linkKopeyka,
        viewedAt: viewHistory.viewedAt,
      })
      .from(viewHistory)
      .innerJoin(products, eq(viewHistory.productId, products.id))
      .where(eq(viewHistory.userId, parseInt(userId)))
      .orderBy(viewHistory.viewedAt);

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error('Error fetching view history:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке истории просмотров' },
      { status: 500 }
    );
  }
}
