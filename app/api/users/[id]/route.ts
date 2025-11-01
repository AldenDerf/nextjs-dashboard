import { ParamsOf } from './../../../../.next/dev/types/routes.d';
import { NextResponse} from 'next/server';
import {prisma} from '@/app/lib/prisma';
import { error } from 'console';

// GET /api/users/:id - Read single user
export async function GET(
    req: Request,
    context:  { params: Promise<{ id: string}>} // params is now a {Promise}
) {
    const { id } = await context.params // unwrap the Promise

    const userId = Number(id);

    if (isNaN(userId)) {
        return NextResponse.json({error: 'Invalid ID'}, { status: 400})
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    return NextResponse.json(user);
};


// PUT /api/users/:id - Update user
export async function PUT(
    req: Request,
    context: {params: Promise<{id: string}>}
) {
    const {id} = await context.params;

    const userId = Number(id);

    if (isNaN(userId)) {
        return NextResponse.json({error: 'Invalid ID'}, {status: 400})
    }

    const data = await req.json()


    try {
        const updated = await prisma.user.update({
            where: {id: userId},
            data: {
                name: data.name,
                email: data.email,
            }
        })
        return NextResponse.json(updated)
    } catch (error: any) {
        return NextResponse.json(
            {error: 'Failed to update user'},
            {status: 500}
        )
    }
}



// DELETE /api/users/:id - Delete user
export async function DELETE(
    req: Request,
    context : { params: Promise<{ id: string}> }
){
    const { id } = await context.params
    const userId = Number(id)

    if (isNaN(userId)){
        return NextResponse.json({error: 'Invalid ID'}, {status: 400})
    }

    try {
        await prisma.user.delete({ where: {id: userId }})
        return NextResponse.json({ message: 'User deleted successfully'})
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete user'},
            {status: 500}
        )
    }
   
}