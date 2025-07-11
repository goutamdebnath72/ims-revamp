import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MOCK_USER_DB } from "@/lib/citusers";
import { getCurrentShift } from "@/lib/date-helpers"; // Import the helper function

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "Ticket No", type: "text" },
        password: { label: "SAIL P/No", type: "password" },
      },
      authorize(credentials) {
        const user = MOCK_USER_DB[credentials.userId];

        if (user && user.password === credentials.password) {
          return {
            id: user.ticketNo,
            name: user.name,
            role: user.role,
            email: user.emailSail || user.emailNic || "",
            departmentCode: user.departmentCode,
            loginShift: getCurrentShift(), // Add the user's login shift
          };
        }

        if (
          credentials.userId === "111111" &&
          credentials.password === "password"
        ) {
          return {
            id: "111111",
            name: "Standard User",
            role: "standard",
            email: "",
            departmentCode: 0,
            loginShift: getCurrentShift(), // Add the user's login shift
          };
        }
        
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // We do not set maxAge here, as the logout is now handled by our custom logic
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.departmentCode = user.departmentCode;
        token.loginShift = user.loginShift; // Persist loginShift to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.departmentCode = token.departmentCode;
      session.user.loginShift = token.loginShift; // Make loginShift available in the session
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };