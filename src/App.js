import React, { useState } from "react";
import { useArchitectures } from "./hooks/useArchitectures";
import { useCamera } from "./hooks/useCamera";
import { useClassManagement } from "./hooks/useClassManagement";
import { useConnections } from "./hooks/useConnections";
import { useGlobalEventHandlers } from "./hooks/useGlobalEventHandlers";
import { createClassClickHandler } from "./handlers/classClickHandler";
import { createCanvasClickHandler } from "./handlers/canvasClickHandler";
import { createConnectionModeToggler } from "./handlers/connectionModeHandler";
import Sidebar from "./components/Sidebar";
import SidebarToggle from "./components/SidebarToggle";
import WorkspaceArea from "./components/WorkspaceArea";
import FloatingCameraControls from "./components/FloatingCameraControls";
import "./App.css";

const App = () => {
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);

	// Основные хуки для управления состоянием
	const {
		architectures,
		currentArchitecture,
		currentArchitectureId,
		setCurrentArchitectureId,
		updateCurrentArchitecture,
		createNewArchitecture,
		deleteArchitecture,
		renameArchitecture,
		generateId,
	} = useArchitectures();

	const { localCamera, canvasRef, handleCanvasMouseDown, zoomIn, zoomOut, resetCamera, isPanning } = useCamera(currentArchitecture.camera, updateCurrentArchitecture);

	const {
		selectedClass,
		setSelectedClass,
		draggedClass,
		newClassForm,
		setNewClassForm,
		classes,
		classCategories,
		addCustomClass,
		deleteClass,
		updateClassProperty,
		addProperty,
		addMethod,
		handleMouseDown,
		handleDragMove,
		handleDragEnd,
	} = useClassManagement(currentArchitecture, updateCurrentArchitecture, generateId);

	const {
		isConnecting,
		connectionStart,
		connectionPreview,
		connections,
		enableConnectionMode,
		startConnection,
		updateConnectionPreview,
		finishConnection,
		cancelConnection,
		resetCurrentConnection,
		deleteConnection,
	} = useConnections(currentArchitecture, updateCurrentArchitecture, generateId, localCamera, canvasRef);

	// Глобальная обработка событий
	useGlobalEventHandlers({
		draggedClass,
		isConnecting,
		connectionStart,
		handleDragMove,
		handleDragEnd,
		updateConnectionPreview,
		localCamera,
		canvasRef,
	});

	// Обработчики событий
	const handleClassClick = createClassClickHandler({
		isConnecting,
		connectionStart,
		startConnection,
		finishConnection,
		handleMouseDown,
	});

	const handleCanvasClick = createCanvasClickHandler({
		isConnecting,
		connectionStart,
		resetCurrentConnection,
		setSelectedClass,
	});

	const toggleConnectionMode = createConnectionModeToggler({
		isConnecting,
		cancelConnection,
		enableConnectionMode,
		setSelectedClass,
	});

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
				addCustomClass={() => addCustomClass(localCamera)}
				isConnecting={isConnecting}
				toggleConnectionMode={toggleConnectionMode}
				connectionsCount={connections.length}
				currentArchitecture={currentArchitecture}
				selectedClass={selectedClass}
				updateClassProperty={updateClassProperty}
				addProperty={addProperty}
				addMethod={addMethod}
				deleteClass={(classId) => {
					deleteClass(classId);
					setSelectedClass(null);
				}}
			/>

			<SidebarToggle isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible} />

			<WorkspaceArea
				isSidebarVisible={isSidebarVisible}
				canvasRef={canvasRef}
				localCamera={localCamera}
				isPanning={isPanning}
				handleCanvasMouseDown={handleCanvasMouseDown}
				handleCanvasClick={handleCanvasClick}
				connections={connections}
				connectionPreview={connectionPreview}
				classes={classes}
				isConnecting={isConnecting}
				connectionStart={connectionStart}
				selectedClass={selectedClass}
				handleClassClick={handleClassClick}
				deleteConnection={deleteConnection}
			/>

			<FloatingCameraControls localCamera={localCamera} zoomIn={zoomIn} zoomOut={zoomOut} resetCamera={resetCamera} />
		</div>
	);
};

export default App;
