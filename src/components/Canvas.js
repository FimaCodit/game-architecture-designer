import React, { useEffect } from "react";
import ClassBlock from "./ClassBlock";

const Canvas = ({ canvasRef, classes, localCamera, selectedClass, draggedClass, onCanvasMouseDown, onClassMouseDown, onDeleteClass, onDragMove, onDragEnd }) => {
	useEffect(() => {
		const handleGlobalMouseMove = (e) => {
			if (draggedClass) {
				onDragMove(e, localCamera, canvasRef);
			}
		};

		const handleGlobalMouseUp = () => {
			if (draggedClass) {
				onDragEnd();
			}
		};

		if (draggedClass) {
			document.addEventListener("mousemove", handleGlobalMouseMove);
			document.addEventListener("mouseup", handleGlobalMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleGlobalMouseMove);
				document.removeEventListener("mouseup", handleGlobalMouseUp);
			};
		}
	}, [draggedClass, localCamera, canvasRef, onDragMove, onDragEnd]);

	return (
		<div
			ref={canvasRef}
			className="relative bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden cursor-move"
			style={{
				width: "100%",
				height: "600px",
				backgroundImage: `
          radial-gradient(circle, #d1d5db 1px, transparent 1px)
        `,
				backgroundSize: `${20 * localCamera.zoom}px ${20 * localCamera.zoom}px`,
				backgroundPosition: `${localCamera.offsetX}px ${localCamera.offsetY}px`,
			}}
			onMouseDown={onCanvasMouseDown}
		>
			{classes.map((classObj) => (
				<ClassBlock key={classObj.id} classObj={classObj} localCamera={localCamera} selectedClass={selectedClass} onMouseDown={onClassMouseDown} onDeleteClass={onDeleteClass} />
			))}

			{classes.length === 0 && (
				<div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
					<div className="text-center">
						<div className="text-lg font-semibold mb-2">Диаграмма пуста</div>
						<div className="text-sm">Создайте новый класс, чтобы начать</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Canvas;
