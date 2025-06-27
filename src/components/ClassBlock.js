import React from "react";
import { Trash2 } from "lucide-react";
import { classStyleUtils } from "../utils/classStyleUtils";

const ClassBlock = ({ classObj, localCamera, selectedClass, onMouseDown, onDeleteClass }) => {
	const colorClass = classStyleUtils.getDynamicClassColor(classObj.type);

	return (
		<div
			className={`class-block absolute cursor-move border-2 rounded p-2 shadow-lg select-none ${colorClass} ${selectedClass?.id === classObj.id ? "ring-2 ring-blue-500" : ""}`}
			style={{
				left: classObj.position.x * localCamera.zoom + localCamera.offsetX,
				top: classObj.position.y * localCamera.zoom + localCamera.offsetY,
				transform: `scale(${localCamera.zoom})`,
				transformOrigin: "top left",
				minWidth: "150px",
				zIndex: selectedClass?.id === classObj.id ? 10 : 1,
			}}
			onMouseDown={(e) => onMouseDown(e, classObj)}
		>
			<div className="flex justify-between items-start mb-1">
				<h3 className="font-bold text-xs">{classObj.name}</h3>
				<button
					className="no-drag text-red-500 hover:text-red-700 ml-1"
					onClick={(e) => {
						e.stopPropagation();
						onDeleteClass(classObj.id);
					}}
				>
					<Trash2 size={10} />
				</button>
			</div>

			<div className="text-xs text-gray-600 mb-2">{classObj.type}</div>

			{classObj.properties.length > 0 && (
				<div className="mb-2">
					<div className="text-xs font-semibold text-gray-700">Свойства:</div>
					{classObj.properties.map((prop, idx) => (
						<div key={idx} className="text-xs text-gray-600">
							{prop.access} {prop.type} {prop.name}
						</div>
					))}
				</div>
			)}

			{classObj.methods.length > 0 && (
				<div>
					<div className="text-xs font-semibold text-gray-700">Методы:</div>
					{classObj.methods.map((method, idx) => (
						<div key={idx} className="text-xs text-gray-600">
							{method.access} {method.returnType} {method.name}({method.params})
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ClassBlock;
