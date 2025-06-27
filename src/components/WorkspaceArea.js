import React from "react";
import ConnectionsLayer from "./ConnectionsLayer";
import ClassesLayer from "./ClassesLayer";

const WorkspaceArea = ({
	isSidebarVisible,
	canvasRef,
	localCamera,
	isPanning,
	handleCanvasMouseDown,
	handleCanvasClick,
	connections,
	connectionPreview,
	classes,
	isConnecting,
	connectionStart,
	selectedClass,
	handleClassClick,
	deleteConnection,
}) => {
	return (
		<div className={`flex-1 relative overflow-hidden transition-all duration-300 ${isSidebarVisible ? "" : "ml-0"}`}>
			<div
				ref={canvasRef}
				className="w-full h-full bg-gray-100 relative overflow-hidden select-none"
				style={{
					backgroundImage: "radial-gradient(circle, #ccc 1px, transparent 1px)",
					backgroundSize: `${20 * localCamera.zoom}px ${20 * localCamera.zoom}px`,
					backgroundPosition: `${localCamera.offsetX}px ${localCamera.offsetY}px`,
					cursor: isPanning ? "grabbing" : "grab",
				}}
				onMouseDown={handleCanvasMouseDown}
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
				/>
			</div>
		</div>
	);
};

export default WorkspaceArea;
