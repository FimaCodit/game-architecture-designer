/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				"game-blue": "#3b82f6",
				"game-green": "#10b981",
				"game-purple": "#8b5cf6",
				"game-yellow": "#f59e0b",
				"game-red": "#ef4444",
			},
			fontFamily: {
				game: ["Inter", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
};
