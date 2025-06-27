import React, { useState } from "react";
import { Layers, ChevronDown, Zap, AlertTriangle } from "lucide-react";
import { architectureTemplates } from "../data/architectureTemplates"; // Импортируем реальные шаблоны

const TemplateSelector = ({ onApplyTemplate, currentArchitecture, generateId }) => {
	const [showTemplateMenu, setShowTemplateMenu] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState(null);

	// Используем реальные шаблоны из файла
	const availableTemplates = architectureTemplates;

	const handleApplyTemplate = (template) => {
		// Создаем классы с новыми ID и смещаем их позиции чтобы не накладывались
		const existingClassCount = currentArchitecture.classes ? currentArchitecture.classes.length : 0;
		const offsetX = (existingClassCount % 3) * 300; // Смещение по X
		const offsetY = Math.floor(existingClassCount / 3) * 200; // Смещение по Y

		// Преобразуем классы из шаблона в формат приложения
		const templatedClasses = template.classes.map((classTemplate) => ({
			id: generateId(),
			name: classTemplate.name,
			type: classTemplate.category || "Gameplay", // используем category как type
			position: {
				x: classTemplate.position.x + offsetX,
				y: classTemplate.position.y + offsetY,
			},
			// Преобразуем properties из шаблона
			properties: classTemplate.properties.map((prop) => ({
				name: prop.name,
				type: prop.type,
				access: prop.visibility || "private", // используем visibility как access
			})),
			// Преобразуем methods из шаблона
			methods: classTemplate.methods.map((method) => ({
				name: method.name,
				params: method.params,
				returnType: method.returnType,
				access: method.visibility || "public", // используем visibility как access
			})),
		}));

		// Создаем связи с новыми ID классов
		const templatedConnections = template.connections
			.map((connection) => {
				const fromIndex = template.classes.findIndex((cls) => cls.id === connection.from);
				const toIndex = template.classes.findIndex((cls) => cls.id === connection.to);

				if (fromIndex === -1 || toIndex === -1) {
					console.warn("Connection references non-existent class:", connection);
					return null;
				}

				return {
					id: generateId(),
					from: templatedClasses[fromIndex].id,
					to: templatedClasses[toIndex].id,
					type: connection.type,
				};
			})
			.filter(Boolean); // Убираем null значения

		// Собираем уникальные категории из шаблона
		const templateCategories = [...new Set(template.classes.map((cls) => cls.category))];

		// Применяем шаблон, добавляя к существующим классам и связям
		onApplyTemplate({
			classes: [...(currentArchitecture.classes || []), ...templatedClasses],
			connections: [...(currentArchitecture.connections || []), ...templatedConnections],
			categories: [...new Set([...currentArchitecture.categories, ...templateCategories])],
		});

		setShowTemplateMenu(false);
		setSelectedTemplate(null);
	};

	const handleTemplateSelect = (template) => {
		setSelectedTemplate(template);
		setShowTemplateMenu(false); // Автоматически закрываем меню после выбора
	};

	const confirmApply = () => {
		if (selectedTemplate) {
			handleApplyTemplate(selectedTemplate);
		}
	};

	const cancelSelection = () => {
		setSelectedTemplate(null);
		setShowTemplateMenu(false);
	};

	return (
		<div className="mb-6">
			<h3 className="font-semibold mb-2 flex items-center gap-2">
				<Layers size={16} className="text-purple-600" />
				Паттерны архитектуры
			</h3>

			<div className="relative">
				<button
					onClick={() => setShowTemplateMenu(!showTemplateMenu)}
					className="w-full p-3 bg-purple-100 text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
				>
					<Layers size={16} />
					<span>Выбрать паттерн</span>
					<ChevronDown size={16} className={`transition-transform ${showTemplateMenu ? "rotate-180" : ""}`} />
				</button>

				{showTemplateMenu && (
					<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
						{Object.values(availableTemplates).map((template) => (
							<button
								key={template.name} // используем name как ключ, так как нет id
								onClick={() => handleTemplateSelect(template)}
								className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
									selectedTemplate?.name === template.name ? "bg-purple-50 border-purple-200" : ""
								}`}
							>
								<div className="flex items-start gap-3">
									<div className="text-2xl">{template.icon}</div>
									<div className="flex-1">
										<div className="font-medium text-sm mb-1">{template.name}</div>
										<div className="text-xs text-gray-500 mb-2">{template.description}</div>
										<div className="flex gap-2 text-xs">
											<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{template.classes.length} классов</span>
											<span className="bg-green-100 text-green-700 px-2 py-1 rounded">{template.connections.length} связей</span>
										</div>
									</div>
								</div>
							</button>
						))}
					</div>
				)}

				{/* Закрытие меню при клике вне его */}
				{showTemplateMenu && <div className="fixed inset-0 z-40" onClick={() => setShowTemplateMenu(false)} />}
			</div>

			{/* Предварительный просмотр выбранного шаблона */}
			{selectedTemplate && (
				<div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
					<div className="flex items-start gap-2 mb-3">
						<div className="text-lg">{selectedTemplate.icon}</div>
						<div>
							<div className="font-medium text-sm text-purple-800">{selectedTemplate.name}</div>
							<div className="text-xs text-purple-600">{selectedTemplate.description}</div>
						</div>
					</div>

					{/* Детали шаблона */}
					<div className="mb-3 space-y-2">
						<div className="text-xs text-purple-700">
							<div className="font-medium mb-1">Будет добавлено:</div>
							<div className="grid grid-cols-1 gap-1 text-xs">
								{selectedTemplate.classes.map((cls, index) => (
									<div key={index} className="bg-white p-2 rounded border">
										<div className="font-medium">{cls.name}</div>
										<div className="text-gray-500">{cls.category}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Информация о позиционировании */}
					{currentArchitecture.classes && currentArchitecture.classes.length > 0 && (
						<div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
							<div className="text-blue-800 font-medium">ℹ️ Информация</div>
							<div className="text-blue-700">Классы будут добавлены к существующим ({currentArchitecture.classes.length} шт.) с автоматическим смещением позиций</div>
						</div>
					)}

					<div className="flex gap-2">
						<button onClick={confirmApply} className="flex-1 bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-1 text-sm">
							<Zap size={14} />
							Добавить
						</button>
						<button onClick={cancelSelection} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors text-sm">
							Отмена
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TemplateSelector;
