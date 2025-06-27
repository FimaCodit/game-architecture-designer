import React from "react";
import { calculateConnectionPath, calculatePreviewPath } from "../utils/connectionPaths";

const ConnectionsLayer = ({ connections, connectionPreview, classes, localCamera, deleteConnection }) => {
	return (
		<svg className="absolute pointer-events-none" style={{ zIndex: 10, left: 0, top: 0, width: "100%", height: "100%", overflow: "visible" }}>
			<defs>
				<linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
					<stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
				</linearGradient>
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
				return (
					<g key={connection.id}>
						<path d={path} stroke="rgba(0,0,0,0.1)" strokeWidth={2.5 * localCamera.zoom + 1} fill="none" className="pointer-events-none" transform="translate(0, 1)" />
						<path
							d={path}
							stroke="url(#connectionGradient)"
							strokeWidth={2.5 * localCamera.zoom}
							fill="none"
							className="connection-line pointer-events-auto cursor-pointer"
							style={{ filter: "url(#connectionShadow)" }}
							onClick={(e) => {
								e.stopPropagation();
								if (window.confirm("Удалить эту связь?")) {
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
						strokeWidth={2 * localCamera.zoom}
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
