export const createCanvasClickHandler = ({ isConnecting, connectionStart, resetCurrentConnection, setSelectedClass, clearSelection }) => {
	return (e) => {
		if (isConnecting && connectionStart) {
			// В режиме создания связей ничего не делаем
			return;
		}

		// Снимаем выделение класса и очищаем множественное выделение
		setSelectedClass(null);
		if (clearSelection) {
			clearSelection();
		}

		// Отменяем создание связи если оно было начато
		if (isConnecting) {
			resetCurrentConnection();
		}
	};
};
