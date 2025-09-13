import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma.js";
import bcrypt from "bcryptjs";
import { getCurrentShift } from "@/lib/date-helpers";
import { USER_ROLES } from "@/lib/constants";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Standardizing on 'ticketNo' for clarity
      credentials: {
        ticketNo: { label: "Ticket No.", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        console.log("\n--- [AUTH DEBUG] Authorize Function Started ---");

        if (!credentials?.ticketNo || !credentials?.password) {
          console.log(
            "[AUTH DEBUG] ERROR: Credentials object is missing ticketNo or password."
          );
          return null;
        }

        const { ticketNo, password } = credentials;
        console.log(
          `[AUTH DEBUG] 1. Received credentials for ticketNo: '${ticketNo}'`
        );

        // Check for hardcoded users first (this logic remains)
        if (
          ticketNo === "network.vendor" ||
          ticketNo === "telecom" ||
          ticketNo === "etl" ||
          ticketNo === "biometric.vendor"
        ) {
          console.log(
            `[AUTH DEBUG] 2. Matched a hardcoded user type. Checking password...`
          );
          // Add your full hardcoded user logic here as it was before...
          if (
            ticketNo === "network.vendor" &&
            password === process.env.NETWORK_VENDOR_PASSWORD
          )
            return {
              id: "network.vendor",
              name: "Network Vendor",
              role: "network_vendor",
            };
          if (
            ticketNo === "telecom" &&
            password === process.env.TELECOM_PASSWORD
          )
            return {
              id: "telecom",
              name: "Telecom User",
              role: "telecom_user",
            };
          if (ticketNo === "etl" && password === process.env.ETL_PASSWORD)
            return { id: "etl", name: "ETL User", role: "etl" };
          if (
            ticketNo === "biometric.vendor" &&
            password === process.env.BIOMETRIC_VENDOR_PASSWORD
          )
            return {
              id: "biometric.vendor",
              name: "Biometric Vendor",
              role: "biometric_vendor",
            };
        }

        console.log(
          `[AUTH DEBUG] 2. Not a hardcoded user. Proceeding to database lookup...`
        );

        try {
          const dspEmployee = await prisma.user.findUnique({
            where: { ticketNo: ticketNo },
            include: { department: true },
          });

          if (!dspEmployee) {
            console.log(`[AUTH DEBUG] 3. RESULT: User NOT found in database.`);
            return null;
          }

          console.log(
            `[AUTH DEBUG] 3. RESULT: User '${dspEmployee.name}' found in database.`
          );
          console.log(
            `[AUTH DEBUG]    - Hashed password from DB starts with: ${dspEmployee.password.substring(
              0,
              10
            )}...`
          );

          console.log(
            "[AUTH DEBUG] 4. Comparing provided password with stored hash..."
          );
          const passwordMatch = await bcrypt.compare(
            password,
            dspEmployee.password
          );

          console.log(
            `[AUTH DEBUG] 5. RESULT: bcrypt.compare returned: ${passwordMatch}`
          );

          if (passwordMatch) {
            console.log(
              "[AUTH DEBUG] 6. SUCCESS: Password is valid. Returning user object."
            );
            return {
              id: dspEmployee.id,
              name: dspEmployee.name,
              ticketNo: dspEmployee.ticketNo,
              role: dspEmployee.role,
              emailSail: dspEmployee.emailId,
              emailNic: dspEmployee.emailIdNic,
              sailPNo: dspEmployee.sailPNo,
              departmentCode: dspEmployee.department.code,
              loginShift: getCurrentShift(),
              designation: dspEmployee.designation,
              department: dspEmployee.department.name,
              mobileNo: dspEmployee.contactNo,
            };
          } else {
            console.log("[AUTH DEBUG] 6. FAILURE: Password is NOT valid.");
            return null;
          }
        } catch (error) {
          console.error(
            "[AUTH DEBUG] FATAL ERROR during database lookup:",
            error
          );
          return null;
        }
      },
    }),
  ],
  // ... rest of your authOptions
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
