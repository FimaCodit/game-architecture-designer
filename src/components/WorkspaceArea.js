// src/components/WorkspaceArea.js (упрощенная версия)
import React from "react";

// Используем обычные импорты вместо lazy loading для отладки
import ConnectionsLayer from "./ConnectionsLayer";
import ClassesLayer from "./ClassesLayer";
import SelectionOverlay from "./SelectionOverlay";

const WorkspaceArea = ({
	currentArchitecture,
	classes = [],
	connections = [],
	connectionPreview,
	selectedClass,
	selectedClasses = [],
	hasMultipleSelection,
	draggedClass,
	isConnecting,
	connectionStart, // Добавляем недостающий параметр
	handleClassClick,
	handleCanvasClick,
	handleCanvasMouseDown,
	isPanning,
	localCamera,
	canvasRef,
	classCategories,
	updateCurrentArchitecture,
	forceRender,
	deleteConnection,
	isClassSelected = () => false,
	selectionRect,
	isDrawingSelection,
	isSelectionMode,
	startSelection,
	updateSelection,
	endSelection,
}) => {
	// Проверяем наличие необходимых данных
	if (!localCamera) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-100">
				<div className="text-gray-500">Загрузка рабочей области...</div>
			</div>
		);
	}

	// Обработчик движения мыши для выделения
	const handleMouseMove = (e) => {
		if (isDrawingSelection) {
			updateSelection(e);
		}
	};

	// Обработчик отпускания кнопки мыши
	const handleMouseUp = (e) => {
		if (isDrawingSelection) {
			endSelection();
		}
	};

	return (
		<div className="flex-1 relative overflow-hidden">
			<div
				ref={canvasRef}
				className={`w-full h-full bg-gray-100 relative overflow-hidden select-none ${isPanning ? "cursor-grabbing" : isSelectionMode ? "cursor-crosshair" : "cursor-grab"}`}
				style={{
					backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
					backgroundSize: `${20 * localCamera.zoom}px ${20 * localCamera.zoom}px`,
					backgroundPosition: `${localCamera.offsetX}px ${localCamera.offsetY}px`,
				}}
				onMouseDown={handleCanvasMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onClick={handleCanvasClick}
			>
				{/* Слой связей */}
				<ConnectionsLayer connections={connections} connectionPreview={connectionPreview} classes={classes} localCamera={localCamera} deleteConnection={deleteConnection} />

				{/* Слой классов */}
				<ClassesLayer
					classes={classes}
					localCamera={localCamera}
					isConnecting={isConnecting}
					connectionStart={connectionStart}
					selectedClass={selectedClass}
					handleClassClick={handleClassClick}
					currentArchitecture={currentArchitecture}
					forceRender={forceRender}
					selectedClasses={selectedClasses}
					isClassSelected={isClassSelected}
				/>

				{/* Слой выделения области */}
				<SelectionOverlay selectionRect={selectionRect} isDrawingSelection={isDrawingSelection} />

				{/* Сообщение о пустой области - показываем только здесь */}
				{classes.length === 0 && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="text-center text-gray-500">
							<div className="text-4xl mb-4">🎮</div>
							<p className="text-lg mb-2">Начните создавать архитектуру игры</p>
							<p className="text-sm">Выберите шаблон или добавьте классы вручную</p>
						</div>
					</div>
				)}

				{/* Индикатор режима выделения - перемещаем в левый нижний угол */}
				{isSelectionMode && <div className="absolute bottom-4 left-4 z-50 bg-blue-500 text-white px-3 py-1 rounded text-sm">🎯 Режим выделения (Ctrl/Cmd)</div>}
			</div>
		</div>
	);
};

export default WorkspaceArea;
