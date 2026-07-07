import { pgTable, text, serial, timestamp, integer, boolean, real } from 'drizzle-orm/pg-core';

// Таблица пользователей
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // В реальном приложении хешируется
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Таблица карточек товаров
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  price: real('price').notNull(),
  category: text('category').notNull(), // одежда, техника, предметы
  description: text('description').notNull(),
  photos: text('photos').array().notNull().default([]), // Массив URL фото
  linkVk: text('link_vk'),
  linkTelegram: text('link_telegram'),
  linkAvito: text('link_avito'),
  linkKopeyka: text('link_kopeyka'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Таблица истории просмотров
export const viewHistory = pgTable('view_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').notNull().defaultNow(),
});

// Таблица настроек админа (для хранения дефолтных ссылок)
export const adminSettings = pgTable('admin_settings', {
  id: serial('id').primaryKey(),
  defaultVk: text('default_vk'),
  defaultTelegram: text('default_telegram'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
