import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const FloatingThemeToggle = () => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="fixed bottom-4 right-20 z-50 w-12 h-12 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
			title={isDark ? "Переключить на светлую тему" : "Переключить на темную тему"}
		>
			{isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
		</button>
	);
};

export default FloatingThemeToggle;
