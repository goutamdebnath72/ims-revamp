import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MOCK_USER_DB } from "@/lib/citusers";
import { getCurrentShift } from "@/lib/date-helpers";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "Ticket No", type: "text" },
        password: { label: "SAIL P/No", type: "password" },
      },
      authorize(credentials) {
        const user = MOCK_USER_DB[credentials.userId];
        
        // --- DEBUG POINT 1 ---
        console.log("[DEBUG] Authorize Step: User role from citusers.js is:", user?.role);

        if (user && user.password === credentials.password) {
          return {
            id: user.ticketNo,
            name: user.name,
            role: user.role,
            emailSail: user.emailSail,
            emailNic: user.emailNic,
            sailpno: user.sailpno,
            departmentCode: user.departmentCode,
            loginShift: getCurrentShift(),
            designation: user.designation,
            department: user.department,
            mobileNo: user.mobileNo,
          };
        }
        
        if (
          credentials.userId === "111111" &&
          credentials.password === "password"
        ) {
          return {
            id: "111111", name: "Standard User", role: "standard",
            emailSail: '', emailNic: '', sailpno: 'N/A', departmentCode: 0,
            loginShift: getCurrentShift(), designation: 'N/A', department: 'N/A', mobileNo: 'N/A',
          };
        }
        
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.emailSail = user.emailSail;
        token.emailNic = user.emailNic;
        token.sailpno = user.sailpno;
        token.departmentCode = user.departmentCode;
        token.loginShift = user.loginShift;
        token.designation = user.designation;
        token.department = user.department;
        token.mobileNo = user.mobileNo;
      }
      
      // --- DEBUG POINT 2 ---
      console.log("[DEBUG] JWT Step: Value of role being added to token is:", token?.role);
      
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.emailSail = token.emailSail;
      session.user.emailNic = token.emailNic;
      session.user.sailpno = token.sailpno;
      session.user.departmentCode = token.departmentCode;
      session.user.loginShift = token.loginShift;
      session.user.designation = token.designation;
      session.user.department = token.department;
      session.user.mobileNo = token.mobileNo;
      
      // --- DEBUG POINT 3 ---
      console.log("[DEBUG] Session Step: Value of role in final session.user is:", session?.user?.role);
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };