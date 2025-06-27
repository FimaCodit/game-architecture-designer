export const createCanvasClickHandler = ({ isConnecting, connectionStart, resetCurrentConnection, setSelectedClass, clearSelection, isSelectionMode, startSelection }) => {
	return (e) => {
		// Если режим выделения активен, начинаем выделение
		if (isSelectionMode) {
			const started = startSelection(e);
			if (started) {
				return;
			}
		}

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
