export const createClassClickHandler = ({ isConnecting, connectionStart, startConnection, finishConnection, handleMouseDown, selectedClasses = [], isClassSelected = () => false, localCamera }) => {
	return (e, classObj) => {
		if (isConnecting) {
			if (!connectionStart) {
				// Вычисляем точку на краю класса в направлении курсора
				const classWidth = 192;
				const classHeight = 120;
				const classScreenX = classObj.position.x * localCamera.zoom + localCamera.offsetX;
				const classScreenY = classObj.position.y * localCamera.zoom + localCamera.offsetY;
				const classRight = classScreenX + classWidth * localCamera.zoom;
				const classBottom = classScreenY + classHeight * localCamera.zoom;
				const classCenterX = classScreenX + (classWidth * localCamera.zoom) / 2;
				const classCenterY = classScreenY + (classHeight * localCamera.zoom) / 2;

				// Получаем позицию мыши
				const rect = e.currentTarget.closest("[ref]")?.getBoundingClientRect() || e.target.getBoundingClientRect();
				const mouseX = e.clientX - rect.left;
				const mouseY = e.clientY - rect.top;

				// Определяем направление к курсору мыши
				const deltaX = mouseX - classCenterX;
				const deltaY = mouseY - classCenterY;

				let connectionX, connectionY;

				// Выбираем ближайшую сторону к курсору
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					// Горизонтальное направление преобладает
					if (deltaX > 0) {
						// Курсор справа - подключаемся к правой стороне
						connectionX = classRight;
						connectionY = classCenterY;
					} else {
						// Курсор слева - подключаемся к левой стороне
						connectionX = classScreenX;
						connectionY = classCenterY;
					}
				} else {
					// Вертикальное направление преобладает
					if (deltaY > 0) {
						// Курсор снизу - подключаемся к нижней стороне
						connectionX = classCenterX;
						connectionY = classBottom;
					} else {
						// Курсор сверху - подключаемся к верхней стороне
						connectionX = classCenterX;
						connectionY = classScreenY;
					}
				}

				startConnection(classObj.id, { x: connectionX, y: connectionY });
			} else {
				finishConnection(classObj.id);
			}
			return;
		}

		handleMouseDown(e, classObj, selectedClasses, isClassSelected);
	};
};
