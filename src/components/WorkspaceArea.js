import React from "react";
import ConnectionsLayer from "./ConnectionsLayer";
import ClassesLayer from "./ClassesLayer";
import SelectionOverlay from "./SelectionOverlay";

const WorkspaceArea = ({
	currentArchitecture,
	classes,
	connections,
	connectionPreview,
	selectedClass,
	isConnecting,
	connectionStart,
	draggedClass,
	localCamera,
	canvasRef,
	handleCanvasMouseDown,
	handleCanvasClick,
	handleClassClick,
	deleteConnection,
	isPanning,
	forceRender,
	// Добавляем пропсы для множественного выделения
	isSelectionMode,
	selectionRect,
	isDrawingSelection,
	startSelection,
	updateSelection,
	endSelection,
	selectedClasses,
	isClassSelected,
}) => {
	const handleMouseDown = (e) => {
		console.log("WorkspaceArea mouseDown", { isSelectionMode, target: e.target });

		// Сначала проверяем множественное выделение
		if (startSelection(e)) {
			console.log("Selection started");
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		// Иначе вызываем обычный обработчик
		handleCanvasMouseDown(e);
	};

	const handleMouseMove = (e) => {
		if (isDrawingSelection) {
			console.log("Selection updating");
			updateSelection(e);
		}
	};

	const handleMouseUp = (e) => {
		if (isDrawingSelection) {
			console.log("Selection ending");
			endSelection();
		}
	};

	return (
		<div className="flex-1 relative overflow-hidden">
			<div
				ref={canvasRef}
				className={`w-full h-full bg-gray-100 relative overflow-hidden select-none ${isSelectionMode ? "cursor-crosshair" : isPanning ? "cursor-grabbing" : "cursor-grab"}`}
				style={{
					backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
					backgroundSize: `${20 * localCamera.zoom}px ${20 * localCamera.zoom}px`,
					backgroundPosition: `${localCamera.offsetX}px ${localCamera.offsetY}px`,
				}}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onClick={handleCanvasClick}
			>
				<ConnectionsLayer connections={connections} connectionPreview={connectionPreview} classes={classes} localCamera={localCamera} deleteConnection={deleteConnection} />

				<ClassesLayer
					classes={classes}
					localCamera={localCamera}
					isConnecting={isConnecting}
					connectionStart={connectionStart}
					selectedClass={selectedClass}
					handleClassClick={handleClassClick}
					currentArchitecture={currentArchitecture}
					forceRender={forceRender}
					// Добавляем пропсы для множественного выделения
					selectedClasses={selectedClasses}
					isClassSelected={isClassSelected}
				/>

				{/* Оверлей для области выделения */}
				<SelectionOverlay selectionRect={selectionRect} isDrawingSelection={isDrawingSelection} />
			</div>
		</div>
	);
};

export default WorkspaceArea;
