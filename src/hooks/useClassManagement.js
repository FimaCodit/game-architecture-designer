import { useState, useEffect, useCallback } from "react";
import { useClipboard } from "./useClipboard";

export const useClassManagement = (currentArchitecture, updateCurrentArchitecture, generateId) => {
	const [selectedClass, setSelectedClass] = useState(null);
	const [draggedClass, setDraggedClass] = useState(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [newClassForm, setNewClassForm] = useState({ name: "", type: "Gameplay" });

	const [isDraggingMultiple, setIsDraggingMultiple] = useState(false);
	const [draggedMultipleClasses, setDraggedMultipleClasses] = useState([]);
	const [multiDragStartPositions, setMultiDragStartPositions] = useState({});

	const classes = currentArchitecture.classes;
	const classCategories = currentArchitecture.categories;

	// Инициализируем хук для работы с буфером обмена
	const { copiedClass, copyClass, pasteClass, hasCopiedClass } = useClipboard(
		generateId,
		{ zoom: 1, offsetX: 0, offsetY: 0 }, // Временная заглушка, будет обновлена через setLocalCamera
		updateCurrentArchitecture,
		currentArchitecture,
	);

	// Добавляем функцию для обновления localCamera в хуке clipboard
	const [localCamera, setLocalCamera] = useState({ zoom: 1, offsetX: 0, offsetY: 0 });

	// Обработка копирования выбранного класса
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Проверяем, что фокус не на input/textarea
			if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
				return;
			}

			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

			if (isCtrlOrCmd && e.key === "c" && selectedClass) {
				e.preventDefault();
				copyClass(selectedClass);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedClass, copyClass]);

	const addCustomClass = async (localCamera) => {
		if (!newClassForm.name.trim()) {
			return false;
		}

		try {
			const newClass = {
				id: generateId(),
				name: newClassForm.name.trim(),
				type: newClassForm.type || classCategories[0],
				position: {
					x: (100 - localCamera.offsetX) / localCamera.zoom,
					y: (100 - localCamera.offsetY) / localCamera.zoom,
				},
				properties: [],
				methods: [],
			};

			const updatedClasses = [...classes, newClass];
			await updateCurrentArchitecture({ classes: updatedClasses });
			setNewClassForm({ name: "", type: classCategories[0] || "" });

			return true;
		} catch (error) {
			console.error("Error in addCustomClass:", error);
			throw error;
		}
	};

	const deleteClass = (classId) => {
		const updatedClasses = classes.filter((c) => c.id !== classId);
		const updatedConnections = currentArchitecture.connections.filter((c) => c.from !== classId && c.to !== classId);

		updateCurrentArchitecture({
			classes: updatedClasses,
			connections: updatedConnections,
		});

		if (selectedClass?.id === classId) setSelectedClass(null);
	};

	// Новая функция для множественного удаления
	const deleteMultipleClasses = useCallback(
		(classIds) => {
			if (!classIds || classIds.length === 0) return;

			const updatedClasses = classes.filter((c) => !classIds.includes(c.id));
			const updatedConnections = currentArchitecture.connections.filter((c) => !classIds.includes(c.from) && !classIds.includes(c.to));

			updateCurrentArchitecture({
				classes: updatedClasses,
				connections: updatedConnections,
			});

			// Очищаем выбранный класс если он был удален
			if (selectedClass && classIds.includes(selectedClass.id)) {
				setSelectedClass(null);
			}
		},
		[classes, currentArchitecture.connections, updateCurrentArchitecture, selectedClass],
	);

	const updateClassProperty = (classId, field, value) => {
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, [field]: value } : c));
		updateCurrentArchitecture({ classes: updatedClasses });

		// Обновляем выбранный класс если он редактируется
		if (selectedClass?.id === classId) {
			setSelectedClass((prev) => (prev ? { ...prev, [field]: value } : null));
		}
	};

	const addProperty = (classId) => {
		const newProperty = { name: "newProperty", type: "int", access: "private" };
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, properties: [...c.properties, newProperty] } : c));
		updateCurrentArchitecture({ classes: updatedClasses });

		// Обновляем выбранный класс если он редактируется
		if (selectedClass?.id === classId) {
			setSelectedClass((prev) => (prev ? { ...prev, properties: [...prev.properties, newProperty] } : null));
		}
	};

	const addMethod = (classId) => {
		const newMethod = { name: "newMethod", params: "", returnType: "void", access: "public" };
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, methods: [...c.methods, newMethod] } : c));
		updateCurrentArchitecture({ classes: updatedClasses });

		// Обновляем выбранный класс если он редактируется
		if (selectedClass?.id === classId) {
			setSelectedClass((prev) => (prev ? { ...prev, methods: [...prev.methods, newMethod] } : null));
		}
	};

	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	// Исправленный handleMouseDown
	const handleMouseDown = useCallback(
		(e, classObj, selectedClasses = [], isClassSelected = () => false) => {
			if (e.button !== 0) return; // Только левая кнопка мыши

			e.preventDefault();
			e.stopPropagation();

			// Проверяем, является ли этот класс частью множественного выделения
			const isPartOfSelection = selectedClasses.length > 1 && isClassSelected(classObj.id);

			if (isPartOfSelection) {
				// Групповое перетаскивание
				setIsDraggingMultiple(true);
				setDraggedMultipleClasses(selectedClasses);

				// Сохраняем начальные позиции всех выделенных классов
				const startPositions = {};
				selectedClasses.forEach((classId) => {
					const cls = currentArchitecture.classes.find((c) => c.id === classId);
					if (cls) {
						startPositions[classId] = { ...cls.position };
					}
				});
				setMultiDragStartPositions(startPositions);

				setDragStart({
					x: e.clientX,
					y: e.clientY,
				});
			} else {
				// Обычное перетаскивание одного класса
				setDraggedClass(classObj);

				// Правильный расчет offset для одиночного перетаскивания
				const classScreenX = classObj.position.x * localCamera.zoom + localCamera.offsetX;
				const classScreenY = classObj.position.y * localCamera.zoom + localCamera.offsetY;

				setDragStart({
					x: e.clientX - classScreenX,
					y: e.clientY - classScreenY,
				});
			}

			setSelectedClass(classObj);
		},
		[currentArchitecture, localCamera, setSelectedClass],
	);

	// Исправленный handleDragMove
	const handleDragMove = useCallback(
		(e) => {
			if (isDraggingMultiple && draggedMultipleClasses.length > 0) {
				// Групповое перемещение
				const deltaX = (e.clientX - dragStart.x) / localCamera.zoom;
				const deltaY = (e.clientY - dragStart.y) / localCamera.zoom;

				const updatedClasses = currentArchitecture.classes.map((cls) => {
					if (draggedMultipleClasses.includes(cls.id)) {
						const startPos = multiDragStartPositions[cls.id];
						if (startPos) {
							return {
								...cls,
								position: {
									x: startPos.x + deltaX,
									y: startPos.y + deltaY,
								},
							};
						}
					}
					return cls;
				});

				updateCurrentArchitecture({ classes: updatedClasses });
			} else if (draggedClass) {
				// Обычное перемещение одного класса
				const newX = (e.clientX - dragStart.x - localCamera.offsetX) / localCamera.zoom;
				const newY = (e.clientY - dragStart.y - localCamera.offsetY) / localCamera.zoom;

				const updatedClasses = currentArchitecture.classes.map((cls) =>
					cls.id === draggedClass.id
						? {
								...cls,
								position: { x: newX, y: newY },
						  }
						: cls,
				);

				updateCurrentArchitecture({ classes: updatedClasses });
			}
		},
		[isDraggingMultiple, draggedMultipleClasses, multiDragStartPositions, draggedClass, dragStart, localCamera, currentArchitecture, updateCurrentArchitecture],
	);

	// Обновленный handleDragEnd
	const handleDragEnd = useCallback(() => {
		if (isDraggingMultiple) {
			setIsDraggingMultiple(false);
			setDraggedMultipleClasses([]);
			setMultiDragStartPositions({});
		} else {
			setDraggedClass(null);
		}
		setDragStart({ x: 0, y: 0 });
	}, [isDraggingMultiple]);

	// Функция для обновления камеры (будет вызываться из App)
	const updateLocalCamera = (camera) => {
		setLocalCamera(camera);
	};

	return {
		selectedClass,
		setSelectedClass,
		draggedClass,
		isDraggingMultiple,
		draggedMultipleClasses,
		dragOffset,
		newClassForm,
		setNewClassForm,
		classes,
		classCategories,
		addCustomClass,
		deleteClass,
		deleteMultipleClasses, // Добавляем новую функцию
		updateClassProperty,
		addProperty,
		addMethod,
		handleMouseDown,
		handleDragMove,
		handleDragEnd,
		copyClass,
		pasteClass,
		hasCopiedClass,
		copiedClass,
		updateLocalCamera,
	};
};
