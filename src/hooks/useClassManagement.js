import { useState, useEffect } from "react";

export const useClassManagement = (currentArchitecture, updateCurrentArchitecture, generateId) => {
	const [selectedClass, setSelectedClass] = useState(null);
	const [draggedClass, setDraggedClass] = useState(null);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [newClassForm, setNewClassForm] = useState({ name: "", type: "Gameplay" });

	const classes = currentArchitecture.classes;
	const classCategories = currentArchitecture.categories;

	useEffect(() => {
		if (classCategories.length > 0 && !newClassForm.type) {
			setNewClassForm((prev) => ({ ...prev, type: classCategories[0] }));
		}
	}, [classCategories]);

	const addCustomClass = async (localCamera) => {
		console.log("useClassManagement: addCustomClass called");
		console.log("newClassForm:", newClassForm);
		console.log("localCamera:", localCamera);
		console.log("classCategories:", classCategories);
		console.log("classes count before:", classes.length);

		if (!newClassForm.name.trim()) {
			console.warn("useClassManagement: Empty class name");
			return false;
		}

		try {
			const newClass = {
				id: generateId(),
				name: newClassForm.name.trim(),
				type: newClassForm.type || classCategories[0],
				position: {
					x: (100 - localCamera.offsetX) / localCamera.zoom,
					y: (100 - localCamera.offsetY) / localCamera.zoom,
				},
				properties: [],
				methods: [],
			};

			console.log("useClassManagement: Creating new class:", newClass);

			const updatedClasses = [...classes, newClass];
			console.log("useClassManagement: Updated classes array length:", updatedClasses.length);

			console.log("useClassManagement: Calling updateCurrentArchitecture...");
			await updateCurrentArchitecture({ classes: updatedClasses });
			console.log("useClassManagement: updateCurrentArchitecture completed");

			console.log("useClassManagement: Resetting form...");
			setNewClassForm({ name: "", type: classCategories[0] || "" });
			console.log("useClassManagement: Form reset completed");

			return true;
		} catch (error) {
			console.error("useClassManagement: Error in addCustomClass:", error);
			throw error;
		}
	};

	const deleteClass = (classId) => {
		const updatedClasses = classes.filter((c) => c.id !== classId);
		const updatedConnections = currentArchitecture.connections.filter((c) => c.from !== classId && c.to !== classId);

		updateCurrentArchitecture({
			classes: updatedClasses,
			connections: updatedConnections,
		});

		if (selectedClass?.id === classId) setSelectedClass(null);
	};

	const updateClassProperty = (classId, field, value) => {
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, [field]: value } : c));
		updateCurrentArchitecture({ classes: updatedClasses });

		// Обновляем выбранный класс если он редактируется
		if (selectedClass?.id === classId) {
			setSelectedClass((prev) => (prev ? { ...prev, [field]: value } : null));
		}
	};

	const addProperty = (classId) => {
		const newProperty = { name: "newProperty", type: "int", access: "private" };
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, properties: [...c.properties, newProperty] } : c));
		updateCurrentArchitecture({ classes: updatedClasses });

		// Обновляем выбранный класс если он редактируется
		if (selectedClass?.id === classId) {
			setSelectedClass((prev) => (prev ? { ...prev, properties: [...prev.properties, newProperty] } : null));
		}
	};

	const addMethod = (classId) => {
		const newMethod = { name: "newMethod", params: "", returnType: "void", access: "public" };
		const updatedClasses = classes.map((c) => (c.id === classId ? { ...c, methods: [...c.methods, newMethod] } : c));
		updateCurrentArchitecture({ classes: updatedClasses });

		// Обновляем выбранный класс если он редактируется
		if (selectedClass?.id === classId) {
			setSelectedClass((prev) => (prev ? { ...prev, methods: [...prev.methods, newMethod] } : null));
		}
	};

	const handleMouseDown = (e, classObj) => {
		e.stopPropagation();
		e.preventDefault();
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
		if (!draggedClass || !canvasRef.current) return;

		const canvasRect = canvasRef.current.getBoundingClientRect();
		const newX = (e.clientX - canvasRect.left - dragOffset.x - localCamera.offsetX) / localCamera.zoom;
		const newY = (e.clientY - canvasRect.top - dragOffset.y - localCamera.offsetY) / localCamera.zoom;

		const updatedClasses = classes.map((c) => (c.id === draggedClass.id ? { ...c, position: { x: newX, y: newY } } : c));
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
