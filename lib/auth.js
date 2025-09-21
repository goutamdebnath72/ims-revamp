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

        if (!credentials?.ticketNo || !credentials?.password) {
          
          return null;
        }

        const { ticketNo, password } = credentials;
        

        // Check for hardcoded users first (this logic remains)
        if (
          ticketNo === "network.amc" ||
          ticketNo === "telecom" ||
          ticketNo === "etl" ||
          ticketNo === "biometric.amc"
        ) {
          
          // Add your full hardcoded user logic here as it was before...
          if (
            ticketNo === "network.amc" &&
            password === process.env.NETWORK_AMC_PASSWORD
          )
            return {
              id: "network.amc",
              name: "Network AMC",
              role: "network_amc",
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
            ticketNo === "biometric.amc" &&
            password === process.env.BIOMETRIC_AMC_PASSWORD
          )
            return {
              id: "biometric.amc",
              name: "Biometric AMC",
              role: "biometric_amc",
            };
        }

        

        try {
          const dspEmployee = await prisma.user.findUnique({
            where: { ticketNo: ticketNo },
            include: { department: true },
          });

          if (!dspEmployee) {
            return null;
          }

          

          
          const passwordMatch = await bcrypt.compare(
            password,
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
              sailPNo: dspEmployee.sailPNo,
              departmentCode: dspEmployee.department.code,
              loginShift: getCurrentShift(),
              designation: dspEmployee.designation,
              department: dspEmployee.department.name,
              mobileNo: dspEmployee.contactNo,
            };
          } else {
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
