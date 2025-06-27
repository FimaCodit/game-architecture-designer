export const createConnectionModeToggler = ({ isConnecting, cancelConnection, enableConnectionMode, setSelectedClass }) => {
	return () => {
		if (isConnecting) {
			cancelConnection();
		} else {
			enableConnectionMode();
			setSelectedClass(null);
		}
	};
};
