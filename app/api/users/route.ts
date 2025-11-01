import { error } from 'console';
import {NextResponse} from 'next/server';
import  {prisma} from '@/app/lib/prisma';
import bcrypt from "bcryptjs";

// Get: Read all users
export async function GET() {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
}


// POST Create new user
export async function POST(req: Request) {
   try {
    const {name, email, password} = await req.json();

    // Validate input
    if (!name || !email || !password) {
        return NextResponse.json(
            {error: " Name, email, and password are required"},
            {status: 400}
        );
    }

    // CHeck if email already exist
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json(
            {error: "Email already exists"},
            { status: 409 }
        )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201});

   } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
        {error: "Something went wrong while creating user"},
        {status: 500}
    );
   }
}
