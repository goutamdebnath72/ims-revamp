import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MOCK_USER_DB } from "@/lib/citusers";
import { MOCK_VENDOR_DB } from "@/lib/network-vendors";
import { MOCK_BIOMETRIC_VENDOR_DB } from "@/lib/biometric-vendors";
import { getCurrentShift } from "@/lib/date-helpers";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        // --- CHECK 1: C&IT Employees ---
        const citUser = MOCK_USER_DB[credentials.userId];
        if (citUser && citUser.password === credentials.password) {
          return {
            id: citUser.ticketNo,
            name: citUser.name,
            role: citUser.role,
            emailSail: citUser.emailSail,
            emailNic: citUser.emailNic,
            sailpno: citUser.sailpno,
            departmentCode: citUser.departmentCode,
            loginShift: getCurrentShift(),
            designation: citUser.designation,
            department: citUser.department,
            mobileNo: citUser.mobileNo,
          };
        }

        // --- CHECK 2: Standard User ---
        if (
          credentials.userId === "111111" &&
          credentials.password === "password"
        ) {
          return {
            id: "111111",
            name: "Standard User",
            role: "standard",
            emailSail: "",
            emailNic: "",
            sailpno: "N/A",
            departmentCode: 0,
            loginShift: getCurrentShift(),
            designation: "N/A",
            department: "N/A",
            mobileNo: "N/A",
          };
        }

        // --- CHECK 3: Network Vendor ---
        const networkVendorUser = MOCK_VENDOR_DB[credentials.userId];
        if (
          networkVendorUser &&
          networkVendorUser.password === credentials.password
        ) {
          return {
            id: networkVendorUser.id,
            name: networkVendorUser.name,
            role: networkVendorUser.role,
            department: "Network Vendor",
          };
        }

        // --- 4. ADD NEW CHECK: Biometric Vendor ---
        const biometricVendorUser =
          MOCK_BIOMETRIC_VENDOR_DB[credentials.userId];
        if (
          biometricVendorUser &&
          biometricVendorUser.password === credentials.password
        ) {
          return {
            id: biometricVendorUser.id,
            name: biometricVendorUser.name,
            role: biometricVendorUser.role,
            department: "Biometric Vendor",
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        // Add other user properties to the token if they exist
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
      // Add other properties to the session if they exist
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
