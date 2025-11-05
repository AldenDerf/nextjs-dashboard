import getServerSession from "next-auth";
import {redirect} from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
export default async function Page() {

  // Get current session info from NextAuth
  const session = await getServerSession(authOptions);

  // If user is not logged in, redirect to login page
  if (!session) redirect("/login");
  
  // If logged in, display welcom page
  return <p>Welcome, {session.user?.name}</p>;
}
