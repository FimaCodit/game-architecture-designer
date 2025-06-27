import React from "react";

const CameraControls = ({ localCamera, zoomIn, zoomOut, resetCamera }) => {
	return (
		<div className="mb-4 p-3 bg-gray-50 rounded">
			<h3 className="font-semibold mb-2 text-sm">Управление камерой</h3>
			<div className="text-xs text-gray-600 mb-2">Зум: {Math.round(localCamera.zoom * 100)}%</div>
			<div className="flex gap-2">
				<button onClick={zoomIn} className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600">
					+
				</button>
				<button onClick={resetCamera} className="flex-1 bg-gray-500 text-white py-1 px-2 rounded text-xs hover:bg-gray-600">
					Сброс
				</button>
				<button onClick={zoomOut} className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600">
					-
				</button>
			</div>
			<div className="text-xs text-gray-500 mt-1">
				Колесо мыши - зум
				<br />
				ЛКМ + перетаскивание - панорама
			</div>
		</div>
	);
};

export default CameraControls;
