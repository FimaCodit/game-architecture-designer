import React from "react";
import { getDynamicClassColor } from "../utils/classColors";
import ClassBlock from "./ClassBlock";
import EmptyStateMessage from "./EmptyStateMessage";

const ClassesLayer = ({ classes, localCamera, isConnecting, connectionStart, selectedClass, handleClassClick }) => {
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
			{classes.map((classObj) => (
				<ClassBlock
					key={classObj.id}
					classObj={classObj}
					isConnecting={isConnecting}
					connectionStart={connectionStart}
					selectedClass={selectedClass}
					handleClassClick={handleClassClick}
					getDynamicClassColor={getDynamicClassColor}
				/>
			))}

			{classes.length === 0 && <EmptyStateMessage />}
		</div>
	);
};

export default ClassesLayer;
