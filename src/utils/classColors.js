const defaultClassTypeColors = {
	Gameplay: "bg-blue-100 border-blue-400",
	System: "bg-green-100 border-green-400",
	UI: "bg-purple-100 border-purple-400",
	Data: "bg-yellow-100 border-yellow-400",
	Network: "bg-red-100 border-red-400",
	default: "bg-gray-100 border-gray-400",
};

// Доступные цвета для выбора
export const availableColors = [
	{ name: "Синий", bg: "bg-blue-100", border: "border-blue-400", color: "#3b82f6" },
	{ name: "Зеленый", bg: "bg-green-100", border: "border-green-400", color: "#10b981" },
	{ name: "Фиолетовый", bg: "bg-purple-100", border: "border-purple-400", color: "#8b5cf6" },
	{ name: "Желтый", bg: "bg-yellow-100", border: "border-yellow-400", color: "#f59e0b" },
	{ name: "Красный", bg: "bg-red-100", border: "border-red-400", color: "#ef4444" },
	{ name: "Розовый", bg: "bg-pink-100", border: "border-pink-400", color: "#ec4899" },
	{ name: "Индиго", bg: "bg-indigo-100", border: "border-indigo-400", color: "#6366f1" },
	{ name: "Бирюзовый", bg: "bg-teal-100", border: "border-teal-400", color: "#14b8a6" },
	{ name: "Оранжевый", bg: "bg-orange-100", border: "border-orange-400", color: "#f97316" },
	{ name: "Голубой", bg: "bg-cyan-100", border: "border-cyan-400", color: "#06b6d4" },
	{ name: "Лайм", bg: "bg-lime-100", border: "border-lime-400", color: "#84cc16" },
	{ name: "Серый", bg: "bg-gray-100", border: "border-gray-400", color: "#6b7280" },
];

export const getDynamicClassColor = (type, customColors = {}) => {
	// Проверяем сначала пользовательские цвета
	if (customColors[type]) {
		const colorString = customColors[type];

		// Если это кастомный цвет (начинается с "custom-")
		if (colorString.startsWith("custom-")) {
			const hexColor = colorString.replace("custom-", "");
			return `custom-color-${hexColor.replace("#", "")}`;
		}

		return colorString;
	}

	// Затем дефолтные цвета
	if (defaultClassTypeColors[type]) {
		return defaultClassTypeColors[type];
	}

	// Генерируем цвет на основе хеша для новых категорий
	let hash = 0;
	for (let i = 0; i < type.length; i++) {
		hash = type.charCodeAt(i) + ((hash << 5) - hash);
	}

	const colors = [
		"bg-pink-100 border-pink-400",
		"bg-indigo-100 border-indigo-400",
		"bg-teal-100 border-teal-400",
		"bg-orange-100 border-orange-400",
		"bg-cyan-100 border-cyan-400",
		"bg-lime-100 border-lime-400",
	];

	return colors[Math.abs(hash) % colors.length];
};

export const getColorPreview = (colorString) => {
	// Сначала проверяем более специфичный формат "custom-color-ffffff"
	if (colorString && colorString.startsWith("custom-color-")) {
		const hexPart = colorString.replace("custom-color-", "");
		return `#${hexPart}`;
	}

	// Потом проверяем общий формат "custom-#ffffff"
	if (colorString && colorString.startsWith("custom-")) {
		const color = colorString.replace("custom-", "");
		// Проверяем, есть ли уже # в начале
		return color.startsWith("#") ? color : `#${color}`;
	}

	const colorMap = {
		"bg-blue-100 border-blue-400": "#3b82f6",
		"bg-green-100 border-green-400": "#10b981",
		"bg-purple-100 border-purple-400": "#8b5cf6",
		"bg-yellow-100 border-yellow-400": "#f59e0b",
		"bg-red-100 border-red-400": "#ef4444",
		"bg-pink-100 border-pink-400": "#ec4899",
		"bg-indigo-100 border-indigo-400": "#6366f1",
		"bg-teal-100 border-teal-400": "#14b8a6",
		"bg-orange-100 border-orange-400": "#f97316",
		"bg-cyan-100 border-cyan-400": "#06b6d4",
		"bg-lime-100 border-lime-400": "#84cc16",
		"bg-gray-100 border-gray-400": "#6b7280",
	};

	return colorMap[colorString] || "#6b7280";
};
