import React from "react";
import { Plus } from "lucide-react";

const ClassCreator = ({ newClassForm, setNewClassForm, classCategories, onAddClass }) => {
	const handleSubmit = () => {
		if (onAddClass()) {
			// Класс успешно добавлен
		}
	};

	return (
		<div className="mb-6">
			<h3 className="font-semibold mb-2">Создать класс</h3>
			<input
				type="text"
				placeholder="Название класса"
				value={newClassForm.name}
				onChange={(e) => setNewClassForm((prev) => ({ ...prev, name: e.target.value }))}
				className="w-full p-2 border rounded mb-2"
			/>
			<select value={newClassForm.type} onChange={(e) => setNewClassForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full p-2 border rounded mb-2">
				{classCategories.map((category) => (
					<option key={category} value={category}>
						{category}
					</option>
				))}
			</select>
			<button onClick={handleSubmit} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2">
				<Plus size={16} />
				Добавить класс
			</button>
		</div>
	);
};

export default ClassCreator;
