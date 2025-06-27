export const createClassClickHandler = ({ isConnecting, connectionStart, startConnection, finishConnection, handleMouseDown, selectedClasses = [], isClassSelected = () => false }) => {
	return (e, classObj) => {
		if (isConnecting) {
			if (!connectionStart) {
				const centerX = classObj.position.x + 96;
				const centerY = classObj.position.y + 30;
				startConnection(classObj.id, { x: centerX, y: centerY });
			} else {
				finishConnection(classObj.id);
			}
			return;
		}

		// Передаем информацию о множественном выделении
		handleMouseDown(e, classObj, selectedClasses, isClassSelected);
	};
};
