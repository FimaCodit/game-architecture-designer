import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, FolderOpen, MoreHorizontal } from "lucide-react";

const ArchitectureManager = ({ architectures, currentArchitectureId, setCurrentArchitectureId, createNewArchitecture, deleteArchitecture, renameArchitecture }) => {
	const [showNewArchitectureForm, setShowNewArchitectureForm] = useState(false);
	const [newArchitectureName, setNewArchitectureName] = useState("");
	const [editingArchId, setEditingArchId] = useState(null);
	const [editingName, setEditingName] = useState("");
	const [showActions, setShowActions] = useState(false);

	const handleCreateArchitecture = () => {
		if (newArchitectureName.trim()) {
			createNewArchitecture(newArchitectureName.trim());
			setNewArchitectureName("");
			setShowNewArchitectureForm(false);
		}
	};

	const handleCancel = () => {
		setNewArchitectureName("");
		setShowNewArchitectureForm(false);
	};

	const startEditName = (archId, currentName) => {
		setEditingArchId(archId);
		setEditingName(currentName);
	};

	const saveEditName = () => {
		if (editingName.trim()) {
			renameArchitecture(editingArchId, editingName.trim());
		}
		setEditingArchId(null);
		setEditingName("");
	};

	const cancelEditName = () => {
		setEditingArchId(null);
		setEditingName("");
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			if (showNewArchitectureForm) {
				handleCreateArchitecture();
			} else if (editingArchId) {
				saveEditName();
			}
		} else if (e.key === "Escape") {
			if (showNewArchitectureForm) {
				handleCancel();
			} else if (editingArchId) {
				cancelEditName();
			}
		}
	};

	const currentArch = architectures.find((arch) => arch.id === currentArchitectureId);

	return (
		<div className="mb-6">
			<div className="flex items-center gap-2 mb-4">
				<FolderOpen size={20} className="text-blue-600" />
				<h2 className="text-lg font-bold text-gray-800">Архитектуры</h2>
			</div>

			{/* Выбор текущей архитектуры */}
			<div className="mb-4">
				<label className="block text-sm font-medium mb-2 text-gray-700">Текущая архитектура</label>
				<select
					value={currentArchitectureId}
					onChange={(e) => setCurrentArchitectureId(e.target.value)}
					className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
				>
					{architectures.map((arch) => (
						<option key={arch.id} value={arch.id}>
							{arch.name} ({arch.classes.length} классов)
						</option>
					))}
				</select>
			</div>

			{/* Редактирование имени текущей архитектуры */}
			{currentArch && (
				<div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
					{editingArchId === currentArchitectureId ? (
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">Переименовать</label>
							<div className="flex gap-2">
								<input
									type="text"
									value={editingName}
									onChange={(e) => setEditingName(e.target.value)}
									onKeyDown={handleKeyPress}
									className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
									autoFocus
								/>
								<button onClick={saveEditName} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded">
									<Check size={16} />
								</button>
								<button onClick={cancelEditName} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded">
									<X size={16} />
								</button>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium text-gray-800">{currentArch.name}</div>
								<div className="text-sm text-gray-500">
									{currentArch.classes.length} классов, {currentArch.connections?.length || 0} связей
								</div>
							</div>
							<div className="flex gap-1">
								<button
									onClick={() => startEditName(currentArchitectureId, currentArch.name)}
									className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
									title="Переименовать"
								>
									<Edit2 size={16} />
								</button>
								{architectures.length > 1 && (
									<button onClick={() => setShowActions(!showActions)} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded" title="Дополнительные действия">
										<MoreHorizontal size={16} />
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Дополнительные действия */}
			{showActions && architectures.length > 1 && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
					<button
						onClick={() => {
							if (window.confirm("Вы уверены, что хотите удалить эту архитектуру?")) {
								deleteArchitecture(currentArchitectureId);
								setShowActions(false);
							}
						}}
						className="w-full p-2 bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
					>
						<Trash2 size={14} />
						<span className="text-sm">Удалить архитектуру</span>
					</button>
				</div>
			)}

			{/* Форма создания новой архитектуры */}
			{showNewArchitectureForm ? (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
					<label className="block text-sm font-medium mb-2 text-gray-700">Название новой архитектуры</label>
					<div className="space-y-2">
						<input
							type="text"
							value={newArchitectureName}
							onChange={(e) => setNewArchitectureName(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Введите название"
							className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
							autoFocus
						/>
						<div className="flex gap-2">
							<button
								onClick={handleCreateArchitecture}
								disabled={!newArchitectureName.trim()}
								className="flex-1 py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
							>
								Создать
							</button>
							<button onClick={handleCancel} className="flex-1 py-2 px-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm">
								Отмена
							</button>
						</div>
					</div>
				</div>
			) : (
				<button
					onClick={() => setShowNewArchitectureForm(true)}
					className="w-full mb-4 p-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
				>
					<Plus size={16} />
					Создать новую архитектуру
				</button>
			)}
		</div>
	);
};

export default ArchitectureManager;
