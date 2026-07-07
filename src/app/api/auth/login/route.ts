import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json();

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин/почта и пароль обязательны' },
        { status: 400 }
      );
    }

    // Ищем пользователя по логину или email
    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, login), eq(users.email, login)))
      .limit(1);

    if (!user || user.password !== password) {
      // В реальном приложении: await bcrypt.compare(password, user.password)
      return NextResponse.json(
        { error: 'Неверный логин/почта или пароль' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка при входе' },
      { status: 500 }
    );
  }
}
