import { useState } from "react";

export const useArchitectures = () => {
	const [architectures, setArchitectures] = useState([
		{
			id: "default",
			name: "Новая архитектура",
			classes: [],
			connections: [],
			categories: ["Gameplay", "System", "UI", "Data", "Network"],
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

	const createNewArchitecture = (name) => {
		if (!name.trim()) return false;

		const newArch = {
			id: generateId(),
			name,
			classes: [],
			connections: [],
			categories: ["Gameplay", "System", "UI", "Data", "Network"],
			camera: { zoom: 1, offsetX: 0, offsetY: 0 },
			createdAt: new Date().toISOString(),
			lastModified: new Date().toISOString(),
		};

		setArchitectures((prev) => [...prev, newArch]);
		setCurrentArchitectureId(newArch.id);
		return true;
	};

	const deleteArchitecture = (archId) => {
		if (architectures.length <= 1) return false;

		setArchitectures((prev) => prev.filter((arch) => arch.id !== archId));

		if (currentArchitectureId === archId) {
			const remainingArchs = architectures.filter((arch) => arch.id !== archId);
			setCurrentArchitectureId(remainingArchs[0].id);
		}
		return true;
	};

	const duplicateArchitecture = (archId) => {
		const archToDuplicate = architectures.find((arch) => arch.id === archId);
		if (!archToDuplicate) return false;

		const duplicatedArch = {
			...archToDuplicate,
			id: generateId(),
			name: `${archToDuplicate.name} (копия)`,
			createdAt: new Date().toISOString(),
			lastModified: new Date().toISOString(),
		};

		setArchitectures((prev) => [...prev, duplicatedArch]);
		return true;
	};

	return {
		architectures,
		currentArchitecture,
		currentArchitectureId,
		setCurrentArchitectureId,
		updateCurrentArchitecture,
		createNewArchitecture,
		deleteArchitecture,
		duplicateArchitecture,
		generateId,
	};
};
