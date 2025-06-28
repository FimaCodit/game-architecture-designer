import { useState, useCallback, useEffect } from "react";
import { getClassSize } from "../utils/classSize";

export const useMultiSelection = (classes, localCamera, canvasRef) => {
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedClasses, setSelectedClasses] = useState([]);
	const [selectionRect, setSelectionRect] = useState(null);
	const [isDrawingSelection, setIsDrawingSelection] = useState(false);
	const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });

	// Проверяем нажата ли клавиша Cmd/Ctrl
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Игнорируем если фокус в input/textarea
			if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

			if (isCtrlOrCmd && !isSelectionMode) {
				setIsSelectionMode(true);
			}

			// Обработка клавиши Delete для множественного выделения
			if (e.key === "Delete" && selectedClasses.length > 0) {
				e.preventDefault();
				const confirmMessage = `Удалить ${selectedClasses.length} ${selectedClasses.length === 1 ? "класс" : selectedClasses.length < 5 ? "класса" : "классов"}?`;
				if (window.confirm(confirmMessage)) {
					// Этот обработчик будет использован в компоненте, который имеет доступ к deleteMultipleClasses
					const event = new CustomEvent("deleteSelectedClasses", { detail: selectedClasses });
					document.dispatchEvent(event);
				}
			}
		};

		const handleKeyUp = (e) => {
			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const wasCtrlOrCmd = isMac ? !e.metaKey : !e.ctrlKey;

			if (wasCtrlOrCmd && isSelectionMode) {
				setIsSelectionMode(false);
				setIsDrawingSelection(false);
				setSelectionRect(null);
			}
		};

		document.addEventListener("keydown", handleKeyDown, true);
		document.addEventListener("keyup", handleKeyUp, true);

		return () => {
			document.removeEventListener("keydown", handleKeyDown, true);
			document.removeEventListener("keyup", handleKeyUp, true);
		};
	}, [isSelectionMode, selectedClasses]);

	// Начало выделения области
	const startSelection = useCallback(
		(e) => {
			if (!isSelectionMode || e.button !== 0) return false; // Только левая кнопка мыши

			e.preventDefault();
			e.stopPropagation();

			const rect = canvasRef.current.getBoundingClientRect();
			const startX = e.clientX - rect.left;
			const startY = e.clientY - rect.top;

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
		[isDrawingSelection, selectionStart, canvasRef],
	);

	// Завершение выделения
	const endSelection = useCallback(() => {
		if (!isDrawingSelection || !selectionRect) return;

		// Находим классы, которые попадают в область выделения
		const selectedIds = [];

		classes.forEach((classObj) => {
			// Получаем реальные размеры класса
			const classSize = getClassSize(classObj, localCamera);

			// Вычисляем позицию класса на экране (с учетом трансформации камеры)
			const classX = classObj.position.x * localCamera.zoom + localCamera.offsetX;
			const classY = classObj.position.y * localCamera.zoom + localCamera.offsetY;
			const classWidth = classSize.width * localCamera.zoom;
			const classHeight = classSize.height * localCamera.zoom;

			// Проверяем пересечение прямоугольников на экране
			const isIntersecting =
				classX < selectionRect.x + selectionRect.width && classX + classWidth > selectionRect.x && classY < selectionRect.y + selectionRect.height && classY + classHeight > selectionRect.y;

			if (isIntersecting) {
				selectedIds.push(classObj.id);
			}
		});

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
