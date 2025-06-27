import React from "react";

const ClassBlock = ({ classObj, isConnecting, connectionStart, selectedClass, handleClassClick, getDynamicClassColor, isSelected, localCamera }) => {
	const isConnectionStart = connectionStart?.classId === classObj.id;

	// Получаем цвет
	const classColor = getDynamicClassColor(classObj.type);

	// Проверяем если это кастомный цвет
	const isCustomColor = classColor.startsWith("custom-color-");
	const customColorHex = isCustomColor ? `#${classColor.replace("custom-color-", "")}` : null;

	// Получаем цвет для текста категории
	const getCategoryTextColor = () => {
		if (isCustomColor && customColorHex) {
			return customColorHex;
		}

		// Цвета для стандартных категорий
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

		return colorMap[classColor] || "#6b7280";
	};

	const categoryTextColor = getCategoryTextColor();

	return (
		<div
			data-class-id={classObj.id}
			className={`class-block class-block-dark absolute border-4 rounded-lg shadow-md min-w-48 overflow-hidden ${isConnecting ? "cursor-pointer" : isSelected ? "cursor-move" : "cursor-move"} ${
				!isCustomColor ? classColor : ""
			} ${isSelected ? "ring-2 ring-blue-500 shadow-xl border-blue-400" : ""} ${isConnectionStart ? "ring-2 ring-green-400" : ""}`}
			style={{
				left: classObj.position.x * localCamera.zoom + localCamera.offsetX,
				top: classObj.position.y * localCamera.zoom + localCamera.offsetY,
				transform: `scale(${localCamera.zoom})`,
				transformOrigin: "top left",
				userSelect: "none",
				backgroundColor: "#1f2937", // Темный фон
				...(isCustomColor && {
					borderColor: isSelected ? "#3b82f6" : customColorHex,
				}),
			}}
			onMouseDown={(e) => handleClassClick(e, classObj)}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			title={
				isConnecting
					? isConnectionStart
						? "Выбран как начальный класс"
						: connectionStart
						? "Кликните для создания связи"
						: "Кликните для начала создания связи"
					: isSelected
					? "Перетащите для группового перемещения"
					: "Перетащите для перемещения"
			}
		>
			{/* Индикатор группового выделения */}
			{isSelected && (
				<div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
					<span className="text-white text-xs font-bold">✓</span>
				</div>
			)}

			<div className="p-2 border-b" style={{ backgroundColor: "#374151", borderColor: "#4b5563" }}>
				<div className="font-black text-base text-white">{classObj.name}</div>
				<div className="text-xs font-medium" style={{ color: categoryTextColor }}>
					{classObj.type}
				</div>
			</div>

			{classObj.properties.length > 0 && (
				<div className="p-2 border-b" style={{ backgroundColor: "#374151", borderColor: "#4b5563" }}>
					<div className="text-xs font-semibold mb-1 text-white">Properties:</div>
					{classObj.properties.map((prop, idx) => (
						<div key={idx} className="text-xs text-gray-200">
							{prop.access === "private" ? "-" : "+"} {prop.name}: {prop.type}
						</div>
					))}
				</div>
			)}

			{classObj.methods.length > 0 && (
				<div className="p-2" style={{ backgroundColor: "#374151" }}>
					<div className="text-xs font-semibold mb-1 text-white">Methods:</div>
					{classObj.methods.map((method, idx) => (
						<div key={idx} className="text-xs text-gray-200">
							{method.access === "private" ? "-" : "+"} {method.name}({method.params})
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ClassBlock;
