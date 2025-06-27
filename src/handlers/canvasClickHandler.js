export const createCanvasClickHandler = ({ isConnecting, connectionStart, resetCurrentConnection, setSelectedClass }) => {
	return (e) => {
		if (isConnecting && connectionStart && !e.target.closest(".class-block")) {
			resetCurrentConnection();
		}

		// Сбрасываем выбранный класс при клике по пустому месту
		if (!e.target.closest(".class-block")) {
			setSelectedClass(null);
		}
	};
};
