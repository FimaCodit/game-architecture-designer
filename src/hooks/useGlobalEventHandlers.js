import { useEffect } from "react";

export const useGlobalEventHandlers = ({ draggedClass, isConnecting, connectionStart, handleDragMove, handleDragEnd, updateConnectionPreview, localCamera, canvasRef }) => {
	useEffect(() => {
		const handleGlobalMouseMove = (e) => {
			if (draggedClass) {
				handleDragMove(e, localCamera, canvasRef);
			}
			if (isConnecting && connectionStart) {
				updateConnectionPreview({ x: e.clientX, y: e.clientY });
			}
		};

		const handleGlobalMouseUp = () => {
			if (draggedClass) {
				handleDragEnd();
			}
		};

		if (draggedClass || (isConnecting && connectionStart)) {
			document.addEventListener("mousemove", handleGlobalMouseMove);
			document.addEventListener("mouseup", handleGlobalMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleGlobalMouseMove);
				document.removeEventListener("mouseup", handleGlobalMouseUp);
			};
		}
	}, [draggedClass, isConnecting, connectionStart, handleDragMove, handleDragEnd, updateConnectionPreview, localCamera, canvasRef]);
};
