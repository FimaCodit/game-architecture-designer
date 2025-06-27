import React from "react";

const SelectionOverlay = ({ selectionRect, isDrawingSelection }) => {
	if (!isDrawingSelection || !selectionRect) return null;

	return (
		<div
			className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20 pointer-events-none z-30"
			style={{
				left: selectionRect.x,
				top: selectionRect.y,
				width: selectionRect.width,
				height: selectionRect.height,
			}}
		/>
	);
};

export default SelectionOverlay;
