import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const notifications = contacts.map((c) => ({
      id: c.id,
      title: c.name,
      email: c.email,
      message: c.message,
      createdAt: c.createdAt,
      type: 'contact',
    }));

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: notifications.length,
    });
  } catch (error) {
    console.error('Failed to fetch admin notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
