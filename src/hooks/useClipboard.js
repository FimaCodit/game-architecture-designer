import { useState, useCallback, useEffect } from "react";

export const useClipboard = (generateId, localCamera, updateCurrentArchitecture, currentArchitecture) => {
	const [copiedClass, setCopiedClass] = useState(null);

	const copyClass = useCallback((classObj) => {
		if (!classObj) return;

		setCopiedClass(classObj);
		console.log("Класс скопирован:", classObj.name);
	}, []);

	const pasteClass = useCallback(() => {
		if (!copiedClass) return;

		// Создаем новый класс на основе скопированного
		const newClass = {
			...copiedClass,
			id: generateId(),
			name: `${copiedClass.name}_copy`,
			position: {
				// Смещаем позицию нового класса относительно текущего вида камеры
				x: (100 - localCamera.offsetX) / localCamera.zoom,
				y: (100 - localCamera.offsetY) / localCamera.zoom,
			},
			// Копируем массивы, чтобы они были независимыми
			properties: [...copiedClass.properties],
			methods: [...copiedClass.methods],
		};

		// Добавляем новый класс в архитектуру
		const updatedClasses = [...currentArchitecture.classes, newClass];
		updateCurrentArchitecture({ classes: updatedClasses });

		console.log("Класс вставлен:", newClass.name);
		return newClass;
	}, [copiedClass, generateId, localCamera, currentArchitecture.classes, updateCurrentArchitecture]);

	// Обработка клавиатурных сочетаний
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Проверяем, что фокус не на input/textarea
			if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
				return;
			}

			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

			if (isCtrlOrCmd && e.key === "c") {
				e.preventDefault();
				// Копирование будет обрабатываться через selectedClass
			}

			if (isCtrlOrCmd && e.key === "v") {
				e.preventDefault();
				pasteClass();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [pasteClass]);

	return {
		copiedClass,
		copyClass,
		pasteClass,
		hasCopiedClass: !!copiedClass,
	};
};
