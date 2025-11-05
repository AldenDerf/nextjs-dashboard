import NextAuth from "next-auth";
import type {NextAuthConfig} from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// This is your main authentication configuration
export const authOptions: NextAuthConfig = {
    // ---------
    // LOGIN PROVIDERS
    // ---------

    providers: [
        CredentialsProvider({
            name: "Credentials", // name shown on login form

            // Define what fields the user will enter
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@example.com"},
                password: { label: "Password", type:"password"}
            },

            // The authorize() function runs when a user logs in
            async authorize(credentials) {
                // IMPORTANT: The 'credentials' object is now typed using
                // Zod or simply requires a check to ensure fields are strings/defined
                if(typeof !credentials?.email || typeof !credentials.password) {
                    return null; // Return null instead of throwing an error for CredentialsProvider in V5
                }

                const email: any = credentials.email;
                const password: any = credentials.password;

                // Find user by email in your database
                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user) return null; // Return null if no user is found

                // Compare password entered with hased password in DB
                // NOTE: Check if user.password exists before comparing
                if (!user) return null; // Return null if no user is found

                const isPasswordValid = await bcrypt.compare(password, user.password)

                if (!isPasswordValid) return null; // Return null for invalid password

                // Return a simplified user object. The shape of this object
                // is what gets stored in the session/JWT.  
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,

                }
            }
        }),
    ],


    // --------
    // SESSIONS STRATEGY
    // --------
    session: {
        strategy: 'database', // store session in DB, not just cookies
    },


    // -------------
    // DATABASE ADAPTER (CUSTOM)
    // -------------

    adapter: {
        // Create a new session record
        async createSession(data:any) {
            return prisma.session.create({data})
        },

        // Get both session and user info
        async getSessionAndUser(sessionToken: any) {
            const session = await prisma.session.findUnique({
                where: { sessionToken},
                include: { user: true},
            })

            if (!session) return null
            const { user, ...sess} = session
            return { session: sess, user}
        },

        // Update session (example: refresh expiry date)
        async updateSession(data: any) {
            return prisma.session.update({
                where: { sessionToken: data.sessionToken},
                data
            })
        },

        // Delete session when user logs out
        async deleteSession(sessionToken: any) {
            await prisma.session.delete({ where: { sessionToken}})
        },
    },

    // -----------------
    // SECRET key
    // -----------------

    secret: process.env.NEXTAUTH_SECRET, // used to sign and encrypt tokens

    
}
// Pass authOptions into NextAuth()
    const handler = NextAuth(authOptions)
    export {handler as GET, handler as POST}