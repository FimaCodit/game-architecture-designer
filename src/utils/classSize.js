/**
 * Утилиты для расчета реальных размеров классов
 */

/**
 * Получает реальные размеры класса из DOM
 * @param {string} classId - ID класса
 * @param {Object} camera - Объект камеры с зумом
 * @returns {Object} { width, height } или null если элемент не найден
 */
export const getClassSizeFromDOM = (classId, camera = { zoom: 1 }) => {
	const element = document.querySelector(`[data-class-id="${classId}"]`);
	if (!element) {
		return null;
	}

	const rect = element.getBoundingClientRect();

	// Возвращаем размеры без учета зума, так как зум применяется отдельно в расчетах связей
	return {
		width: rect.width / camera.zoom,
		height: rect.height / camera.zoom,
	};
};

/**
 * Вычисляет размеры класса на основе содержимого (fallback)
 * @param {Object} classObj - Объект класса
 * @returns {Object} { width, height }
 */
export const calculateClassSize = (classObj) => {
	// Базовые размеры (соответствуют CSS min-w-48)
	let width = 192; // min-w-48 в Tailwind = 12rem = 192px
	let height = 60; // Базовая высота заголовка

	if (!classObj) {
		return { width, height };
	}

	// Вычисляем высоту более точно
	height = 48; // Заголовок с названием класса и типом

	// Добавляем высоту для свойств
	if (classObj.properties && classObj.properties.length > 0) {
		height += 28; // Заголовок "Properties:" с отступами
		const visibleProps = Math.min(classObj.properties.length, 3);
		height += visibleProps * 20; // По 20px на каждое свойство
		if (classObj.properties.length > 3) {
			height += 20; // Строка "...и ещё X"
		}
		height += 8; // Нижний отступ секции
	}

	// Добавляем высоту для методов
	if (classObj.methods && classObj.methods.length > 0) {
		height += 28; // Заголовок "Methods:" с отступами
		const visibleMethods = Math.min(classObj.methods.length, 3);
		height += visibleMethods * 20; // По 20px на каждый метод
		if (classObj.methods.length > 3) {
			height += 20; // Строка "...и ещё X"
		}
		height += 12; // Нижний отступ секции
	}

	// Минимальная высота
	height = Math.max(height, 80);

	return { width, height };
};

/**
 * Получает размеры класса (сначала из DOM, потом fallback расчет)
 * @param {Object} classObj - Объект класса
 * @param {Object} camera - Объект камеры с зумом
 * @returns {Object} { width, height }
 */
export const getClassSize = (classObj, camera = { zoom: 1 }) => {
	if (!classObj || !classObj.id) {
		return calculateClassSize(classObj);
	}

	// Пытаемся получить размеры из DOM с учетом зума
	const domSize = getClassSizeFromDOM(classObj.id, camera);
	if (domSize && domSize.width > 0 && domSize.height > 0) {
		return domSize;
	}

	// Если не удалось из DOM, используем расчет
	return calculateClassSize(classObj);
};
