import { useState, useCallback } from "react";

export const useConnections = (currentArchitecture, updateCurrentArchitecture, generateId, localCamera, canvasRef) => {
	const [isConnecting, setIsConnecting] = useState(false);
	const [connectionStart, setConnectionStart] = useState(null);
	const [connectionPreview, setConnectionPreview] = useState(null);
	const [selectedConnectionType, setSelectedConnectionType] = useState("related"); // По умолчанию "связан"

	const connections = currentArchitecture.connections;

	const enableConnectionMode = useCallback(() => {
		setIsConnecting(true);
		setConnectionStart(null);
		setConnectionPreview(null);
	}, []);

	const toggleConnectionMode = useCallback(() => {
		if (isConnecting) {
			setIsConnecting(false);
			setConnectionStart(null);
			setConnectionPreview(null);
		} else {
			setIsConnecting(true);
			setConnectionStart(null);
			setConnectionPreview(null);
		}
	}, [isConnecting]);

	const startConnection = useCallback(
		(classId, position) => {
			setConnectionStart({ classId, position });
			setConnectionPreview(null);
		},
		[isConnecting],
	);

	const finishConnection = useCallback(
		(targetClassId) => {
			if (connectionStart && targetClassId && connectionStart.classId !== targetClassId) {
				// Проверяем, не существует ли уже такая связь
				const existingConnection = connections.find(
					(conn) => (conn.from === connectionStart.classId && conn.to === targetClassId) || (conn.from === targetClassId && conn.to === connectionStart.classId),
				);

				if (!existingConnection) {
					const newConnection = {
						id: generateId(),
						from: connectionStart.classId,
						to: targetClassId,
						type: selectedConnectionType, // Используем выбранный тип связи
						label: "",
					};

					const updatedConnections = [...connections, newConnection];
					updateCurrentArchitecture({ connections: updatedConnections });

					// Выключаем режим создания связей после успешного создания
					setIsConnecting(false);
				} else {
				}
			} else {
			}

			// Сбрасываем состояние
			setConnectionStart(null);
			setConnectionPreview(null);
		},
		[connectionStart, connections, updateCurrentArchitecture, generateId, selectedConnectionType],
	);

	const deleteConnection = useCallback(
		(connectionId) => {
			const updatedConnections = connections.filter((conn) => conn.id !== connectionId);
			updateCurrentArchitecture({ connections: updatedConnections });
		},
		[connections, updateCurrentArchitecture],
	);

	const updateConnectionPreview = useCallback(
		(e) => {
			if (!connectionStart || !canvasRef.current) return;

			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			setConnectionPreview({
				from: connectionStart.position,
				to: { x: mouseX, y: mouseY },
			});
		},
		[connectionStart, canvasRef],
	);

	const changeConnectionType = useCallback((newType) => {
		setSelectedConnectionType(newType);
	}, []);

	const resetCurrentConnection = useCallback(() => {
		setConnectionStart(null);
		setConnectionPreview(null);
	}, []);

	const cancelConnection = useCallback(() => {
		setIsConnecting(false);
		setConnectionStart(null);
		setConnectionPreview(null);
	}, []);

	return {
		connections,
		isConnecting,
		connectionStart,
		connectionPreview,
		selectedConnectionType,
		enableConnectionMode,
		toggleConnectionMode,
		startConnection,
		finishConnection,
		deleteConnection,
		updateConnectionPreview,
		changeConnectionType,
		resetCurrentConnection,
		cancelConnection,
	};
};
