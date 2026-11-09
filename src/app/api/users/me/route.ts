import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  const { data: session, error } = await auth.getSession();

  if (error || !session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, email } = session.user;
  if (!id || !email) {
    return NextResponse.json({ error: 'Malformed session' }, { status: 401 });
  }

  // Mirror the Neon Auth user into the app's users table (id matches auth id)
  await db
    .insert(users)
    .values({
      id,
      email,
      fullName: name || email.split('@')[0],
    })
    .onConflictDoUpdate({
      target: users.id,
      set: { fullName: name || email.split('@')[0] },
    });

  return NextResponse.json({ user: { id, name, email } });
}
