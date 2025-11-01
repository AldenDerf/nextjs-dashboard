import {NextResponse} from 'next/server';
import  {prisma} from '@/app/lib/prisma';

// Get: Read all users
export async function GET() {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
}


// POST Create new user
export async function POST(req: Request) {
    const data = await req.json();
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email:data.email,
        },
    })

    return NextResponse.json(user);
}
