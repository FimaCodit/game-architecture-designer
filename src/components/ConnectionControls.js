import React, { useState } from "react";
import { GitBranch, MousePointer, ChevronDown } from "lucide-react";

const ConnectionControls = ({ isConnecting, onToggleConnectionMode, connectionsCount, selectedConnectionType, onConnectionTypeChange }) => {
	const [showTypeMenu, setShowTypeMenu] = useState(false);

	const connectionTypes = [
		{ type: "uses", label: "🎯 Использует (методы)", description: "Класс вызывает методы другого класса" },
		{ type: "extends", label: "📈 Наследует (родитель-потомок)", description: "Один класс наследуется от другого" },
		{ type: "contains", label: "📦 Содержит (коллекция)", description: "Класс содержит список/массив других объектов" },
		{ type: "creates", label: "⚡ Создает (фабрика)", description: "Класс создает экземпляры другого класса" },
		{ type: "related", label: "🔗 Связан (общая связь)", description: "Общая связь, когда не понятно какая именно" },
	];

	const getCurrentTypeLabel = () => {
		const currentType = connectionTypes.find((t) => t.type === selectedConnectionType);
		return currentType ? currentType.label : "🔗 Связан (общая связь)";
	};

	const handleTypeSelect = (type) => {
		onConnectionTypeChange(type);
		setShowTypeMenu(false);
	};

	return (
		<div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
			<h3 className="font-semibold mb-2 text-sm">Связи между классами</h3>

			<div className="mb-2 text-xs text-gray-600">Создано связей: {connectionsCount}</div>

			{/* Выбор типа связи */}
			<div className="mb-3 relative">
				<label className="block text-xs font-medium text-gray-700 mb-1">Тип связи:</label>
				<button
					onClick={() => setShowTypeMenu(!showTypeMenu)}
					className="w-full p-2 text-left bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center justify-between"
				>
					<span className="truncate">{getCurrentTypeLabel()}</span>
					<ChevronDown size={14} className={`transition-transform ${showTypeMenu ? "rotate-180" : ""}`} />
				</button>

				{showTypeMenu && (
					<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
						{connectionTypes.map((connectionType) => {
							// Получаем стиль линии для каждого типа
							const getLineStyle = (type) => {
								switch (type) {
									case "uses":
										return { color: "#3b82f6", strokeDasharray: "none" }; // синий
									case "extends":
										return { color: "#10b981", strokeDasharray: "none" }; // зеленый
									case "contains":
										return { color: "#f59e0b", strokeDasharray: "none" }; // оранжевый
									case "creates":
										return { color: "#8b5cf6", strokeDasharray: "5,3" }; // фиолетовый пунктир
									case "related":
									default:
										return { color: "#6b7280", strokeDasharray: "none" }; // серый
								}
							};

							const lineStyle = getLineStyle(connectionType.type);

							return (
								<button
									key={connectionType.type}
									onClick={() => handleTypeSelect(connectionType.type)}
									className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${selectedConnectionType === connectionType.type ? "bg-purple-50" : ""}`}
								>
									<div className="font-medium text-sm mb-2">{connectionType.label}</div>
									<div className="text-xs text-gray-500 mb-2">{connectionType.description}</div>

									{/* Пример линии */}
									<div className="flex items-center gap-2">
										<span className="text-xs text-gray-400">Пример:</span>
										<svg width="60" height="20" className="flex-shrink-0">
											<line x1="5" y1="10" x2="55" y2="10" stroke={lineStyle.color} strokeWidth="2.5" strokeDasharray={lineStyle.strokeDasharray} />
										</svg>
									</div>
								</button>
							);
						})}
					</div>
				)}

				{/* Закрытие меню при клике вне его */}
				{showTypeMenu && <div className="fixed inset-0 z-40" onClick={() => setShowTypeMenu(false)} />}
			</div>

			<button
				onClick={onToggleConnectionMode}
				className={`w-full p-2 rounded transition-colors flex items-center justify-center gap-2 ${
					isConnecting ? "bg-purple-500 text-white hover:bg-purple-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
				}`}
			>
				{isConnecting ? (
					<>
						<GitBranch size={16} />
						Режим связей (активен)
					</>
				) : (
					<>
						<MousePointer size={16} />
						Создать связь
					</>
				)}
			</button>

			{isConnecting && (
				<div className="mt-2 text-xs text-purple-700 bg-purple-100 p-2 rounded">
					<div className="font-medium mb-1">Режим создания связей активен:</div>
					<div>1. Выберите тип связи выше</div>
					<div>2. Кликните на первый класс</div>
					<div>3. Кликните на второй класс</div>
					<div>4. Связь будет создана автоматически</div>
					<div className="mt-1 font-medium text-green-600">✨ Тип: {getCurrentTypeLabel()}</div>
					<div className="mt-1 font-medium text-red-600">⚠️ Перетаскивание отключено</div>
					<div className="mt-1 text-xs text-gray-600">Кликните "Режим связей" для выхода</div>
				</div>
			)}
		</div>
	);
};

export default ConnectionControls;
