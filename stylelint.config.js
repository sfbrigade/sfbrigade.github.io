/** @type {import("stylelint").Config} */
export default {
	plugins: [
		"@stylistic/stylelint-plugin"
	],
	extends: [
		"@stylistic/stylelint-config",
    "stylelint-config-html/astro",
    "stylelint-config-html/html",
	],
	rules: {
		"block-no-empty": true,
		"length-zero-no-unit": [true, { ignore: ["custom-properties"] }],
		"rule-empty-line-before": "always",
		"@stylistic/indentation": "tab",
		"@stylistic/number-leading-zero": null,
		"@stylistic/selector-list-comma-newline-after": null,
	}
};
