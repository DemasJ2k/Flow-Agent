// Settings API - User settings management

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';

// GET - Fetch user settings
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create settings
    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.userSettings.create({
        data: { userId: session.user.id },
      });
    }

    // Also get user profile data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({
      settings,
      profile: user,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate and sanitize input
    const allowedFields = [
      'preferredProvider',
      'anthropicModel',
      'openaiModel',
      'theme',
      'timezone',
      'defaultMarket',
      'defaultTimeframe',
      'riskPerTrade',
      'emailNotifications',
    ];

    const updateData: Record<string, string | number | boolean> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Validate specific fields
    if (updateData.preferredProvider && !['anthropic', 'openai'].includes(updateData.preferredProvider as string)) {
      return NextResponse.json(
        { error: 'Invalid AI provider' },
        { status: 400 }
      );
    }

    if (updateData.theme && !['light', 'dark', 'system'].includes(updateData.theme as string)) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      );
    }

    if (updateData.riskPerTrade !== undefined) {
      const risk = Number(updateData.riskPerTrade);
      if (isNaN(risk) || risk < 0.1 || risk > 10) {
        return NextResponse.json(
          { error: 'Risk per trade must be between 0.1% and 10%' },
          { status: 400 }
        );
      }
      updateData.riskPerTrade = risk;
    }

    // Upsert settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        ...updateData,
      },
    });

    return NextResponse.json({ settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
