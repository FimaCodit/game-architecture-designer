import React, { useState } from "react";
import { Plus, Trash2, Palette, Check, X } from "lucide-react";
import { categoryManager } from "../utils/categoryManager";
import { availableColors, getDynamicClassColor, getColorPreview } from "../utils/classColors";

const CategoryManagement = ({ classCategories, classes, updateCurrentArchitecture, currentArchitecture }) => {
	const [newCategoryName, setNewCategoryName] = useState("");
	const [editingColorCategory, setEditingColorCategory] = useState(null);
	const [selectedCustomColor, setSelectedCustomColor] = useState(""); // Добавляем состояние для выбранного цвета

	const customColors = currentArchitecture.customCategoryColors || {};

	const handleAddCategory = () => {
		if (categoryManager.addCategory(classCategories, newCategoryName, updateCurrentArchitecture)) {
			setNewCategoryName("");
		}
	};

	const handleRemoveCategory = (category) => {
		if (categoryManager.removeCategory(category, classCategories, classes, updateCurrentArchitecture)) {
			// Удаляем также пользовательский цвет для этой категории
			const updatedCustomColors = { ...customColors };
			delete updatedCustomColors[category];
			updateCurrentArchitecture({ customCategoryColors: updatedCustomColors });
		}
	};

	const handleColorChange = (category, colorData) => {
		const colorString = `${colorData.bg} ${colorData.border}`;
		const updatedCustomColors = {
			...customColors,
			[category]: colorString,
		};

		console.log("Изменяем цвет категории:", category, "на:", colorString);
		console.log("Новые customColors:", updatedCustomColors);

		updateCurrentArchitecture({
			customCategoryColors: updatedCustomColors,
			lastModified: new Date().toISOString(),
			_colorUpdate: Date.now() + Math.random(),
		});
		setEditingColorCategory(null);
	};

	const handleCustomColorChange = (category, color) => {
		const colorString = `custom-${color}`;
		const updatedCustomColors = {
			...customColors,
			[category]: colorString,
		};

		console.log("Изменяем цвет категории на кастомный:", category, "на:", color);
		console.log("Новые customColors:", updatedCustomColors);

		updateCurrentArchitecture({
			customCategoryColors: updatedCustomColors,
			lastModified: new Date().toISOString(),
			_colorUpdate: Date.now() + Math.random(),
		});
		setSelectedCustomColor(""); // Сбрасываем выбранный цвет
		setEditingColorCategory(null);
	};

	// Функция для закрытия палитры с очисткой состояния
	const closePalette = () => {
		setEditingColorCategory(null);
		setSelectedCustomColor(""); // Сбрасываем выбранный цвет при закрытии
	};

	const resetCategoryColor = (category) => {
		const updatedCustomColors = { ...customColors };
		delete updatedCustomColors[category];

		console.log("Сбрасываем цвет категории:", category);
		console.log("Новые customColors:", updatedCustomColors);

		updateCurrentArchitecture({
			customCategoryColors: updatedCustomColors,
			lastModified: new Date().toISOString(),
			_colorUpdate: Date.now() + Math.random(),
		});
		setEditingColorCategory(null);
	};

	return (
		<div className="mb-6">
			<h3 className="font-semibold mb-2">Категории классов</h3>
			<div className="space-y-2 mb-3">
				{classCategories.map((category) => (
					<div key={`${category}-${JSON.stringify(customColors)}`} className="relative">
						<div className="flex items-center justify-between p-2 bg-gray-50 rounded">
							<div className="flex items-center gap-2">
								{/* Цветовой индикатор */}
								{(() => {
									const calculatedColor = getDynamicClassColor(category, customColors);
									const previewColor = getColorPreview(calculatedColor);

									console.log(`Индикатор для ${category}:`, {
										customColors: customColors[category],
										calculatedColor,
										previewColor,
									});

									return (
										<div
											className="w-4 h-4 rounded border-2 border-gray-300"
											style={{
												backgroundColor: previewColor,
											}}
										/>
									);
								})()}
								<span className="text-sm">{category}</span>
							</div>
							<div className="flex items-center gap-1">
								<button
									onClick={() => {
										if (editingColorCategory === category) {
											// Закрываем палитру
											setEditingColorCategory(null);
											setSelectedCustomColor(""); // Сбрасываем при закрытии
										} else {
											// Открываем палитру
											setEditingColorCategory(category);
											setSelectedCustomColor(""); // Сбрасываем при открытии новой палитры
										}
									}}
									className="text-purple-500 hover:text-purple-700 text-xs"
									title="Изменить цвет"
								>
									<Palette size={12} />
								</button>
								{classCategories.length > 1 && (
									<button onClick={() => handleRemoveCategory(category)} className="text-red-500 hover:text-red-700 text-xs">
										<Trash2 size={12} />
									</button>
								)}
							</div>
						</div>

						{/* Палитра цветов */}
						{editingColorCategory === category && (
							<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3">
								<div className="text-xs font-medium mb-2">Выберите цвет:</div>
								<div className="grid grid-cols-4 gap-2 mb-3">
									{availableColors.map((colorData, index) => (
										<button
											key={index}
											onClick={() => handleColorChange(category, colorData)}
											className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors"
											title={colorData.name}
										>
											<div className="w-6 h-6 rounded border-2" style={{ backgroundColor: colorData.color }} />
											<span className="text-xs">{colorData.name}</span>
										</button>
									))}
								</div>

								{/* Кастомный цвет через color picker */}
								<div className="mb-3 border-t pt-3">
									<div className="text-xs font-medium mb-2">Выберите любой цвет:</div>
									<div className="flex gap-2 items-center">
										{(() => {
											// Определяем текущий цвет для color picker
											let currentColor = "#3b82f6"; // значение по умолчанию

											if (selectedCustomColor) {
												currentColor = selectedCustomColor;
											} else if (customColors[category]) {
												if (customColors[category].startsWith("custom-")) {
													currentColor = customColors[category].replace("custom-", "");
												} else {
													currentColor = getColorPreview(customColors[category]);
												}
											} else {
												currentColor = getColorPreview(getDynamicClassColor(category, {}));
											}

											console.log(`Color picker для ${category}:`, {
												selectedCustomColor,
												customColorForCategory: customColors[category],
												calculatedCurrentColor: currentColor,
											});

											return (
												<input
													type="color"
													className="flex-1 h-8 border border-gray-300 rounded cursor-pointer"
													value={currentColor}
													onChange={(e) => setSelectedCustomColor(e.target.value)}
													title="Выберите любой цвет"
												/>
											);
										})()}

										<button
											onClick={() => {
												if (selectedCustomColor) {
													handleCustomColorChange(category, selectedCustomColor);
												}
											}}
											className={`px-3 py-1 text-white text-xs rounded transition-colors ${
												selectedCustomColor ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
											}`}
											disabled={!selectedCustomColor}
										>
											Применить
										</button>
									</div>
									{selectedCustomColor && <div className="mt-2 text-xs text-gray-500">Выбранный цвет: {selectedCustomColor}</div>}
								</div>

								<div className="flex gap-2">
									{customColors[category] && (
										<button onClick={() => resetCategoryColor(category)} className="flex-1 text-xs py-1 px-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
											Сброс
										</button>
									)}
									<button onClick={closePalette} className="flex-1 text-xs py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600">
										Закрыть
									</button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Закрытие палитры при клике вне ее */}
			{editingColorCategory && <div className="fixed inset-0 z-40" onClick={closePalette} />}

			<div className="flex gap-2">
				<input
					type="text"
					placeholder="Новая категория"
					value={newCategoryName}
					onChange={(e) => setNewCategoryName(e.target.value)}
					className="flex-1 p-2 border rounded text-sm"
					onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
				/>
				<button onClick={handleAddCategory} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
					<Plus size={14} />
				</button>
			</div>
		</div>
	);
};

export default CategoryManagement;
