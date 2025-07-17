import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';




const SESSION_COOKIE_NAME = 'nizmweb.session-token';

export async function createSession(userId: string) {
    const sessionToken = uuidv4(); // generates a unique token
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // session valid for 30 days
  
    // Save session in the database
    await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
    });
  
    // Set cookie in the user's browser
    const cookieStore = cookies(); // ✅ this must be inside the function
    (await cookieStore).set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires,
    });
  }


  
export async function deleteSession() {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get(SESSION_COOKIE_NAME)?.value;
  
    if (sessionToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: {
          sessionToken: sessionToken
        }
      });
    }
  
    // Remove session cookie
    (await cookieStore).delete(SESSION_COOKIE_NAME);
  }