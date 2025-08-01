import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma.js"; // Import the Prisma client
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { getCurrentShift } from "@/lib/date-helpers";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.userId || !credentials?.password) {
          return null;
        }

        // --- CHECK 1: Try to find in the Employees (User) table ---
        const dspEmployee = await prisma.user.findUnique({
          where: { ticketNo: credentials.userId },
          include: { department: true },
        });

        if (dspEmployee) {
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            dspEmployee.password
          );
          if (passwordMatch) {
            // If employee is found, return their data
            return {
              id: dspEmployee.ticketNo,
              name: dspEmployee.name,
              role: dspEmployee.role,
              emailSail: dspEmployee.emailId,
              emailNic: dspEmployee.emailIdNic,
              sailpno: dspEmployee.sailPNo,
              departmentCode: dspEmployee.department.code,
              loginShift: getCurrentShift(),
              designation: dspEmployee.designation,
              department: dspEmployee.department.name,
              mobileNo: dspEmployee.contactNo,
            };
          }
        }

        // --- CHECK 2: Check for the hardcoded Network Vendor ---
        if (
          credentials.userId === "network.vendor" &&
          credentials.password === process.env.NETWORK_VENDOR_PASSWORD
        ) {
          return {
            id: "network.vendor",
            name: "Network Vendor",
            role: "network_vendor",
            department: "Vendor",
          };
        }

        // --- CHECK 3: Check for the hardcoded Biometric Vendor ---
        if (
          credentials.userId === "biometric.vendor" &&
          credentials.password === process.env.BIOMETRIC_VENDOR_PASSWORD
        ) {
          return {
            id: "biometric.vendor",
            name: "Biometric Vendor",
            role: "biometric_vendor",
            department: "Vendor",
          };
        }

        // If no user is found
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // These callbacks remain the same, they correctly transfer data to the session
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
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
