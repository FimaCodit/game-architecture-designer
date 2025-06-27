import { useState, useCallback, useEffect } from "react";

export const useMultiSelection = (classes, localCamera, canvasRef) => {
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedClasses, setSelectedClasses] = useState([]);
	const [selectionRect, setSelectionRect] = useState(null);
	const [isDrawingSelection, setIsDrawingSelection] = useState(false);
	const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });

	// Проверяем нажата ли клавиша Cmd/Ctrl
	useEffect(() => {
		const handleKeyDown = (e) => {
			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

			if (isCtrlOrCmd && !isSelectionMode) {
				console.log("Selection mode ON");
				setIsSelectionMode(true);
			}
		};

		const handleKeyUp = (e) => {
			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const wasCtrlOrCmd = isMac ? !e.metaKey : !e.ctrlKey;

			if (wasCtrlOrCmd && isSelectionMode) {
				console.log("Selection mode OFF");
				setIsSelectionMode(false);
				setIsDrawingSelection(false);
				setSelectionRect(null);
				// НЕ очищаем selectedClasses - оставляем классы выделенными
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [isSelectionMode]);

	// Начало выделения области
	const startSelection = useCallback(
		(e) => {
			console.log("startSelection called", { isSelectionMode });
			if (!isSelectionMode) return false;

			const rect = canvasRef.current.getBoundingClientRect();
			const startX = e.clientX - rect.left;
			const startY = e.clientY - rect.top;

			console.log("Starting selection at", { startX, startY });

			setSelectionStart({ x: startX, y: startY });
			setIsDrawingSelection(true);
			setSelectionRect({
				x: startX,
				y: startY,
				width: 0,
				height: 0,
			});

			return true;
		},
		[isSelectionMode, canvasRef],
	);

	// Обновление области выделения
	const updateSelection = useCallback(
		(e) => {
			if (!isDrawingSelection) return;

			const rect = canvasRef.current.getBoundingClientRect();
			const currentX = e.clientX - rect.left;
			const currentY = e.clientY - rect.top;

			const width = currentX - selectionStart.x;
			const height = currentY - selectionStart.y;

			setSelectionRect({
				x: width >= 0 ? selectionStart.x : currentX,
				y: height >= 0 ? selectionStart.y : currentY,
				width: Math.abs(width),
				height: Math.abs(height),
			});
		},
		[isDrawingSelection, selectionStart],
	);

	// Завершение выделения
	const endSelection = useCallback(() => {
		if (!isDrawingSelection || !selectionRect) return;

		console.log("endSelection called", { isDrawingSelection, selectionRect });

		// Находим классы, которые попадают в область выделения
		const selectedIds = [];

		classes.forEach((classObj) => {
			const classX = classObj.position.x * localCamera.zoom + localCamera.offsetX;
			const classY = classObj.position.y * localCamera.zoom + localCamera.offsetY;
			const classWidth = 192 * localCamera.zoom; // min-w-48
			const classHeight = 120 * localCamera.zoom; // примерная высота

			// Проверяем пересечение прямоугольников
			const isIntersecting =
				classX < selectionRect.x + selectionRect.width && classX + classWidth > selectionRect.x && classY < selectionRect.y + selectionRect.height && classY + classHeight > selectionRect.y;

			console.log(`Класс ${classObj.name}:`, {
				classX,
				classY,
				classWidth,
				classHeight,
				selectionRect,
				isIntersecting,
			});

			if (isIntersecting) {
				selectedIds.push(classObj.id);
			}
		});

		console.log("Selected classes:", selectedIds);
		setSelectedClasses(selectedIds);
		setIsDrawingSelection(false);
		setSelectionRect(null);
	}, [isDrawingSelection, selectionRect, classes, localCamera]);

	// Очистка выделения
	const clearSelection = useCallback(() => {
		setSelectedClasses([]);
	}, []);

	// Проверка, выделен ли класс
	const isClassSelected = useCallback(
		(classId) => {
			return selectedClasses.includes(classId);
		},
		[selectedClasses],
	);

	return {
		isSelectionMode,
		selectedClasses,
		selectionRect,
		isDrawingSelection,
		startSelection,
		updateSelection,
		endSelection,
		clearSelection,
		isClassSelected,
		hasMultipleSelection: selectedClasses.length > 1,
	};
};
