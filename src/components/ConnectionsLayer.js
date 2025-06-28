import React from "react";
import { calculateConnectionPath, calculatePreviewPath } from "../utils/connectionPaths";

const ConnectionsLayer = ({ connections, connectionPreview, classes, localCamera, deleteConnection }) => {
	// Функция для получения стиля линии в зависимости от типа связи
	const getConnectionStyle = (connectionType) => {
		switch (connectionType) {
			case "uses":
				return {
					stroke: "#3b82f6", // синий
					strokeWidth: 2, // Возвращаем исходную толщину
					strokeDasharray: "none",
				};
			case "extends":
				return {
					stroke: "#10b981", // зеленый
					strokeWidth: 2.5, // Возвращаем исходную толщину
					strokeDasharray: "none",
				};
			case "contains":
				return {
					stroke: "#f59e0b", // оранжевый
					strokeWidth: 2, // Возвращаем исходную толщину
					strokeDasharray: "none",
				};
			case "creates":
				return {
					stroke: "#8b5cf6", // фиолетовый
					strokeWidth: 2, // Возвращаем исходную толщину
					strokeDasharray: "5,3",
				};
			case "related":
			default:
				return {
					stroke: "#6b7280", // серый
					strokeWidth: 2, // Возвращаем исходную толщину
					strokeDasharray: "none",
				};
		}
	};

	// Функция для получения текстовой метки типа связи
	const getConnectionLabel = (connectionType) => {
		switch (connectionType) {
			case "uses":
				return "использует";
			case "extends":
				return "наследует";
			case "contains":
				return "содержит";
			case "creates":
				return "создает";
			case "related":
			default:
				return "связан";
		}
	};

	return (
		<svg className="absolute pointer-events-none" style={{ zIndex: 10, left: 0, top: 0, width: "100%", height: "100%", overflow: "visible" }}>
			<defs>
				{/* Тень */}
				<filter id="connectionShadow" x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1" />
				</filter>
			</defs>

			{/* Отрисовка связей */}
			{connections.map((connection) => {
				const fromClass = classes.find((cls) => cls.id === connection.from);
				const toClass = classes.find((cls) => cls.id === connection.to);
				if (!fromClass || !toClass) return null;

				const path = calculateConnectionPath(fromClass, toClass, localCamera);
				const style = getConnectionStyle(connection.type);
				const label = getConnectionLabel(connection.type);
				const pathId = `path-${connection.id}`;

				// Определяем, является ли связь прямой линией
				const fromPoint = calculateConnectionPath.getConnectionPoint ? calculateConnectionPath.getConnectionPoint(fromClass, toClass, localCamera) : null;
				const toPoint = calculateConnectionPath.getConnectionPoint ? calculateConnectionPath.getConnectionPoint(toClass, fromClass, localCamera) : null;

				let isStraightLine = false;
				if (fromPoint && toPoint) {
					const deltaX = Math.abs(toPoint.x - fromPoint.x);
					const deltaY = Math.abs(toPoint.y - fromPoint.y);
					// Считаем линию прямой, если она строго горизонтальная или вертикальная
					isStraightLine = deltaX < 5 || deltaY < 5;
				}

				// Увеличиваем толщину для прямых линий
				const adjustedStrokeWidth = isStraightLine ? Math.max(style.strokeWidth * 2 * localCamera.zoom, 4) : style.strokeWidth * localCamera.zoom;

				return (
					<g key={connection.id}>
						{/* Тень линии */}
						<path
							d={path}
							stroke="rgba(0,0,0,0.1)"
							strokeWidth={(style.strokeWidth + 0.5) * localCamera.zoom}
							fill="none"
							className="pointer-events-none"
							transform="translate(1, 1)"
							strokeDasharray={style.strokeDasharray}
						/>

						{/* Основная линия */}
						<path
							id={pathId}
							d={path}
							stroke={style.stroke}
							strokeWidth={adjustedStrokeWidth}
							fill="none"
							strokeDasharray={style.strokeDasharray}
							className="connection-line pointer-events-auto cursor-pointer"
							style={{ filter: "url(#connectionShadow)" }}
							onClick={(e) => {
								e.stopPropagation();
								if (window.confirm(`Удалить связь "${label}"?`)) {
									deleteConnection(connection.id);
								}
							}}
						/>
					</g>
				);
			})}

			{/* Предварительный просмотр связи */}
			{connectionPreview && (
				<g>
					<path
						d={calculatePreviewPath(connectionPreview, localCamera)}
						stroke="#94a3b8"
						strokeWidth={2 * localCamera.zoom} // Возвращаем исходную толщину для превью
						strokeDasharray={`${6 * localCamera.zoom},${4 * localCamera.zoom}`}
						fill="none"
						className="pointer-events-none preview-line"
						style={{ opacity: 0.8, animation: "dash 1s linear infinite" }}
					/>
					<circle
						cx={connectionPreview.from.x * localCamera.zoom + localCamera.offsetX}
						cy={connectionPreview.from.y * localCamera.zoom + localCamera.offsetY}
						r={3 * localCamera.zoom}
						fill="#22c55e"
						stroke="white"
						strokeWidth={localCamera.zoom}
						className="pointer-events-none"
					/>
				</g>
			)}
		</svg>
	);
};

export default ConnectionsLayer;
