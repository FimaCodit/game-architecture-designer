import React from "react";
import { getDynamicClassColor } from "../utils/classColors";
import ClassBlock from "./ClassBlock";
import EmptyStateMessage from "./EmptyStateMessage";

const ClassesLayer = ({ classes, localCamera, isConnecting, connectionStart, selectedClass, handleClassClick, currentArchitecture, forceRender, selectedClasses, isClassSelected }) => {
	const customColors = currentArchitecture?.customCategoryColors || {};

	return (
		<div
			style={{
				transform: `translate(${localCamera.offsetX}px, ${localCamera.offsetY}px) scale(${localCamera.zoom})`,
				transformOrigin: "0 0",
				position: "absolute",
				width: "100%",
				height: "100%",
			}}
		>
			{classes.map((classObj) => {
				const isSelected = isClassSelected(classObj.id);

				// Добавляем отладку
				if (isSelected) {
					console.log(`ClassesLayer: Класс ${classObj.name} должен быть выделен`);
				}

				return (
					<ClassBlock
						key={`${classObj.id}-${forceRender}`} // Используем forceRender в key
						classObj={{
							...classObj,
							position: {
								// НЕ применяем трансформацию - она уже применена к контейнеру
								x: classObj.position.x,
								y: classObj.position.y,
							},
						}}
						isConnecting={isConnecting}
						connectionStart={connectionStart}
						selectedClass={selectedClass}
						handleClassClick={handleClassClick}
						getDynamicClassColor={(type) => getDynamicClassColor(type, customColors)}
						// Добавляем проп для множественного выделения
						isSelected={isSelected}
					/>
				);
			})}

			{classes.length === 0 && <EmptyStateMessage />}
		</div>
	);
};

export default ClassesLayer;
