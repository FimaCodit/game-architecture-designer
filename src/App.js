import React from "react";
import { useArchitectures } from "./hooks/useArchitectures";
import { useCamera } from "./hooks/useCamera";
import { useClassManagement } from "./hooks/useClassManagement";
import ArchitectureManager from "./components/ArchitectureManager";
import CategoryManagement from "./components/CategoryManagement";
import ClassCreator from "./components/ClassCreator";
import CameraControls from "./components/CameraControls";
import ClassDetails from "./components/ClassDetails";
import ExportControls from "./components/ExportControls";
import Canvas from "./components/Canvas";

const App = () => {
	// Основные хуки для управления состоянием
	const {
		architectures,
		currentArchitecture,
		currentArchitectureId,
		setCurrentArchitectureId,
		updateCurrentArchitecture,
		createNewArchitecture,
		deleteArchitecture,
		duplicateArchitecture,
		generateId,
	} = useArchitectures();

	const { localCamera, canvasRef, handleCanvasMouseDown, zoomIn, zoomOut, resetCamera } = useCamera(currentArchitecture.camera, updateCurrentArchitecture);

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

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Архитектор игровых систем</h1>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Левая панель управления */}
					<div className="lg:col-span-1 space-y-4">
						<ArchitectureManager
							architectures={architectures}
							currentArchitectureId={currentArchitectureId}
							setCurrentArchitectureId={setCurrentArchitectureId}
							createNewArchitecture={createNewArchitecture}
							deleteArchitecture={deleteArchitecture}
							duplicateArchitecture={duplicateArchitecture}
						/>

						<CategoryManagement classCategories={classCategories} classes={classes} updateCurrentArchitecture={updateCurrentArchitecture} />

						<ClassCreator newClassForm={newClassForm} setNewClassForm={setNewClassForm} classCategories={classCategories} onAddClass={() => addCustomClass(localCamera)} />

						<CameraControls localCamera={localCamera} zoomIn={zoomIn} zoomOut={zoomOut} resetCamera={resetCamera} />

						<ExportControls currentArchitecture={currentArchitecture} />
					</div>

					{/* Центральная область - Canvas */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-lg p-4">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold">{currentArchitecture.name}</h2>
								<div className="text-sm text-gray-500">Классов: {classes.length}</div>
							</div>

							<Canvas
								canvasRef={canvasRef}
								classes={classes}
								localCamera={localCamera}
								selectedClass={selectedClass}
								draggedClass={draggedClass}
								onCanvasMouseDown={handleCanvasMouseDown}
								onClassMouseDown={handleMouseDown}
								onDeleteClass={deleteClass}
								onDragMove={handleDragMove}
								onDragEnd={handleDragEnd}
							/>
						</div>
					</div>

					{/* Правая панель - Детали класса */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-lg p-4 h-fit">
							<ClassDetails
								selectedClass={selectedClass}
								classCategories={classCategories}
								onUpdateProperty={updateClassProperty}
								onAddProperty={addProperty}
								onAddMethod={addMethod}
								onDeleteClass={(classId) => {
									deleteClass(classId);
									setSelectedClass(null);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
