import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import unicornPlugin from "eslint-plugin-unicorn";
import importPlugin from "eslint-plugin-import";
import importAliasPlugin from "@limegrass/eslint-plugin-import-alias";
import boundariesPlugin from "eslint-plugin-boundaries";
import globals from "globals";

export default [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
      "gulpfile.js",
      "src/manifest.chrome.ts",
      "src/manifest.firefox.ts",
      "src/manifest.base.ts",
    ],
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        {
          type: "shared",
          mode: "full",
          pattern: [
            "src/*.ts",
            "src/components/**/*",
            "src/assets/**/*",
            "src/hooks/**/*",
            "src/services/**/*",
            "src/types/**/*",
            "src/utils/**/*",
            "src/data/**/*",
          ],
        },
        {
          type: "entrypoint",
          mode: "full",
          pattern: ["src/entrypoints/**/*"],
        },
        {
          type: "plugin-core",
          mode: "full",
          pattern: ["src/plugins/_api/**/*", "src/plugins/_core/**/*"],
        },
        {
          type: "plugin",
          mode: "full",
          capture: ["pluginName"],
          pattern: ["src/plugins/*/**/*"],
        },
      ],
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
      unicorn: unicornPlugin,
      import: importPlugin,
      "@limegrass/import-alias": importAliasPlugin,
      boundaries: boundariesPlugin,
    },
    rules: {
      // React rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
          noSortAlphabetically: true,
        },
      ],
      "react/jsx-no-useless-fragment": [
        "warn",
        {
          allowExpressions: true,
        },
      ],

      // Import rules
      "import/no-unresolved": "error",
      "import/no-cycle": "error",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "unknown",
          ],
          pathGroups: [
            {
              pattern: "**/*?script&module",
              group: "unknown",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["script-module"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "@limegrass/import-alias/import-alias": "off",

      // Boundaries rules
      "boundaries/no-unknown": ["error"],
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "shared",
              allow: ["shared", "plugin-core"],
            },
            {
              from: "entrypoint",
              allow: ["entrypoint", "shared", "plugin-core", "plugin"],
            },
            {
              from: "plugin-core",
              allow: ["shared", "plugin-core", "plugin"],
            },
            {
              from: "plugin",
              allow: [
                "shared",
                "plugin-core",
                "plugin",
                ["plugin", { pluginName: "${from.pluginName}" }],
              ],
            },
          ],
        },
      ],

      // Other rules
      "prefer-rest-params": "off",
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            pascalCase: true,
            kebabCase: true,
            camelCase: true,
          },
          ignore: ["\\.d\\.ts$"],
        },
      ],
    },
  },
  // TypeScript specific configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@limegrass/import-alias": importAliasPlugin,
    },
    rules: {
      "@typescript-eslint/no-restricted-types": [
        "error",
        {
          types: {
            "{}": {
              message:
                "Use a more specific type instead of empty object type {}",
              fixWith: "Record<string, unknown>",
            },
          },
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/strict-boolean-expressions": [
        "warn",
        {
          allowNumber: true,
          allowNullableString: true,
          allowNullableNumber: false,
          allowNullableBoolean: true,
        },
      ],
      "@limegrass/import-alias/import-alias": ["warn"],
    },
  },
];
