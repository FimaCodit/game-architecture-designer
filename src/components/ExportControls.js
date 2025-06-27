import React, { useState } from "react";
import { Download, FileText, Image, Code, ChevronDown } from "lucide-react";

const ExportControls = ({ currentArchitecture }) => {
	const [showExportMenu, setShowExportMenu] = useState(false);

	const exportAsJSON = () => {
		const dataStr = JSON.stringify(currentArchitecture, null, 2);
		const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
		const exportFileDefaultName = `${currentArchitecture.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_architecture.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
		setShowExportMenu(false);
	};

	const exportAsPNG = () => {
		// Логика экспорта в PNG будет реализована позже
		alert("Экспорт в PNG будет добавлен в следующих версиях");
		setShowExportMenu(false);
	};

	const exportAsCode = () => {
		// Логика экспорта в код будет реализована позже
		alert("Генерация кода будет добавлена в следующих версиях");
		setShowExportMenu(false);
	};

	return (
		<div className="mb-6 border-t pt-4">
			<div className="relative">
				<button
					onClick={() => setShowExportMenu(!showExportMenu)}
					className="w-full p-3 bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
				>
					<Download size={16} />
					<span>Экспорт</span>
					<ChevronDown size={16} className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
				</button>

				{showExportMenu && (
					<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
						<button onClick={exportAsJSON} className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-200">
							<FileText size={16} className="text-blue-600" />
							<div>
								<div className="font-medium">JSON файл</div>
								<div className="text-xs text-gray-500">Сохранить архитектуру как JSON</div>
							</div>
						</button>

						<button onClick={exportAsPNG} className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-200">
							<Image size={16} className="text-green-600" />
							<div>
								<div className="font-medium">PNG изображение</div>
								<div className="text-xs text-gray-500">Экспорт диаграммы как картинку</div>
							</div>
						</button>

						<button onClick={exportAsCode} className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 rounded-b-lg">
							<Code size={16} className="text-purple-600" />
							<div>
								<div className="font-medium">Генерация кода</div>
								<div className="text-xs text-gray-500">Создать код классов</div>
							</div>
						</button>
					</div>
				)}
			</div>

			{/* Закрытие меню при клике вне его */}
			{showExportMenu && <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />}
		</div>
	);
};

export default ExportControls;
