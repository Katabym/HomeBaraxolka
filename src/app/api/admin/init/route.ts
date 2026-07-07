import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Создание админа при первом запуске
export async function POST(request: NextRequest) {
  try {
    // Проверяем, существует ли админ
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.isAdmin, true))
      .limit(1);

    if (existingAdmin.length > 0) {
      return NextResponse.json({
        message: 'Администратор уже существует',
        admin: {
          username: existingAdmin[0].username,
          email: existingAdmin[0].email,
        },
      });
    }

    // Создаем дефолтного админа
    const [admin] = await db
      .insert(users)
      .values({
        username: 'admin',
        email: 'admin@homebaraxolka.ru',
        password: 'admin123', // В реальном приложении используйте хеш
        isAdmin: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Администратор создан',
      admin: {
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании администратора' },
      { status: 500 }
    );
  }
}
