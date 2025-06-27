import { useEffect, useCallback } from "react";

export const useGlobalEventHandlers = ({
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
}) => {
	const handleMouseMove = useCallback(
		(e) => {
			// Обработка перетаскивания классов (одиночного или группового)
			if (draggedClass || (isDraggingMultiple && draggedMultipleClasses?.length > 0)) {
				handleDragMove(e);
			}

			// Обработка предварительного просмотра связи
			if (isConnecting && connectionStart) {
				updateConnectionPreview(e);
			}
		},
		[draggedClass, isDraggingMultiple, draggedMultipleClasses, isConnecting, connectionStart, handleDragMove, updateConnectionPreview],
	);

	const handleMouseUp = useCallback(() => {
		// Завершаем перетаскивание если оно активно
		if (draggedClass || (isDraggingMultiple && draggedMultipleClasses?.length > 0)) {
			handleDragEnd();
		}
	}, [draggedClass, isDraggingMultiple, draggedMultipleClasses, handleDragEnd]);

	// Глобальные обработчики событий мыши
	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	// Обработчики для предотвращения выделения текста во время перетаскивания
	useEffect(() => {
		if (draggedClass || (isDraggingMultiple && draggedMultipleClasses?.length > 0)) {
			document.body.style.userSelect = "none";
			document.body.style.cursor = "grabbing";
		} else {
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
		}

		return () => {
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
		};
	}, [draggedClass, isDraggingMultiple, draggedMultipleClasses]);
};
