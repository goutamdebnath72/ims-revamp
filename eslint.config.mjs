// @ts-nocheck
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Completely ignore Prisma's generated runtime (and any other generated code)
  { ignores: ["lib/generated/prisma/**"] },

  // Next.js defaults
  ...compat.extends("next/core-web-vitals"),

  // Your own rules (keep these as you like)
  {
    rules: {
      // leave this on globally if you want; the generated code is already ignored above
      "no-redeclare": "error",
    },
  },
];
