import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, FolderOpen, MoreHorizontal, Cloud, HardDrive } from "lucide-react";

const ArchitectureManager = ({ architectures, currentArchitectureId, setCurrentArchitectureId, createNewArchitecture, deleteArchitecture, renameArchitecture, isAuthenticated }) => {
	const [showNewArchitectureForm, setShowNewArchitectureForm] = useState(false);
	const [newArchitectureName, setNewArchitectureName] = useState("");
	const [editingArchId, setEditingArchId] = useState(null);
	const [editingName, setEditingName] = useState("");
	const [showActions, setShowActions] = useState(false);

	const handleCreateArchitecture = async () => {
		if (newArchitectureName.trim()) {
			try {
				await createNewArchitecture(newArchitectureName.trim());
				setNewArchitectureName("");
				setShowNewArchitectureForm(false);
			} catch (error) {
				console.error("Error creating architecture:", error);
			}
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

	const saveEditName = async () => {
		if (editingName.trim()) {
			try {
				await renameArchitecture(editingArchId, editingName.trim());
			} catch (error) {
				console.error("Error renaming architecture:", error);
			}
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

	const handleDeleteArchitecture = async () => {
		if (window.confirm("Вы уверены, что хотите удалить эту архитектуру?")) {
			try {
				await deleteArchitecture(currentArchitectureId);
				setShowActions(false);
			} catch (error) {
				console.error("Error deleting architecture:", error);
			}
		}
	};

	const currentArch = architectures.find((arch) => arch.id === currentArchitectureId);

	return (
		<div className="mb-6">
			<div className="flex items-center gap-2 mb-4">
				{isAuthenticated ? <Cloud size={20} className="text-blue-600" /> : <HardDrive size={20} className="text-gray-600" />}
				<h2 className="text-lg font-bold text-gray-800">{isAuthenticated ? "Мои архитектуры" : "Локальные архитектуры"}</h2>
			</div>

			{/* Выбор текущей архитектуры */}
			{isAuthenticated && architectures.length > 1 && (
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2 text-gray-700">Текущая архитектура</label>
					<select
						value={currentArchitectureId || ""}
						onChange={(e) => setCurrentArchitectureId(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
					>
						{architectures.map((arch) => (
							<option key={arch.id} value={arch.id}>
								{arch.name} ({arch.classes?.length || 0} классов)
							</option>
						))}
					</select>
				</div>
			)}

			{/* Информация о текущей архитектуре */}
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
									{currentArch.classes?.length || 0} классов, {currentArch.connections?.length || 0} связей
								</div>
								{currentArch.lastModified && <div className="text-xs text-gray-400">Изменено: {new Date(currentArch.lastModified).toLocaleString()}</div>}
							</div>
							<div className="flex gap-1">
								<button
									onClick={() => startEditName(currentArchitectureId, currentArch.name)}
									className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
									title="Переименовать"
								>
									<Edit2 size={16} />
								</button>
								{isAuthenticated && architectures.length > 1 && (
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
			{showActions && isAuthenticated && architectures.length > 1 && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
					<button
						onClick={handleDeleteArchitecture}
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
								{isAuthenticated ? "Создать в облаке" : "Создать локально"}
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
					{isAuthenticated ? "Создать новую архитектуру" : "Создать архитектуру"}
				</button>
			)}

			{/* Информация о хранении */}
			<div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
				{isAuthenticated ? (
					<div className="flex items-center gap-1">
						<Cloud size={12} />
						<span>Данные синхронизируются с облаком</span>
					</div>
				) : (
					<div className="flex items-center gap-1">
						<HardDrive size={12} />
						<span>Данные сохраняются локально</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default ArchitectureManager;
