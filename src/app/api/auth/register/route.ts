import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, не существует ли пользователь
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким логином или почтой уже существует' },
        { status: 400 }
      );
    }

    // Создаем нового пользователя (в продакшене пароль должен быть хешированным)
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        password, // В реальном приложении: await bcrypt.hash(password, 10)
        isAdmin: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}
