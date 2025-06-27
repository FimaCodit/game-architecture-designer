import { useState, useEffect } from "react";

export const useClassManagement = (currentArchitecture, updateCurrentArchitecture, generateId) => {
	const [selectedClass, setSelectedClass] = useState(null);
	const [draggedClass, setDraggedClass] = useState(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [newClassForm, setNewClassForm] = useState({ name: "", type: "Gameplay" });

	const classes = currentArchitecture.classes;
	const connections = currentArchitecture.connections;
	const classCategories = currentArchitecture.categories;

	useEffect(() => {
		if (classCategories.length > 0 && !newClassForm.type) {
			setNewClassForm((prev) => ({ ...prev, type: classCategories[0] }));
		}
	}, [classCategories]);

	const addCustomClass = (localCamera) => {
		if (!newClassForm.name.trim()) return false;

		const newClass = {
			id: generateId(),
			name: newClassForm.name,
			type: newClassForm.type,
			position: {
				x: (100 - localCamera.offsetX) / localCamera.zoom,
				y: (100 - localCamera.offsetY) / localCamera.zoom,
			},
			properties: [],
			methods: [],
		};

		const updatedClasses = [...classes, newClass];
		updateCurrentArchitecture({ classes: updatedClasses });
		setNewClassForm({ name: "", type: classCategories[0] });
		return true;
	};

	const deleteClass = (classId) => {
		const updatedClasses = classes.filter((c) => c.id !== classId);
		const updatedConnections = connections.filter((c) => c.from !== classId && c.to !== classId);

		updateCurrentArchitecture({
			classes: updatedClasses,
			connections: updatedConnections,
		});

		if (selectedClass?.id === classId) setSelectedClass(null);
	};

	const updateClassProperty = (classId, field, value) => {
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, [field]: value } : c));
		updateCurrentArchitecture({ classes: updatedClasses });
	};

	const addProperty = (classId) => {
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, properties: [...c.properties, { name: "newProperty", type: "int", access: "private" }] } : c));
		updateCurrentArchitecture({ classes: updatedClasses });
	};

	const addMethod = (classId) => {
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, methods: [...c.methods, { name: "newMethod", params: "", returnType: "void", access: "public" }] } : c));
		updateCurrentArchitecture({ classes: updatedClasses });
	};

	const handleMouseDown = (e, classObj) => {
		e.stopPropagation();
		if (e.target.closest(".no-drag")) return;

		const rect = e.currentTarget.getBoundingClientRect();
		setDragOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
		setDraggedClass(classObj);
		setSelectedClass(classObj);
	};

	const handleDragMove = (e, localCamera, canvasRef) => {
		if (!draggedClass) return;

		const canvasRect = canvasRef.current.getBoundingClientRect();
		const newX = (e.clientX - canvasRect.left - dragOffset.x - localCamera.offsetX) / localCamera.zoom;
		const newY = (e.clientY - canvasRect.top - dragOffset.y - localCamera.offsetY) / localCamera.zoom;

		const updatedClasses = classes.map((c) => (c.id === draggedClass.id ? { ...c, position: { x: Math.max(0, newX), y: Math.max(0, newY) } } : c));
		updateCurrentArchitecture({ classes: updatedClasses });
	};

	const handleDragEnd = () => {
		setDraggedClass(null);
	};

	return {
		selectedClass,
		setSelectedClass,
		draggedClass,
		dragOffset,
		newClassForm,
		setNewClassForm,
		classes,
		connections,
		classCategories,
		addCustomClass,
		deleteClass,
		updateClassProperty,
		addProperty,
		addMethod,
		handleMouseDown,
		handleDragMove,
		handleDragEnd,
	};
};
