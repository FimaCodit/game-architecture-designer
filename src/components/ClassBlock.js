import React from "react";

const ClassBlock = ({ classObj, isConnecting, connectionStart, selectedClass, handleClassClick, getDynamicClassColor, isSelected }) => {
	const isConnectionStart = connectionStart?.classId === classObj.id;

	// Получаем цвет
	const classColor = getDynamicClassColor(classObj.type);

	// Проверяем если это кастомный цвет
	const isCustomColor = classColor.startsWith("custom-color-");
	const customColorHex = isCustomColor ? `#${classColor.replace("custom-color-", "")}` : null;

	return (
		<div
			data-class-id={classObj.id}
			className={`class-block absolute bg-white border-2 rounded-lg shadow-md min-w-48 overflow-hidden ${isConnecting ? "cursor-pointer" : "cursor-move"} ${!isCustomColor ? classColor : ""} ${
				selectedClass?.id === classObj.id || isSelected ? "ring-2 ring-blue-500 shadow-xl border-blue-400 bg-blue-50" : ""
			} ${isConnectionStart ? "ring-2 ring-green-400" : ""}`}
			style={{
				left: classObj.position.x,
				top: classObj.position.y,
				userSelect: "none",
				...(isCustomColor && {
					backgroundColor: selectedClass?.id === classObj.id || isSelected ? "#3b82f620" : customColorHex + "20",
					borderColor: selectedClass?.id === classObj.id || isSelected ? "#3b82f6" : customColorHex,
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
					: "Перетащите для перемещения"
			}
		>
			<div className="bg-white p-2 border-b">
				<div className="font-bold text-sm">{classObj.name}</div>
				<div className="text-xs text-gray-600">{classObj.type}</div>
			</div>

			{classObj.properties.length > 0 && (
				<div className="p-2 border-b bg-white">
					<div className="text-xs font-semibold mb-1">Properties:</div>
					{classObj.properties.slice(0, 3).map((prop, idx) => (
						<div key={idx} className="text-xs text-gray-700">
							{prop.access === "private" ? "-" : "+"} {prop.name}: {prop.type}
						</div>
					))}
					{classObj.properties.length > 3 && <div className="text-xs text-gray-500">...и ещё {classObj.properties.length - 3}</div>}
				</div>
			)}

			{classObj.methods.length > 0 && (
				<div className="p-2 bg-white">
					<div className="text-xs font-semibold mb-1">Methods:</div>
					{classObj.methods.slice(0, 3).map((method, idx) => (
						<div key={idx} className="text-xs text-gray-700">
							{method.access === "private" ? "-" : "+"} {method.name}({method.params})
						</div>
					))}
					{classObj.methods.length > 3 && <div className="text-xs text-gray-500">...и ещё {classObj.methods.length - 3}</div>}
				</div>
			)}
		</div>
	);
};

export default ClassBlock;
