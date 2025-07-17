"use server";

import { cookies } from "next/headers";
import prisma from "../prisma";
import { passwordHasher } from "../utils";
import { createSession } from "./session";
import { UserType } from "@prisma/client";

const SESSION_COOKIE_NAME = 'nizmweb.session-token';



export async function checkUserIfAlreadyExist(email: string): Promise<boolean> {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
  
    return !!existingUser;
  }

  export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
  
  export async function createUser(email:string, password:string, type:UserType){
      const hashedPassword = await passwordHasher(password);
  
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          userType:type
        },
      });
  
      await createSession(newUser.id);
      return newUser;
  }
  export async function getUserIdByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    return user.id;
  }

export async function getCurrentUserFromSession() {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get(SESSION_COOKIE_NAME)?.value;
  
    if (!sessionToken) return null;
  
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
  
    return session?.user || null;
  }

  export async function getUserIdFromSession(){
    try {
      const cookieStore = cookies();
      const sessionToken = (await cookieStore).get(SESSION_COOKIE_NAME)?.value;
  
      if (!sessionToken) return null;
  
      // Optimized query to only return the user ID
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        select: { user: { select: { id: true } } },
      });
  
      return session?.user?.id || null;
    } catch (error) {
      console.error("Failed to get user ID from session:", error);
      return null;
    }
  }
  
export async function getCurrentUser() {
    const sessionToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  
    if (!sessionToken) return null;
  
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
  
    return session?.user ?? null;
  }
  