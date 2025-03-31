import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl}}){
        const isLoggedIn = !!auth?.user;
        const isOnDashBoard = nextUrl.pathname.startsWith('/dashboard');
        if (isOnDashBoard) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
            return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
    }
  },
  providers: [] // Add providers with an empty arry for now
} satisfies NextAuthConfig;
