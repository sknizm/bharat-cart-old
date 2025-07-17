import { createSession } from "@/lib/queries/session";
import { checkUserIfAlreadyExist, getUserByEmail } from "@/lib/queries/user";
import { comparePasswords } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const userExists = await checkUserIfAlreadyExist(email);
    if (!userExists) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    // Get user from DB
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Incorrect Password" }, { status: 401 });
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({ message: "Login successful", userId: user.id }, { status: 200 });
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
