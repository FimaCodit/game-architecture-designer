import React from "react";
import { Plus } from "lucide-react";

const ClassCreator = ({ newClassForm, setNewClassForm, classCategories, onAddClass }) => {
	const handleSubmit = async () => {
		if (!newClassForm.name.trim()) {
			console.warn("ClassCreator: Empty class name");
			alert("Введите название класса");
			return;
		}

		if (!newClassForm.type) {
			console.warn("ClassCreator: No class type selected");
			alert("Выберите тип класса");
			return;
		}

		try {
			const result = await onAddClass();

			if (result) {
			} else {
			}
		} catch (error) {
			console.error("ClassCreator: Error adding class:", error);
			alert("Ошибка при создании класса: " + error.message);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (
		<div className="mb-6">
			<h3 className="font-semibold mb-2">Создать класс</h3>
			<input
				type="text"
				placeholder="Название класса"
				value={newClassForm.name}
				onChange={(e) => {
					setNewClassForm((prev) => ({ ...prev, name: e.target.value }));
				}}
				onKeyPress={handleKeyPress}
				className="w-full p-2 border rounded mb-2"
			/>
			<select
				value={newClassForm.type}
				onChange={(e) => {
					setNewClassForm((prev) => ({ ...prev, type: e.target.value }));
				}}
				className="w-full p-2 border rounded mb-2"
			>
				{classCategories.map((category) => (
					<option key={category} value={category}>
						{category}
					</option>
				))}
			</select>
			<button
				onClick={handleSubmit}
				disabled={!newClassForm.name.trim()}
				className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				<Plus size={16} />
				Добавить класс
			</button>
		</div>
	);
};

export default ClassCreator;
