import { getClassSize } from "./classSize";

/**
 * Утилиты для работы с путями связей между классами
 */

/**
 * Вычисляет реальную высоту блока класса на основе его содержимого
 * @param {Object} classObj - Объект класса
 * @returns {number} Высота в пикселях
 */
const calculateClassHeight = (classObj) => {
	let height = 60; // Базовая высота заголовка (примерно)

	// Добавляем высоту для свойств
	if (classObj.properties && classObj.properties.length > 0) {
		height += 20; // Заголовок "Properties:"
		height += Math.min(classObj.properties.length, 3) * 16; // По 16px на каждое свойство (макс 3)
		if (classObj.properties.length > 3) {
			height += 16; // Строка "...и ещё X"
		}
		height += 16; // Отступы секции
	}

	// Добавляем высоту для методов
	if (classObj.methods && classObj.methods.length > 0) {
		height += 20; // Заголовок "Methods:"
		height += Math.min(classObj.methods.length, 3) * 16; // По 16px на каждый метод (макс 3)
		if (classObj.methods.length > 3) {
			height += 16; // Строка "...и ещё X"
		}
		height += 16; // Отступы секции
	}

	return height;
};

// Функция для вычисления точек подключения на краях класса
const getConnectionPoint = (classObj, targetClassObj, localCamera) => {
	// Получаем реальные размеры классов с учетом зума
	const classSize = getClassSize(classObj, localCamera);
	const targetSize = getClassSize(targetClassObj, localCamera);

	const classWidth = classSize.width * localCamera.zoom;
	const classHeight = classSize.height * localCamera.zoom;

	// Координаты текущего класса (учитываем что transform-origin: top left)
	const classLeft = classObj.position.x * localCamera.zoom + localCamera.offsetX;
	const classTop = classObj.position.y * localCamera.zoom + localCamera.offsetY;
	const classRight = classLeft + classWidth;
	const classBottom = classTop + classHeight;
	const classCenterX = classLeft + classWidth / 2;
	const classCenterY = classTop + classHeight / 2;

	// Координаты целевого класса
	const targetLeft = targetClassObj.position.x * localCamera.zoom + localCamera.offsetX;
	const targetTop = targetClassObj.position.y * localCamera.zoom + localCamera.offsetY;
	const targetWidth = targetSize.width * localCamera.zoom;
	const targetHeight = targetSize.height * localCamera.zoom;
	const targetCenterX = targetLeft + targetWidth / 2;
	const targetCenterY = targetTop + targetHeight / 2;

	// Определяем направление к целевому классу
	const deltaX = targetCenterX - classCenterX;
	const deltaY = targetCenterY - classCenterY;

	let connectionX, connectionY;

	// Используем более точное определение стороны
	const absX = Math.abs(deltaX);
	const absY = Math.abs(deltaY);

	if (absX > absY) {
		// Горизонтальное направление преобладает
		if (deltaX > 0) {
			// Целевой класс справа
			connectionX = classRight;
			connectionY = classCenterY;
		} else {
			// Целевой класс слева
			connectionX = classLeft;
			connectionY = classCenterY;
		}
	} else {
		// Вертикальное направление преобладает
		if (deltaY > 0) {
			// Целевой класс снизу
			connectionX = classCenterX;
			connectionY = classBottom;
		} else {
			// Целевой класс сверху
			connectionX = classCenterX;
			connectionY = classTop;
		}
	}

	return { x: connectionX, y: connectionY };
};

export const calculateConnectionPath = (fromClass, toClass, localCamera) => {
	const fromPoint = getConnectionPoint(fromClass, toClass, localCamera);
	const toPoint = getConnectionPoint(toClass, fromClass, localCamera);

	// Создаем кривые Безье с перпендикулярными входами/выходами
	const deltaX = toPoint.x - fromPoint.x;
	const deltaY = toPoint.y - fromPoint.y;

	// Контрольные точки для перпендикулярных входов/выходов
	const controlOffset = Math.min(Math.abs(deltaX), Math.abs(deltaY)) * 0.5 + 50;

	let control1X, control1Y, control2X, control2Y;

	// Определяем направление точек выхода/входа
	const fromClassSize = getClassSize(fromClass, localCamera);
	const toClassSize = getClassSize(toClass, localCamera);

	const fromClassWidth = fromClassSize.width * localCamera.zoom;
	const fromClassHeight = fromClassSize.height * localCamera.zoom;
	const fromClassLeft = fromClass.position.x * localCamera.zoom + localCamera.offsetX;
	const fromClassTop = fromClass.position.y * localCamera.zoom + localCamera.offsetY;
	const fromClassRight = fromClassLeft + fromClassWidth;
	const fromClassBottom = fromClassTop + fromClassHeight;

	const toClassWidth = toClassSize.width * localCamera.zoom;
	const toClassHeight = toClassSize.height * localCamera.zoom;
	const toClassLeft = toClass.position.x * localCamera.zoom + localCamera.offsetX;
	const toClassTop = toClass.position.y * localCamera.zoom + localCamera.offsetY;
	const toClassRight = toClassLeft + toClassWidth;
	const toClassBottom = toClassTop + toClassHeight;

	// Определяем откуда выходит линия (какая сторона класса)
	if (fromPoint.x === fromClassRight) {
		// Выход справа - контрольная точка идет горизонтально вправо
		control1X = fromPoint.x + controlOffset;
		control1Y = fromPoint.y;
	} else if (fromPoint.x === fromClassLeft) {
		// Выход слева - контрольная точка идет горизонтально влево
		control1X = fromPoint.x - controlOffset;
		control1Y = fromPoint.y;
	} else if (fromPoint.y === fromClassBottom) {
		// Выход снизу - контрольная точка идет вертикально вниз
		control1X = fromPoint.x;
		control1Y = fromPoint.y + controlOffset;
	} else {
		// Выход сверху - контрольная точка идет вертикально вверх
		control1X = fromPoint.x;
		control1Y = fromPoint.y - controlOffset;
	}

	// Определяем куда входит линия (какая сторона целевого класса)
	if (toPoint.x === toClassRight) {
		// Вход справа - контрольная точка идет горизонтально вправо
		control2X = toPoint.x + controlOffset;
		control2Y = toPoint.y;
	} else if (toPoint.x === toClassLeft) {
		// Вход слева - контрольная точка идет горизонтально влево
		control2X = toPoint.x - controlOffset;
		control2Y = toPoint.y;
	} else if (toPoint.y === toClassBottom) {
		// Вход снизу - контрольная точка идет вертикально вниз
		control2X = toPoint.x;
		control2Y = toPoint.y + controlOffset;
	} else {
		// Вход сверху - контрольная точка идет вертикально вверх
		control2X = toPoint.x;
		control2Y = toPoint.y - controlOffset;
	}

	return `M ${fromPoint.x} ${fromPoint.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${toPoint.x} ${toPoint.y}`;
};

/**
 * Вычисляет путь для предварительного просмотра связи
 * @param {Object} connectionPreview - Объект предварительного просмотра с from и to координатами
 * @param {Object} camera - Объект камеры с zoom, offsetX, offsetY
 * @returns {string} SVG path строка
 */
export const calculatePreviewPath = (preview, localCamera) => {
	if (!preview.from || !preview.to) return "";

	// Для предварительного просмотра используем простую линию
	return `M ${preview.from.x * localCamera.zoom + localCamera.offsetX} ${preview.from.y * localCamera.zoom + localCamera.offsetY} L ${preview.to.x} ${preview.to.y}`;
};
