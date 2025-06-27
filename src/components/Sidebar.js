import React from "react";
import ArchitectureManager from "./ArchitectureManager";
import CategoryManagement from "./CategoryManagement";
import ClassCreator from "./ClassCreator";
import ClassDetails from "./ClassDetails";
import ExportControls from "./ExportControls";
import ConnectionControls from "./ConnectionControls";

const Sidebar = ({
	isVisible,
	architectures,
	currentArchitectureId,
	setCurrentArchitectureId,
	createNewArchitecture,
	deleteArchitecture,
	renameArchitecture,
	classCategories,
	classes,
	updateCurrentArchitecture,
	newClassForm,
	setNewClassForm,
	addCustomClass,
	isConnecting,
	toggleConnectionMode,
	connectionsCount,
	currentArchitecture,
	localCamera,
	zoomIn,
	zoomOut,
	resetCamera,
	selectedClass,
	updateClassProperty,
	addProperty,
	addMethod,
	deleteClass,
}) => {
	return (
		<div className={`bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ${isVisible ? "w-80 p-4" : "w-0 p-0"}`}>
			<div className={`${isVisible ? "block" : "hidden"}`}>
				<ArchitectureManager
					architectures={architectures}
					currentArchitectureId={currentArchitectureId}
					setCurrentArchitectureId={setCurrentArchitectureId}
					createNewArchitecture={createNewArchitecture}
					deleteArchitecture={deleteArchitecture}
					renameArchitecture={renameArchitecture}
				/>

				<h2 className="text-xl font-bold mb-4">Конструктор архитектуры</h2>

				<CategoryManagement classCategories={classCategories} classes={classes} updateCurrentArchitecture={updateCurrentArchitecture} />

				<ClassCreator newClassForm={newClassForm} setNewClassForm={setNewClassForm} classCategories={classCategories} onAddClass={addCustomClass} />

				<ConnectionControls isConnecting={isConnecting} onToggleConnectionMode={toggleConnectionMode} connectionsCount={connectionsCount} />

				<ExportControls currentArchitecture={currentArchitecture} />

				<ClassDetails
					selectedClass={selectedClass}
					classCategories={classCategories}
					onUpdateProperty={updateClassProperty}
					onAddProperty={addProperty}
					onAddMethod={addMethod}
					onDeleteClass={deleteClass}
				/>
			</div>
		</div>
	);
};

export default Sidebar;
