import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData } from '@/types';

const defaultSession: SessionData = {
  userId: 0,
  username: '',
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'blog_admin_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.userId = defaultSession.userId;
    session.username = defaultSession.username;
  }

  return session;
}

export async function setSession(
  session: IronSession<SessionData>,
  data: { userId: number; username: string }
): Promise<void> {
  session.isLoggedIn = true;
  session.userId = data.userId;
  session.username = data.username;
  await session.save();
}

export async function destroySession(
  session: IronSession<SessionData>
): Promise<void> {
  session.destroy();
}
