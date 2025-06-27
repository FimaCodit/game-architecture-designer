import React from "react";
import ClassBlock from "./ClassBlock"; // Добавляем импорт
import { getDynamicClassColor } from "../utils/classColors";
import EmptyStateMessage from "./EmptyStateMessage";

const ClassesLayer = ({
	classes,
	localCamera,
	isConnecting,
	connectionStart,
	selectedClass,
	handleClassClick,
	currentArchitecture,
	forceRender,
	selectedClasses = [],
	isClassSelected = () => false,
}) => {
	const customColors = currentArchitecture?.customCategoryColors || {};

	return (
		<>
			{classes.map((classObj) => {
				const isSelected = selectedClass?.id === classObj.id || isClassSelected(classObj.id);

				return (
					<ClassBlock
						key={`${classObj.id}-${forceRender}`}
						classObj={classObj}
						isConnecting={isConnecting}
						connectionStart={connectionStart}
						selectedClass={selectedClass}
						handleClassClick={(e) => handleClassClick(e, classObj, selectedClasses, isClassSelected)}
						getDynamicClassColor={(type) => getDynamicClassColor(type, customColors)}
						isSelected={isSelected}
						localCamera={localCamera}
					/>
				);
			})}

			{classes.length === 0 && <EmptyStateMessage />}
		</>
	);
};

export default ClassesLayer;
