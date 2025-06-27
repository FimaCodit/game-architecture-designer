import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, Copy, Clipboard } from "lucide-react";

const ClassDetails = ({
	selectedClass,
	classCategories,
	onUpdateProperty,
	onAddProperty,
	onAddMethod,
	onDeleteClass,
	copyClass,
	pasteClass,
	hasCopiedClass,
	copiedClass,
	hasMultipleSelection,
	selectedClasses,
}) => {
	const [editingProperty, setEditingProperty] = useState(null);
	const [editingMethod, setEditingMethod] = useState(null);
	const [editValues, setEditValues] = useState({});

	const updateProperty = (field, value) => {
		onUpdateProperty(selectedClass.id, field, value);
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

	if (!selectedClass && !hasMultipleSelection) {
		return (
			<div className="mt-6 border-t pt-4">
				<p className="text-gray-500 text-sm">Выберите класс для редактирования</p>
			</div>
		);
	}

	// Если выделено несколько классов
	if (hasMultipleSelection) {
		return (
			<div className="mt-6 border-t pt-4">
				<div className="p-4 bg-gray-100 rounded-lg">
					<h3 className="font-semibold text-gray-600 mb-2">Множественное выделение</h3>
					<p className="text-sm text-gray-600 mb-2">Выделено классов: {selectedClasses.length}</p>
					<p className="text-xs text-gray-500">Удерживайте Cmd/Ctrl для выделения области</p>

					{/* Кнопки массовых операций */}
					<div className="mt-3 space-y-2">
						<button className="w-full p-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed" disabled>
							Массовое редактирование (в разработке)
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Обычное редактирование одного класса
	return (
		<div className="mt-6 border-t pt-4">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-semibold">Редактирование: {selectedClass.name}</h3>
				<div className="flex gap-1">
					<button onClick={() => copyClass(selectedClass)} className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Копировать класс (Cmd/Ctrl+C)">
						<Copy size={14} />
					</button>
					{hasCopiedClass && (
						<button onClick={pasteClass} className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded" title={`Вставить "${copiedClass?.name}" (Cmd/Ctrl+V)`}>
							<Clipboard size={14} />
						</button>
					)}
				</div>
			</div>

			{hasCopiedClass && (
				<div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
					<div className="font-medium text-blue-800">Скопирован: {copiedClass?.name}</div>
					<div className="text-blue-600">Нажмите Cmd/Ctrl+V для вставки</div>
				</div>
			)}

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
