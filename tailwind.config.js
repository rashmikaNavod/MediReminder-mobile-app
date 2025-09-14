const { COLORS } = require("./constants/Colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.tsx", "./components/**/*.tsx"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			fontFamily: {
				"Outfit-Regular": ["Outfit-Regular", "sans-serif"],
				"Outfit-SemiBold": ["Outfit-SemiBold", "sans-serif"],
				"Outfit-Bold": ["Outfit-Bold", "sans-serif"],
			},
			colors: {
				primary: COLORS.primary,
				secondary: COLORS.secondary,
				"custom-background": COLORS.background,
				"custom-text": COLORS.text,
			},
		},
	},
	plugins: [],
};
