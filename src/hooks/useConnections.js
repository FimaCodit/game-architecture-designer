import { useState, useCallback } from "react";

export const useConnections = (currentArchitecture, updateCurrentArchitecture, generateId, localCamera, canvasRef) => {
	const [isConnecting, setIsConnecting] = useState(false);
	const [connectionStart, setConnectionStart] = useState(null);
	const [connectionPreview, setConnectionPreview] = useState(null);

	const connections = currentArchitecture.connections;

	const enableConnectionMode = useCallback(() => {
		setIsConnecting(true);
		setConnectionStart(null);
		setConnectionPreview(null);
	}, []);

	const startConnection = useCallback(
		(classId, position) => {
			console.log("startConnection вызван", { classId, position, currentIsConnecting: isConnecting });
			setConnectionStart({ classId, position });
			setConnectionPreview(null);
		},
		[isConnecting],
	);

	const finishConnection = useCallback(
		(targetClassId) => {
			console.log("finishConnection вызван", {
				targetClassId,
				connectionStart,
				hasConnectionStart: !!connectionStart,
				sameClass: connectionStart?.classId === targetClassId,
				connectionsLength: connections.length,
			});

			if (connectionStart && targetClassId && connectionStart.classId !== targetClassId) {
				// Проверяем, не существует ли уже такая связь
				const existingConnection = connections.find(
					(conn) => (conn.from === connectionStart.classId && conn.to === targetClassId) || (conn.from === targetClassId && conn.to === connectionStart.classId),
				);

				console.log("Проверка существующих связей", {
					existingConnection: !!existingConnection,
					connectionsCount: connections.length,
					fromId: connectionStart.classId,
					toId: targetClassId,
				});

				if (!existingConnection) {
					const newConnection = {
						id: generateId(),
						from: connectionStart.classId,
						to: targetClassId,
						type: "association",
						label: "",
					};

					console.log("СОЗДАЕМ НОВУЮ СВЯЗЬ", newConnection);
					const updatedConnections = [...connections, newConnection];
					updateCurrentArchitecture({ connections: updatedConnections });
					console.log("Связь добавлена, новое количество:", updatedConnections.length);

					// Выключаем режим создания связей после успешного создания
					setIsConnecting(false);
				} else {
					console.log("Связь уже существует");
				}
			} else {
				console.log("НЕ МОЖЕМ создать связь:", {
					hasConnectionStart: !!connectionStart,
					targetClassId,
					sameClass: connectionStart?.classId === targetClassId,
				});
			}

			// Сбрасываем состояние создания связи
			setConnectionStart(null);
			setConnectionPreview(null);
		},
		[connectionStart, connections, updateCurrentArchitecture, generateId],
	);

	const cancelConnection = useCallback(() => {
		setIsConnecting(false);
		setConnectionStart(null);
		setConnectionPreview(null);
	}, []);

	const deleteConnection = useCallback(
		(connectionId) => {
			const updatedConnections = connections.filter((conn) => conn.id !== connectionId);
			updateCurrentArchitecture({ connections: updatedConnections });
		},
		[connections, updateCurrentArchitecture],
	);

	const resetCurrentConnection = useCallback(() => {
		setConnectionStart(null);
		setConnectionPreview(null);
	}, []);

	const updateConnectionPreview = useCallback(
		(mousePosition) => {
			if (connectionStart && localCamera && canvasRef?.current) {
				// Преобразуем координаты мыши в систему координат классов
				const canvasRect = canvasRef.current.getBoundingClientRect();

				// Применяем обратную трансформацию
				const canvasX = (mousePosition.x - canvasRect.left - localCamera.offsetX) / localCamera.zoom;
				const canvasY = (mousePosition.y - canvasRect.top - localCamera.offsetY) / localCamera.zoom;

				setConnectionPreview({
					from: {
						x: connectionStart.position.x,
						y: connectionStart.position.y,
					},
					to: {
						x: canvasX,
						y: canvasY,
					},
				});
			}
		},
		[connectionStart, localCamera, canvasRef],
	);

	return {
		isConnecting,
		connectionStart,
		connectionPreview,
		connections,
		enableConnectionMode,
		startConnection,
		finishConnection,
		cancelConnection,
		resetCurrentConnection,
		deleteConnection,
		updateConnectionPreview,
	};
};
