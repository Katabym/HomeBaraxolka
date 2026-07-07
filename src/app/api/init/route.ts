import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Инициализация базы данных с админом и тестовыми данными
export async function POST() {
  try {
    // Проверяем, существует ли админ
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.isAdmin, true))
      .limit(1);

    let admin;
    if (existingAdmin.length === 0) {
      // Создаем админа
      [admin] = await db
        .insert(users)
        .values({
          username: 'admin',
          email: 'admin@homebaraxolka.ru',
          password: 'admin123',
          isAdmin: true,
        })
        .returning();
    } else {
      admin = existingAdmin[0];
    }

    // Проверяем, есть ли уже товары
    const existingProducts = await db.select().from(products).limit(1);

    if (existingProducts.length === 0) {
      // Создаем тестовые товары
      await db.insert(products).values([
        {
          title: 'Куртка зимняя Nike',
          price: 3500,
          category: 'одежда',
          description: 'Тёплая зимняя куртка Nike в отличном состоянии. Размер M. Практически не носилась.',
          photos: ['https://via.placeholder.com/600x400/3498db/ffffff?text=Куртка+Nike'],
          linkVk: 'https://vk.com',
          linkTelegram: 'https://t.me',
          linkAvito: 'https://www.avito.ru',
        },
        {
          title: 'Смартфон Samsung Galaxy A52',
          price: 18000,
          category: 'техника',
          description: 'Телефон в хорошем состоянии, без царапин. Полный комплект. Батарея держит отлично.',
          photos: ['https://via.placeholder.com/600x400/e74c3c/ffffff?text=Samsung+A52'],
          linkVk: 'https://vk.com',
          linkTelegram: 'https://t.me',
          linkAvito: 'https://www.avito.ru',
        },
        {
          title: 'Настольная лампа IKEA',
          price: 800,
          category: 'предметы',
          description: 'Стильная настольная лампа от IKEA. Идеально подходит для работы и учёбы.',
          photos: ['https://via.placeholder.com/600x400/2ecc71/ffffff?text=Лампа+IKEA'],
          linkVk: 'https://vk.com',
          linkTelegram: 'https://t.me',
          linkAvito: 'https://www.avito.ru',
        },
        {
          title: 'Джинсы Levi\'s 501',
          price: 2200,
          category: 'одежда',
          description: 'Классические джинсы Levi\'s 501. Размер 32/34. В отличном состоянии.',
          photos: ['https://via.placeholder.com/600x400/9b59b6/ffffff?text=Levis+501'],
          linkVk: 'https://vk.com',
          linkTelegram: 'https://t.me',
          linkAvito: 'https://www.avito.ru',
        },
        {
          title: 'Наушники Sony WH-1000XM4',
          price: 15000,
          category: 'техника',
          description: 'Топовые наушники с шумоподавлением. Состояние идеальное, полный комплект.',
          photos: ['https://via.placeholder.com/600x400/f39c12/ffffff?text=Sony+WH-1000XM4'],
          linkVk: 'https://vk.com',
          linkTelegram: 'https://t.me',
          linkAvito: 'https://www.avito.ru',
        },
        {
          title: 'Ваза декоративная',
          price: 500,
          category: 'предметы',
          description: 'Красивая декоративная ваза. Отлично впишется в интерьер.',
          photos: ['https://via.placeholder.com/600x400/1abc9c/ffffff?text=Ваза'],
          linkVk: 'https://vk.com',
          linkTelegram: 'https://t.me',
          linkAvito: 'https://www.avito.ru',
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'База данных инициализирована',
      admin: {
        username: admin.username,
        email: admin.email,
        note: 'Пароль для входа: admin123',
      },
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Ошибка при инициализации базы данных' },
      { status: 500 }
    );
  }
}
