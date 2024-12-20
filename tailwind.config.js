/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: [ "class" ],
	content: [
		"./pages/**/*.{ts,tsx,jsx,js,css}",
		"./components/**/*.{ts,tsx,jsx,js,css}",
		"./app/**/*.{ts,tsx,jsx,js,css}",
		"./src/**/*.{ts,tsx,jsx,js,css}",
	],
	theme: {
		extend: {
			colors: {
				"c-text-primary": "#37393F",
				"c-text-secondary": "#718096",

				"c-light-gray": "#EEEEEE",
				"c-light-gray2": "#9C9C9C",
				"c-darker-gray": "#64748B",
				"c-dark-gray-titles": "#2F2B3DE5",
				"c-dark": "#323232",

				"c-blue": "#4880FF",
				"c-red": "#F93C65",
				"c-primaryColor":"#34727a",
				"c-secondaryColor":"#6de4d0",
			}
		}
	},

	plugins: [ require( "tailwindcss-animate" ) ],
};
