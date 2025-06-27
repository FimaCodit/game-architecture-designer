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
	if (classObj.properties.length > 0) {
		height += 20; // Заголовок "Properties:"
		height += Math.min(classObj.properties.length, 3) * 16; // По 16px на каждое свойство (макс 3)
		if (classObj.properties.length > 3) {
			height += 16; // Строка "...и ещё X"
		}
		height += 16; // Отступы секции
	}

	// Добавляем высоту для методов
	if (classObj.methods.length > 0) {
		height += 20; // Заголовок "Methods:"
		height += Math.min(classObj.methods.length, 3) * 16; // По 16px на каждый метод (макс 3)
		if (classObj.methods.length > 3) {
			height += 16; // Строка "...и ещё X"
		}
		height += 16; // Отступы секции
	}

	return height;
};

/**
 * Вычисляет путь связи между двумя классами
 * @param {Object} fromClass - Исходный класс
 * @param {Object} toClass - Целевой класс
 * @param {Object} camera - Объект камеры с zoom, offsetX, offsetY
 * @returns {string} SVG path строка
 */
export const calculateConnectionPath = (fromClass, toClass, camera) => {
	if (!fromClass || !toClass) return "";

	// Размеры блока класса
	const blockWidth = 192; // min-w-48 = 192px
	const fromBlockHeight = calculateClassHeight(fromClass);
	const toBlockHeight = calculateClassHeight(toClass);

	// Центры классов для определения направления
	const fromCenterX = fromClass.position.x + blockWidth / 2;
	const fromCenterY = fromClass.position.y + fromBlockHeight / 2;
	const toCenterX = toClass.position.x + blockWidth / 2;
	const toCenterY = toClass.position.y + toBlockHeight / 2;

	// Определяем направление связи
	const dx = toCenterX - fromCenterX;
	const dy = toCenterY - fromCenterY;

	let fromX, fromY, toX, toY;
	let controlX1, controlY1, controlX2, controlY2;

	// Если второй класс ниже первого - линия идет от нижнего края первого к верхнему краю второго
	if (dy > Math.abs(dx)) {
		// Вертикальная связь сверху вниз
		fromX = fromCenterX;
		fromY = fromClass.position.y + fromBlockHeight; // нижний край первого класса
		toX = toCenterX;
		toY = toClass.position.y; // верхний край второго класса

		// Кривая Безье для вертикальной связи
		const midY = fromY + (toY - fromY) / 2;
		controlX1 = fromX;
		controlY1 = midY;
		controlX2 = toX;
		controlY2 = midY;
	}
	// Если второй класс выше первого - линия идет от верхнего края первого к нижнему краю второго
	else if (dy < -Math.abs(dx)) {
		// Вертикальная связь снизу вверх
		fromX = fromCenterX;
		fromY = fromClass.position.y; // верхний край первого класса
		toX = toCenterX;
		toY = toClass.position.y + toBlockHeight; // нижний край второго класса

		// Кривая Безье для вертикальной связи
		const midY = fromY + (toY - fromY) / 2;
		controlX1 = fromX;
		controlY1 = midY;
		controlX2 = toX;
		controlY2 = midY;
	}
	// Если второй класс справа от первого - линия идет от правого края первого к левому краю второго
	else if (dx > 0) {
		// Горизонтальная связь слева направо
		fromX = fromClass.position.x + blockWidth; // правый край первого класса
		fromY = fromCenterY;
		toX = toClass.position.x; // левый край второго класса
		toY = toCenterY;

		// Кривая Безье для горизонтальной связи
		const midX = fromX + (toX - fromX) / 2;
		controlX1 = midX;
		controlY1 = fromY;
		controlX2 = midX;
		controlY2 = toY;
	}
	// Если второй класс слева от первого - линия идет от левого края первого к правому краю второго
	else {
		// Горизонтальная связь справа налево
		fromX = fromClass.position.x; // левый край первого класса
		fromY = fromCenterY;
		toX = toClass.position.x + blockWidth; // правый край второго класса
		toY = toCenterY;

		// Кривая Безье для горизонтальной связи
		const midX = fromX + (toX - fromX) / 2;
		controlX1 = midX;
		controlY1 = fromY;
		controlX2 = midX;
		controlY2 = toY;
	}

	// Применяем трансформацию для отображения
	const screenFromX = fromX * camera.zoom + camera.offsetX;
	const screenFromY = fromY * camera.zoom + camera.offsetY;
	const screenToX = toX * camera.zoom + camera.offsetX;
	const screenToY = toY * camera.zoom + camera.offsetY;
	const screenControlX1 = controlX1 * camera.zoom + camera.offsetX;
	const screenControlY1 = controlY1 * camera.zoom + camera.offsetY;
	const screenControlX2 = controlX2 * camera.zoom + camera.offsetX;
	const screenControlY2 = controlY2 * camera.zoom + camera.offsetY;

	// Создаем кубическую кривую Безье (в данном случае прямую линию)
	return `M ${screenFromX} ${screenFromY} C ${screenControlX1} ${screenControlY1}, ${screenControlX2} ${screenControlY2}, ${screenToX} ${screenToY}`;
};

/**
 * Вычисляет путь для предварительного просмотра связи
 * @param {Object} connectionPreview - Объект предварительного просмотра с from и to координатами
 * @param {Object} camera - Объект камеры с zoom, offsetX, offsetY
 * @returns {string} SVG path строка
 */
export const calculatePreviewPath = (connectionPreview, camera) => {
	if (!connectionPreview) return "";

	// Обе координаты теперь в системе классов, применяем трансформацию камеры к обеим
	const fromX = connectionPreview.from.x * camera.zoom + camera.offsetX;
	const fromY = connectionPreview.from.y * camera.zoom + camera.offsetY;
	const toX = connectionPreview.to.x * camera.zoom + camera.offsetX;
	const toY = connectionPreview.to.y * camera.zoom + camera.offsetY;

	return `M ${fromX} ${fromY} L ${toX} ${toY}`;
};
