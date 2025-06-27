import React from "react";

const SelectionOverlay = ({ selectionRect, isDrawingSelection }) => {
	if (!isDrawingSelection || !selectionRect) return null;

	return (
		<div
			className="absolute pointer-events-none border-2 border-blue-500 bg-blue-200 bg-opacity-20"
			style={{
				left: selectionRect.x,
				top: selectionRect.y,
				width: selectionRect.width,
				height: selectionRect.height,
				zIndex: 1000,
			}}
		/>
	);
};

export default SelectionOverlay;
