import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import astroParser from "astro-eslint-parser";
import astro from "eslint-plugin-astro";

const stylisticRules = {
	"@stylistic/indent": ["error", "tab"],
	"@stylistic/eol-last": ["error", "always"],
	"@stylistic/no-trailing-spaces": ["error"],
};

export default tseslint.config(
	{
		files: ["src/**/*.astro"],
		plugins: {
			astro,
			"@stylistic": stylistic,
		},
		languageOptions: {
			globals: {
				// enable the standard global variables available in Astro components
				node: true,
				"astro/astro": true,
				es2020: true,
			},
			parser: astroParser,
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".astro"],
				// the script frontmatter in Astro components uses ESM
				sourceType: "module",
			},
		},
		extends: [
			...tseslint.configs.recommended,
		],
		rules: {
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/eol-last": ["error", "always"],
			"@stylistic/no-trailing-spaces": ["error"],
			...astro.configs.all.rules,
			// this sometimes errors even when the class is used in the same file
			"astro/no-unused-css-selector": ["off"],
			// this errors when the class is just set to a single string via a variable
			"astro/prefer-class-list-directive": ["off"],
		},
	},
	{
		files: ["src/**/*.{ts,tsx}"],
		extends: [
			...tseslint.configs.recommended,
		],
		plugins: {
			"@stylistic": stylistic
		},
		rules: {
			// Astro uses a triple slash reference in the env.d.ts file it automatically
			// creates, so just disable the rule to avoid trying to change that
			"@typescript-eslint/triple-slash-reference": ["off"],
			...stylisticRules,
			// this rule expects the tags in a .astro file to be indented at least
			// one level, but we want the outermost tag to start at column 0.  so
			// only enable it in .tsx files, not .astro.
			"@stylistic/jsx-indent": ["error", "tab"],
		}
	},
	{
		files: ["src/**/*.{js,jsx}"],
		extends: [
			eslint.configs.recommended,
		],
		plugins: {
			"@stylistic": stylistic
		},
		rules: {
			...stylisticRules,
			"@stylistic/jsx-indent": ["error", "tab"],
		}
	}
);
