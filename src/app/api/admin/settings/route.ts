import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminSettings } from '@/db/schema';

// GET - получение настроек
export async function GET() {
  try {
    const [settings] = await db.select().from(adminSettings).limit(1);

    return NextResponse.json({
      settings: settings || { defaultVk: '', defaultTelegram: '' },
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке настроек' },
      { status: 500 }
    );
  }
}

// POST - обновление настроек
export async function POST(request: NextRequest) {
  try {
    const { defaultVk, defaultTelegram } = await request.json();

    const existing = await db.select().from(adminSettings).limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(adminSettings)
        .set({
          defaultVk,
          defaultTelegram,
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json({ success: true, settings: updated });
    } else {
      const [created] = await db
        .insert(adminSettings)
        .values({
          defaultVk,
          defaultTelegram,
        })
        .returning();

      return NextResponse.json({ success: true, settings: created });
    }
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении настроек' },
      { status: 500 }
    );
  }
}
