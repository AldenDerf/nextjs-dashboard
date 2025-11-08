'use server'

import { SignupFormSchema, FormState } from "../lib/definitions";
import bcrypt from "bcryptjs";

export async function signup(formData: FormData){
    //1.  Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })
    
    //  any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // 2. Prepare data for insertion into database
    const { name, email, password} = validatedFields.data;

    // e.g. Hash the user's password before stroing it
    const hashedPassword = bcrypt.hash(password, 10);

    // 3. Insert the user into the database or call an Auth Library's API
    const data = await db
    .insert(users)
    .values({
        name,
        email,
        password: hashedPassword,
    })
    .returning({ id: users.id});

    const user = data[0]

    if (!user) {
        return {
            message: 'An error occurred while creating your account'
        }
    }

    // TODO:
    // 4. Create user session
    // Redirect user
 
}