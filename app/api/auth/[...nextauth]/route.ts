// Import NextAuth and required tools
import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Create Prisma instance to talk to the database
const prisma = new PrismaClient();

// Main NextAuth configuration
const handler = NextAuth({
    // Define which login methods your app supports
    providers: [
        CredentialProvider({
            // This provider lets users log in with email + password
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password"}
            },

            //This functon runs whenver someone tries to log in
            async authorize(credentials) {
                //  Check of email and password are provided
                if (!credentials?.email || !credentials.password){
                    throw new Error("Please enter email and password")
                }

                // 1. Find user in the database by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email},
                })

                // 2. If user not found, stop here
                if (!user) throw new Error("No user found with that email");

                // 3. Compare entered password with stored hashed password
                const isPasswordValid =  await bcrypt.compare(credentials.password, user.password)
                
                // 4. If wrong password, stop
                if (!isPasswordValid) {
                    throw new Error("Invalid password")
                }

                // 5 If everything's correct, return user info
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email
                }
            }
        })
    ],

    // Session Setting
    session: {
        strategy: 'database', // Store session in our MySQL DB
    },

    // Database operations for session handling
    adapter: {

        // Create new session record
        async createSession(data) {
            return prisma.session.create({data})
        },

        // Get session + user info from DB
        async getSessionAndUser(sessionToken) {
            const session = await prisma.session.findUnique({
                where: {sessionToken},
                include: { user: true} // include linked user info
            })

            if (!session) return null
            const {user, ...sess} = session
            return {session: sess, user}
        },

        // Update existing session
        async updateSession(data) {
            return prisma.session.update({
                where: { sessionToken: data.sessionToken},
                data,
            })
        },

        // Delete session on logout
        async deleteSession(sessionToken) {
            await prisma.session.delete({ where: { sessionToken}})
        }

    },

    // Secret key used to sign and encrypt tokens
    secret: process.env.NEXTAUTH_SECRETE, // Keep this safe
});

// Export both Get and POST

export {handler as GET, handler as POST}