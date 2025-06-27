import React, { useState, useRef } from "react";
import { Camera, Plus, Minus, RotateCcw, ChevronDown } from "lucide-react";

const FloatingCameraControls = ({ localCamera, zoomIn, zoomOut, resetCamera }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const menuRef = useRef(null);

	const handleZoomIn = () => {
		zoomIn();
	};

	const handleZoomOut = () => {
		zoomOut();
	};

	const handleReset = () => {
		resetCamera();
	};

	const handleBackdropClick = (e) => {
		if (menuRef.current && !menuRef.current.contains(e.target)) {
			setIsExpanded(false);
		}
	};

	return (
		<>
			{/* Фон для закрытия меню - ПЕРЕНЕСЕН ВВЕРХ */}
			{isExpanded && <div className="fixed inset-0 z-30" onClick={handleBackdropClick} />}

			<div className="fixed bottom-4 right-4 z-50">
				{/* Основная кнопка */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="mb-2 w-12 h-12 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
					title="Управление камерой"
				>
					<Camera size={20} className="text-gray-700" />
				</button>

				{/* Выпадающее меню */}
				{isExpanded && (
					<div ref={menuRef} className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[200px] relative z-60">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium text-sm text-gray-800">Камера</h3>
							<button onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-gray-700">
								<ChevronDown size={16} />
							</button>
						</div>

						{/* Информация о зуме */}
						<div className="text-xs text-gray-600 mb-3 text-center">Зум: {Math.round(localCamera.zoom * 100)}%</div>

						{/* Кнопки управления */}
						<div className="space-y-2">
							<button
								onClick={handleZoomIn}
								className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
								title="Приблизить"
							>
								<Plus size={14} />
								Приблизить
							</button>

							<button
								onClick={handleZoomOut}
								className="w-full bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
								title="Отдалить"
							>
								<Minus size={14} />
								Отдалить
							</button>

							<button
								onClick={handleReset}
								className="w-full bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
								title="Сбросить позицию"
							>
								<RotateCcw size={14} />
								Сброс
							</button>
						</div>

						{/* Подсказки */}
						<div className="text-xs text-gray-500 mt-3 space-y-1">
							<div>🖱️ Колесо мыши - зум</div>
							<div>🖱️ ЛКМ + перетаскивание - панорама</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default FloatingCameraControls;
