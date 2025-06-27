import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

const ClassDetails = ({ selectedClass, classCategories, onUpdateProperty, onAddProperty, onAddMethod, onDeleteClass }) => {
	const [editingProperty, setEditingProperty] = useState(null);
	const [editingMethod, setEditingMethod] = useState(null);
	const [editValues, setEditValues] = useState({});

	if (!selectedClass) {
		return null;
	}

	const updateProperty = (field, value) => {
		onUpdateProperty(selectedClass.id, field, value);

		// Обновляем локальное состояние выбранного класса
		if (field === "name") {
			// Эмитируем обновление, чтобы компонент перерендерился с новыми данными
			// selectedClass будет обновлен через пропсы при следующем рендере
		}
	};

	const startEditProperty = (index) => {
		setEditingProperty(index);
		setEditValues(selectedClass.properties[index]);
	};

	const saveProperty = () => {
		const updatedProperties = [...selectedClass.properties];
		updatedProperties[editingProperty] = editValues;
		updateProperty("properties", updatedProperties);
		setEditingProperty(null);
		setEditValues({});
	};

	const cancelEditProperty = () => {
		setEditingProperty(null);
		setEditValues({});
	};

	const deleteProperty = (index) => {
		const updatedProperties = selectedClass.properties.filter((_, i) => i !== index);
		updateProperty("properties", updatedProperties);
	};

	const startEditMethod = (index) => {
		setEditingMethod(index);
		setEditValues(selectedClass.methods[index]);
	};

	const saveMethod = () => {
		const updatedMethods = [...selectedClass.methods];
		updatedMethods[editingMethod] = editValues;
		updateProperty("methods", updatedMethods);
		setEditingMethod(null);
		setEditValues({});
	};

	const cancelEditMethod = () => {
		setEditingMethod(null);
		setEditValues({});
	};

	const deleteMethod = (index) => {
		const updatedMethods = selectedClass.methods.filter((_, i) => i !== index);
		updateProperty("methods", updatedMethods);
	};

	return (
		<div className="mt-6 border-t pt-4">
			<h3 className="font-semibold mb-2">Редактирование: {selectedClass.name}</h3>

			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">Название</label>
				<input
					type="text"
					value={selectedClass.name}
					onChange={(e) => updateProperty("name", e.target.value)}
					className="w-full p-2 border rounded text-sm"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.target.blur();
						}
					}}
				/>
			</div>

			<div className="mb-4">
				<div className="flex justify-between items-center mb-2">
					<label className="text-sm font-medium">Свойства</label>
					<button onClick={() => onAddProperty(selectedClass.id)} className="text-blue-500 hover:text-blue-700">
						<Plus size={14} />
					</button>
				</div>
				<div className="space-y-2 max-h-40 overflow-y-auto">
					{selectedClass.properties.map((prop, idx) => (
						<div key={idx} className="bg-gray-50 p-2 rounded">
							{editingProperty === idx ? (
								<div className="space-y-2">
									<div className="flex gap-2">
										<select
											value={editValues.access || "private"}
											onChange={(e) => setEditValues({ ...editValues, access: e.target.value })}
											className="flex-1 p-1 border rounded text-xs"
										>
											<option value="private">private</option>
											<option value="public">public</option>
											<option value="protected">protected</option>
										</select>
										<input
											type="text"
											value={editValues.type || ""}
											onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
											placeholder="Тип"
											className="flex-1 p-1 border rounded text-xs"
										/>
									</div>
									<div className="flex gap-2">
										<input
											type="text"
											value={editValues.name || ""}
											onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
											placeholder="Название"
											className="flex-1 p-1 border rounded text-xs"
										/>
										<button onClick={saveProperty} className="text-green-600 hover:text-green-800">
											<Check size={12} />
										</button>
										<button onClick={cancelEditProperty} className="text-red-600 hover:text-red-800">
											<X size={12} />
										</button>
									</div>
								</div>
							) : (
								<div className="flex justify-between items-center">
									<span className="text-xs">
										{prop.access} {prop.type} {prop.name}
									</span>
									<div className="flex gap-1">
										<button onClick={() => startEditProperty(idx)} className="text-blue-600 hover:text-blue-800">
											<Edit2 size={10} />
										</button>
										<button onClick={() => deleteProperty(idx)} className="text-red-600 hover:text-red-800">
											<Trash2 size={10} />
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="mb-4">
				<div className="flex justify-between items-center mb-2">
					<label className="text-sm font-medium">Методы</label>
					<button onClick={() => onAddMethod(selectedClass.id)} className="text-blue-500 hover:text-blue-700">
						<Plus size={14} />
					</button>
				</div>
				<div className="space-y-2 max-h-40 overflow-y-auto">
					{selectedClass.methods.map((method, idx) => (
						<div key={idx} className="bg-gray-50 p-2 rounded">
							{editingMethod === idx ? (
								<div className="space-y-2">
									<div className="flex gap-2">
										<select
											value={editValues.access || "public"}
											onChange={(e) => setEditValues({ ...editValues, access: e.target.value })}
											className="flex-1 p-1 border rounded text-xs"
										>
											<option value="public">public</option>
											<option value="private">private</option>
											<option value="protected">protected</option>
										</select>
										<input
											type="text"
											value={editValues.returnType || ""}
											onChange={(e) => setEditValues({ ...editValues, returnType: e.target.value })}
											placeholder="Возвращаемый тип"
											className="flex-1 p-1 border rounded text-xs"
										/>
									</div>
									<div className="flex gap-2">
										<input
											type="text"
											value={editValues.name || ""}
											onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
											placeholder="Название метода"
											className="flex-1 p-1 border rounded text-xs"
										/>
										<input
											type="text"
											value={editValues.params || ""}
											onChange={(e) => setEditValues({ ...editValues, params: e.target.value })}
											placeholder="Параметры"
											className="flex-1 p-1 border rounded text-xs"
										/>
									</div>
									<div className="flex gap-2 justify-end">
										<button onClick={saveMethod} className="text-green-600 hover:text-green-800">
											<Check size={12} />
										</button>
										<button onClick={cancelEditMethod} className="text-red-600 hover:text-red-800">
											<X size={12} />
										</button>
									</div>
								</div>
							) : (
								<div className="flex justify-between items-center">
									<span className="text-xs">
										{method.access} {method.returnType} {method.name}({method.params})
									</span>
									<div className="flex gap-1">
										<button onClick={() => startEditMethod(idx)} className="text-blue-600 hover:text-blue-800">
											<Edit2 size={10} />
										</button>
										<button onClick={() => deleteMethod(idx)} className="text-red-600 hover:text-red-800">
											<Trash2 size={10} />
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<button onClick={() => onDeleteClass(selectedClass.id)} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center gap-2">
				<Trash2 size={16} />
				Удалить класс
			</button>
		</div>
	);
};

export default ClassDetails;
