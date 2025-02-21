// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals"),
    {
        parser: "@babel/eslint-parser", // Use Babel parser for JSX
        parserOptions: {
            ecmaVersion: 2020, // Use ECMAScript 2020 features
            sourceType: "module", // Allow ES Modules
            ecmaFeatures: {
                jsx: true, // Enable JSX
            },
        },
        plugins: ["react"], // Add React plugin
        rules: {
            "no-multiple-empty-lines": ["error", { max: 1 }],
            "no-trailing-spaces": "error",
            "operator-spacing": ["error", { before: false, after: false }],
            "react/jsx-uses-react": "off", // React 17+ doesn't need `import React`
            "react/react-in-jsx-scope": "off", // React 17+ doesn't need to be in scope
        },
    },
];

export default eslintConfig;
