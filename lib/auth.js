import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma.js";
import bcrypt from "bcryptjs";
import { getCurrentShift } from "@/lib/date-helpers";
import { USER_ROLES } from "@/lib/constants";

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

        const { userId, password } = credentials;

// --- START: Hardcoded Department/Vendor Checks ---
    if (
      userId === "network.vendor" &&
      password === process.env.NETWORK_VENDOR_PASSWORD
    ) {
      return {
        id: "network.vendor",
        name: "Network Vendor",
        role: USER_ROLES.NETWORK_VENDOR,
        department: "Vendor",
      };
    } else if (
      userId === "telecom" &&
      password === process.env.TELECOM_PASSWORD
    ) {
      return {
        id: "telecom",
        name: "Telecom User",
        role: USER_ROLES.TELECOM_USER,
        department: "Telecom",
      };
    } else if (userId === "etl" && password === process.env.ETL_PASSWORD) {
      return {
        id: "etl",
        name: "ETL User",
        role: USER_ROLES.ETL,
        department: "ETL",
      };
    } else if (
      userId === "biometric.vendor" &&
      password === process.env.BIOMETRIC_VENDOR_PASSWORD
    ) {
      return {
        id: "biometric.vendor",
        name: "Biometric Vendor",
        role: USER_ROLES.BIOMETRIC_VENDOR,
        department: "Vendor",
      };
    }
    // --- END: Hardcoded Department/Vendor Checks ---

        // --- START: Database User Check (for all other users) ---
        const dspEmployee = await prisma.user.findUnique({
          where: { ticketNo: userId },
          include: { department: true },
        });
        if (dspEmployee) {
          const passwordMatch = await bcrypt.compare(
            password,
            dspEmployee.password
          );
          if (passwordMatch) {
            return {
              id: dspEmployee.id,
              name: dspEmployee.name,
              ticketNo: dspEmployee.ticketNo,
              role: dspEmployee.role, // This already uses the role from the DB, which is good
              emailSail: dspEmployee.emailId,
              emailNic: dspEmployee.emailIdNic,
              sailPNo: dspEmployee.sailPNo,
              departmentCode: dspEmployee.department.code,
              loginShift: getCurrentShift(),
              designation: dspEmployee.designation,
              department: dspEmployee.department.name,
              mobileNo: dspEmployee.contactNo,
            };
          }
        }
        // --- END: Database User Check ---

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
        token.sailPNo = user.sailPNo;
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
      session.user.sailPNo = token.sailPNo;
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
