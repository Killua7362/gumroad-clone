/** @type {import('postcss-load-config').Config} */
module.exports = {
	plugins: {
		"postcss-import": {},        // process @import
		"tailwindcss/nesting": {},   // add sass like nesting
		"postcss-preset-env": {},
		tailwindcss: {},             // then let tailwind do its thing
		autoprefixer: {},
	}
}
