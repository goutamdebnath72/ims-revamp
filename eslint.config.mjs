import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // This includes all the default Next.js rules
  ...compat.extends("next/core-web-vitals"),
  
  // Add your new object with custom rules here
  {
    rules: {
      'no-redeclare': 'error',
    },
  },
];