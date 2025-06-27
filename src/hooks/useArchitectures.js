import { useState, useCallback } from "react";

export const useArchitectures = () => {
	const [architectures, setArchitectures] = useState([
		{
			id: "default",
			name: "Новая архитектура",
			classes: [],
			connections: [],
			categories: ["Gameplay", "UI"],
			camera: { zoom: 1, offsetX: 0, offsetY: 0 },
			createdAt: new Date().toISOString(),
			lastModified: new Date().toISOString(),
		},
	]);

	const [currentArchitectureId, setCurrentArchitectureId] = useState("default");

	const generateId = () => Math.random().toString(36).substr(2, 9);

	const currentArchitecture = architectures.find((arch) => arch.id === currentArchitectureId) || architectures[0];

	const updateCurrentArchitecture = (updates) => {
		setArchitectures((prev) => prev.map((arch) => (arch.id === currentArchitectureId ? { ...arch, ...updates, lastModified: new Date().toISOString() } : arch)));
	};

	const createNewArchitecture = useCallback(
		(name = "Новая архитектура") => {
			const newArchitecture = {
				id: generateId(),
				name: name,
				classes: [],
				connections: [],
				categories: ["Gameplay", "System", "UI", "Data", "Network"],
				camera: { zoom: 1, offsetX: 0, offsetY: 0 },
			};

			const updatedArchitectures = [...architectures, newArchitecture];
			setArchitectures(updatedArchitectures);
			setCurrentArchitectureId(newArchitecture.id);
			localStorage.setItem("architectures", JSON.stringify(updatedArchitectures));
		},
		[architectures, generateId],
	);

	const deleteArchitecture = (archId) => {
		if (architectures.length <= 1) return false;

		setArchitectures((prev) => prev.filter((arch) => arch.id !== archId));

		if (currentArchitectureId === archId) {
			const remainingArchs = architectures.filter((arch) => arch.id !== archId);
			setCurrentArchitectureId(remainingArchs[0].id);
		}
		return true;
	};

	const renameArchitecture = useCallback((archId, newName) => {
		setArchitectures((prev) => prev.map((arch) => (arch.id === archId ? { ...arch, name: newName.trim() || arch.name, lastModified: new Date().toISOString() } : arch)));
	}, []);

	return {
		architectures,
		currentArchitecture,
		currentArchitectureId,
		setCurrentArchitectureId,
		updateCurrentArchitecture,
		createNewArchitecture,
		deleteArchitecture,
		renameArchitecture,
		generateId,
	};
};
