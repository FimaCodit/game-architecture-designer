import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, Move } from "lucide-react";

const FloatingClassEditor = ({ selectedClass, classCategories, onUpdateProperty, onAddProperty, onAddMethod, onDeleteClass, onClose, localCamera }) => {
	const [editingProperty, setEditingProperty] = useState(null);
	const [editingMethod, setEditingMethod] = useState(null);
	const [editValues, setEditValues] = useState({});
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const editorRef = useRef(null);

	useEffect(() => {
		if (selectedClass && editorRef.current) {
			// Позиционируем редактор всегда справа от класса
			const classX = selectedClass.position.x * localCamera.zoom + localCamera.offsetX;
			const classY = selectedClass.position.y * localCamera.zoom + localCamera.offsetY;

			// Размеры класса с учетом масштаба (min-w-48 = 192px в Tailwind)
			const classWidth = 192 * localCamera.zoom; // Учитываем масштаб!
			const spacing = 320; // Убираем отступ полностью

			// Размещаем левый край редактора к правому краю класса
			const editorX = classX + classWidth + spacing;
			const editorY = classY;

			setPosition({ x: editorX, y: editorY });
		}
	}, [selectedClass, localCamera]);

	if (!selectedClass) return null;

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

	const handleMouseDown = (e) => {
		if (e.target.closest(".drag-handle")) {
			setIsDragging(true);
			setDragOffset({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
		}
	};

	const handleMouseMove = (e) => {
		if (isDragging) {
			setPosition({
				x: e.clientX - dragOffset.x,
				y: e.clientY - dragOffset.y,
			});
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging, dragOffset]);

	return (
		<div
			ref={editorRef}
			className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-hidden text-white"
			style={{
				left: position.x,
				top: position.y,
				pointerEvents: "auto", // Убеждаемся что события мыши работают
			}}
			onMouseDown={handleMouseDown}
		>
			{/* Заголовок с возможностью перетаскивания */}
			<div className="drag-handle bg-gray-700 p-3 border-b border-gray-600 cursor-move flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Move size={16} className="text-gray-300" />
					<h3 className="font-semibold text-sm text-white">Редактирование: {selectedClass.name}</h3>
				</div>
				<button onClick={onClose} className="text-gray-300 hover:text-white p-1">
					<X size={16} />
				</button>
			</div>

			<div className="p-3 overflow-y-auto max-h-80">
				{/* Название класса */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 text-gray-200">Название</label>
					<input
						type="text"
						value={selectedClass.name}
						onChange={(e) => updateProperty("name", e.target.value)}
						className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-700 text-white"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.target.blur();
							}
						}}
					/>
				</div>

				{/* Свойства */}
				<div className="mb-4">
					<div className="flex justify-between items-center mb-2">
						<label className="text-sm font-medium text-gray-200">Свойства</label>
						<button onClick={() => onAddProperty(selectedClass.id)} className="text-blue-400 hover:text-blue-300">
							<Plus size={14} />
						</button>
					</div>
					<div className="space-y-2 max-h-32 overflow-y-auto">
						{selectedClass.properties.map((prop, idx) => (
							<div key={idx} className="bg-gray-700 p-2 rounded">
								{editingProperty === idx ? (
									<div className="space-y-2">
										<div className="flex gap-2">
											<select
												value={editValues.access || "private"}
												onChange={(e) => setEditValues({ ...editValues, access: e.target.value })}
												className="flex-1 p-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
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
												className="flex-1 p-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
											/>
										</div>
										<div className="flex gap-2">
											<input
												type="text"
												value={editValues.name || ""}
												onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
												placeholder="Название"
												className="flex-1 p-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
											/>
											<button onClick={saveProperty} className="text-green-400 hover:text-green-300">
												<Check size={12} />
											</button>
											<button onClick={cancelEditProperty} className="text-red-400 hover:text-red-300">
												<X size={12} />
											</button>
										</div>
									</div>
								) : (
									<div className="flex justify-between items-center">
										<span className="text-xs text-gray-200">
											{prop.access} {prop.type} {prop.name}
										</span>
										<div className="flex gap-1">
											<button onClick={() => startEditProperty(idx)} className="text-blue-400 hover:text-blue-300">
												<Edit2 size={10} />
											</button>
											<button onClick={() => deleteProperty(idx)} className="text-red-400 hover:text-red-300">
												<Trash2 size={10} />
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Методы */}
				<div className="mb-4">
					<div className="flex justify-between items-center mb-2">
						<label className="text-sm font-medium text-gray-200">Методы</label>
						<button onClick={() => onAddMethod(selectedClass.id)} className="text-blue-400 hover:text-blue-300">
							<Plus size={14} />
						</button>
					</div>
					<div className="space-y-2 max-h-32 overflow-y-auto">
						{selectedClass.methods.map((method, idx) => (
							<div key={idx} className="bg-gray-700 p-2 rounded">
								{editingMethod === idx ? (
									<div className="space-y-2">
										<div className="flex gap-2">
											<select
												value={editValues.access || "public"}
												onChange={(e) => setEditValues({ ...editValues, access: e.target.value })}
												className="flex-1 p-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
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
												className="flex-1 p-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
											/>
										</div>
										<div className="flex gap-2">
											<input
												type="text"
												value={editValues.name || ""}
												onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
												placeholder="Название метода"
												className="flex-1 p-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
											/>
											<input
												type="text"
												value={editValues.params || ""}
												onChange={(e) => setEditValues({ ...editValues, params: e.target.value })}
												placeholder="Параметры"
												className="flex-1 p-1 border border-gray-600 rounded text-xs bg-gray-700 text-white"
											/>
										</div>
										<div className="flex gap-2 justify-end">
											<button onClick={saveMethod} className="text-green-400 hover:text-green-300">
												<Check size={12} />
											</button>
											<button onClick={cancelEditMethod} className="text-red-400 hover:text-red-300">
												<X size={12} />
											</button>
										</div>
									</div>
								) : (
									<div className="flex justify-between items-center">
										<span className="text-xs text-gray-200">
											{method.access} {method.returnType} {method.name}({method.params})
										</span>
										<div className="flex gap-1">
											<button onClick={() => startEditMethod(idx)} className="text-blue-400 hover:text-blue-300">
												<Edit2 size={10} />
											</button>
											<button onClick={() => deleteMethod(idx)} className="text-red-400 hover:text-red-300">
												<Trash2 size={10} />
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Кнопка удаления класса */}
				<button
					onClick={() => {
						onDeleteClass(selectedClass.id);
						onClose();
					}}
					className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
				>
					<Trash2 size={16} />
					Удалить класс
				</button>
			</div>
		</div>
	);
};

export default FloatingClassEditor;
