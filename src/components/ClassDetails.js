import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ClassDetails = ({ selectedClass, classCategories, onUpdateProperty, onAddProperty, onAddMethod, onDeleteClass }) => {
	if (!selectedClass) {
		return <div className="text-gray-500 text-sm">Выберите класс для редактирования</div>;
	}

	const updateProperty = (field, value) => {
		onUpdateProperty(selectedClass.id, field, value);
	};

	const updateArrayItem = (arrayName, index, field, value) => {
		const newArray = [...selectedClass[arrayName]];
		newArray[index] = { ...newArray[index], [field]: value };
		updateProperty(arrayName, newArray);
	};

	const removeArrayItem = (arrayName, index) => {
		const newArray = selectedClass[arrayName].filter((_, i) => i !== index);
		updateProperty(arrayName, newArray);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="font-semibold">Редактирование класса</h3>
				<button onClick={() => onDeleteClass(selectedClass.id)} className="text-red-500 hover:text-red-700">
					<Trash2 size={16} />
				</button>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Название:</label>
				<input type="text" value={selectedClass.name} onChange={(e) => updateProperty("name", e.target.value)} className="w-full p-2 border rounded text-sm" />
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Тип:</label>
				<select value={selectedClass.type} onChange={(e) => updateProperty("type", e.target.value)} className="w-full p-2 border rounded text-sm">
					{classCategories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
			</div>

			<div>
				<div className="flex justify-between items-center mb-2">
					<label className="block text-sm font-medium">Свойства:</label>
					<button onClick={() => onAddProperty(selectedClass.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">
						<Plus size={12} />
					</button>
				</div>
				<div className="space-y-2 max-h-40 overflow-y-auto">
					{selectedClass.properties.map((prop, idx) => (
						<div key={idx} className="border rounded p-2 space-y-1">
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Название"
									value={prop.name}
									onChange={(e) => updateArrayItem("properties", idx, "name", e.target.value)}
									className="flex-1 p-1 border rounded text-xs"
								/>
								<button onClick={() => removeArrayItem("properties", idx)} className="text-red-500 hover:text-red-700">
									<Trash2 size={12} />
								</button>
							</div>
							<div className="flex gap-2">
								<select value={prop.type} onChange={(e) => updateArrayItem("properties", idx, "type", e.target.value)} className="flex-1 p-1 border rounded text-xs">
									<option value="int">int</option>
									<option value="float">float</option>
									<option value="string">string</option>
									<option value="bool">bool</option>
									<option value="GameObject">GameObject</option>
									<option value="Vector3">Vector3</option>
								</select>
								<select value={prop.access} onChange={(e) => updateArrayItem("properties", idx, "access", e.target.value)} className="flex-1 p-1 border rounded text-xs">
									<option value="private">private</option>
									<option value="public">public</option>
									<option value="protected">protected</option>
								</select>
							</div>
						</div>
					))}
				</div>
			</div>

			<div>
				<div className="flex justify-between items-center mb-2">
					<label className="block text-sm font-medium">Методы:</label>
					<button onClick={() => onAddMethod(selectedClass.id)} className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">
						<Plus size={12} />
					</button>
				</div>
				<div className="space-y-2 max-h-40 overflow-y-auto">
					{selectedClass.methods.map((method, idx) => (
						<div key={idx} className="border rounded p-2 space-y-1">
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Название метода"
									value={method.name}
									onChange={(e) => updateArrayItem("methods", idx, "name", e.target.value)}
									className="flex-1 p-1 border rounded text-xs"
								/>
								<button onClick={() => removeArrayItem("methods", idx)} className="text-red-500 hover:text-red-700">
									<Trash2 size={12} />
								</button>
							</div>
							<input
								type="text"
								placeholder="Параметры"
								value={method.params}
								onChange={(e) => updateArrayItem("methods", idx, "params", e.target.value)}
								className="w-full p-1 border rounded text-xs"
							/>
							<div className="flex gap-2">
								<select value={method.returnType} onChange={(e) => updateArrayItem("methods", idx, "returnType", e.target.value)} className="flex-1 p-1 border rounded text-xs">
									<option value="void">void</option>
									<option value="int">int</option>
									<option value="float">float</option>
									<option value="string">string</option>
									<option value="bool">bool</option>
									<option value="GameObject">GameObject</option>
									<option value="Vector3">Vector3</option>
								</select>
								<select value={method.access} onChange={(e) => updateArrayItem("methods", idx, "access", e.target.value)} className="flex-1 p-1 border rounded text-xs">
									<option value="public">public</option>
									<option value="private">private</option>
									<option value="protected">protected</option>
								</select>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ClassDetails;
