export const createClassClickHandler = ({ isConnecting, connectionStart, startConnection, finishConnection, handleMouseDown }) => {
	return (e, classObj) => {
		e.preventDefault();
		e.stopPropagation();

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
		handleMouseDown(e, classObj);
	};
};
