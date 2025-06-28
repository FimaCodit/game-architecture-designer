import React, { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useArchitectures } from "./hooks/useArchitectures";
import { useCamera } from "./hooks/useCamera";
import { useClassManagement } from "./hooks/useClassManagement";
import { useConnections } from "./hooks/useConnections";
import { useMultiSelection } from "./hooks/useMultiSelection";
import { useGlobalEventHandlers } from "./hooks/useGlobalEventHandlers";
import { createClassClickHandler } from "./handlers/classClickHandler";
import { createCanvasClickHandler } from "./handlers/canvasClickHandler";
import { createConnectionModeToggler } from "./handlers/connectionModeHandler";
import Sidebar from "./components/Sidebar";
import SidebarToggle from "./components/SidebarToggle";
import WorkspaceArea from "./components/WorkspaceArea";
import FloatingCameraControls from "./components/FloatingCameraControls";
import "./App.css";

const AppContent = () => {
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);

	// Основные хуки для управления состоянием (теперь с Firebase)
	const {
		architectures,
		currentArchitecture,
		currentArchitectureId,
		setCurrentArchitectureId,
		updateCurrentArchitecture,
		createNewArchitecture,
		deleteArchitecture,
		renameArchitecture,
		applyTemplate, // Добавляем новую функцию
		generateId,
		loading,
		error,
		syncStatus,
		clearError,
		forceSync,
		isAuthenticated,
		forceRender,
	} = useArchitectures();

	const { localCamera, canvasRef, handleCanvasMouseDown: originalHandleCanvasMouseDown, zoomIn, zoomOut, resetCamera, isPanning } = useCamera(currentArchitecture.camera, updateCurrentArchitecture);

	const {
		selectedClass,
		setSelectedClass,
		draggedClass,
		isDraggingMultiple,
		draggedMultipleClasses,
		newClassForm,
		setNewClassForm,
		classes,
		classCategories,
		addCustomClass,
		deleteClass,
		deleteMultipleClasses, // Добавляем
		updateClassProperty,
		addProperty,
		addMethod,
		handleMouseDown,
		handleDragMove,
		handleDragEnd,
		copyClass,
		pasteClass,
		hasCopiedClass,
		copiedClass,
		updateLocalCamera,
	} = useClassManagement(currentArchitecture, updateCurrentArchitecture, generateId);

	// Обновляем камеру в хуке управления классами
	useEffect(() => {
		updateLocalCamera(localCamera);
	}, [localCamera, updateLocalCamera]);

	// Обновленный хук useConnections с поддержкой типов связей
	const {
		isConnecting,
		connectionStart,
		connectionPreview,
		connections,
		selectedConnectionType,
		enableConnectionMode,
		toggleConnectionMode,
		startConnection,
		updateConnectionPreview,
		finishConnection,
		cancelConnection,
		resetCurrentConnection,
		deleteConnection,
		changeConnectionType,
	} = useConnections(currentArchitecture, updateCurrentArchitecture, generateId, localCamera, canvasRef);

	// Добавляем хук множественного выделения
	const { isSelectionMode, selectedClasses, selectionRect, isDrawingSelection, startSelection, updateSelection, endSelection, clearSelection, isClassSelected, hasMultipleSelection } =
		useMultiSelection(classes, localCamera, canvasRef);

	// Глобальная обработка событий
	useGlobalEventHandlers({
		draggedClass,
		isDraggingMultiple,
		draggedMultipleClasses,
		isConnecting,
		connectionStart,
		handleDragMove,
		handleDragEnd,
		updateConnectionPreview,
		localCamera,
		canvasRef,
	});

	// Обработчики событий - ИСПРАВЛЯЕМ передачу параметров
	const handleClassClick = createClassClickHandler({
		isConnecting,
		connectionStart,
		startConnection,
		finishConnection,
		handleMouseDown,
		selectedClasses,
		isClassSelected,
		localCamera, // Добавляем камеру
	});

	// Обновленный обработчик клика по канвасу
	const handleCanvasClick = createCanvasClickHandler({
		isConnecting,
		connectionStart,
		resetCurrentConnection,
		setSelectedClass,
		clearSelection,
		isSelectionMode,
		startSelection,
	});

	// Обработчик mouseDown для канваса
	const handleCanvasMouseDown = (e) => {
		// Если режим выделения активен, начинаем выделение
		if (isSelectionMode && e.button === 0) {
			const started = startSelection(e);
			if (started) {
				return; // Не продолжаем обработку
			}
		}

		// Иначе обычная обработка камеры
		originalHandleCanvasMouseDown(e);
	};

	// Обновленный обработчик режима связей
	const handleToggleConnectionMode = () => {
		if (isConnecting) {
			cancelConnection();
		} else {
			enableConnectionMode();
		}
		setSelectedClass(null);
	};

	// Обработчик кастомного события удаления
	useEffect(() => {
		const handleDeleteSelected = (e) => {
			const classIds = e.detail;
			if (classIds && classIds.length > 0) {
				const confirmMessage = `Удалить ${classIds.length} ${classIds.length === 1 ? "класс" : classIds.length < 5 ? "класса" : "классов"}?`;

				if (window.confirm(confirmMessage)) {
					deleteMultipleClasses(classIds);
					clearSelection(); // Очищаем выделение после удаления
				}
			}
		};

		document.addEventListener("deleteSelectedClasses", handleDeleteSelected);
		return () => document.removeEventListener("deleteSelectedClasses", handleDeleteSelected);
	}, [deleteMultipleClasses, clearSelection]);

	return (
		<div className="h-screen flex bg-gray-50 relative">
			<Sidebar
				isVisible={isSidebarVisible}
				architectures={architectures}
				currentArchitectureId={currentArchitectureId}
				setCurrentArchitectureId={setCurrentArchitectureId}
				createNewArchitecture={createNewArchitecture}
				deleteArchitecture={deleteArchitecture}
				renameArchitecture={renameArchitecture}
				classCategories={classCategories}
				classes={classes}
				updateCurrentArchitecture={updateCurrentArchitecture}
				newClassForm={newClassForm}
				setNewClassForm={setNewClassForm}
				addCustomClass={async () => {
					try {
						const result = await addCustomClass(localCamera);
						if (result) {
							return result;
						}
						return false;
					} catch (error) {
						console.error("Error in addCustomClass:", error);
						throw error;
					}
				}}
				isConnecting={isConnecting}
				toggleConnectionMode={handleToggleConnectionMode}
				connectionsCount={connections.length}
				selectedConnectionType={selectedConnectionType}
				onConnectionTypeChange={changeConnectionType}
				currentArchitecture={currentArchitecture}
				selectedClass={selectedClass}
				updateClassProperty={updateClassProperty}
				addProperty={addProperty}
				addMethod={addMethod}
				deleteClass={deleteClass}
				deleteMultipleClasses={deleteMultipleClasses}
				loading={loading}
				error={error}
				syncStatus={syncStatus}
				clearError={clearError}
				forceSync={forceSync}
				isAuthenticated={isAuthenticated}
				copyClass={copyClass}
				pasteClass={pasteClass}
				hasCopiedClass={hasCopiedClass}
				copiedClass={copiedClass}
				// Добавляем пропсы для множественного выделения
				hasMultipleSelection={hasMultipleSelection}
				selectedClasses={selectedClasses}
				// Добавляем новые пропсы для шаблонов
				applyTemplate={applyTemplate}
				generateId={generateId}
			/>

			<div className="flex-1 flex flex-col relative">
				<SidebarToggle isVisible={isSidebarVisible} onToggle={() => setIsSidebarVisible(!isSidebarVisible)} />

				<WorkspaceArea
					currentArchitecture={currentArchitecture}
					classes={classes}
					connections={connections}
					connectionPreview={connectionPreview}
					selectedClass={selectedClass}
					isConnecting={isConnecting}
					connectionStart={connectionStart} // Добавляем недостающий проп
					draggedClass={draggedClass}
					localCamera={localCamera}
					canvasRef={canvasRef}
					handleCanvasMouseDown={handleCanvasMouseDown}
					handleCanvasClick={handleCanvasClick}
					handleClassClick={handleClassClick}
					deleteConnection={deleteConnection}
					isPanning={isPanning}
					forceRender={forceRender}
					isSelectionMode={isSelectionMode}
					selectionRect={selectionRect}
					isDrawingSelection={isDrawingSelection}
					startSelection={startSelection}
					updateSelection={updateSelection}
					endSelection={endSelection}
					selectedClasses={selectedClasses}
					isClassSelected={isClassSelected}
				/>

				<FloatingCameraControls onZoomIn={zoomIn} onZoomOut={zoomOut} onResetCamera={resetCamera} zoom={localCamera?.zoom || 1} />
			</div>
		</div>
	);
};

const App = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
};

export default App;
