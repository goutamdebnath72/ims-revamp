import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma.js";
import bcrypt from "bcrypt";
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
            return {
              id: dspEmployee.id,
              name: dspEmployee.name,
              ticketNo: dspEmployee.ticketNo,
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
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.ticketNo = user.ticketNo;
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
      session.user.ticketNo = token.ticketNo;
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
  pages: { signIn: "/login" },
};
