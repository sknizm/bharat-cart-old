import { checkUserIfAlreadyExist, createUser } from "@/lib/queries/user";
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
    if (userExists) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Create user
    await createUser(email, password, 'ADMIN');
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
