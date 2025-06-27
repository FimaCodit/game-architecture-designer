import React, { useState } from "react";
import { FolderOpen, Plus, Copy, Trash2 } from "lucide-react";

const ArchitectureManager = ({ architectures, currentArchitectureId, setCurrentArchitectureId, createNewArchitecture, deleteArchitecture, duplicateArchitecture }) => {
	const [showArchitectureManager, setShowArchitectureManager] = useState(false);
	const [newArchitectureName, setNewArchitectureName] = useState("");

	const handleCreateArchitecture = () => {
		if (createNewArchitecture(newArchitectureName)) {
			setNewArchitectureName("");
			setShowArchitectureManager(false);
		}
	};

	return (
		<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
			<div className="flex items-center justify-between mb-2">
				<h3 className="font-semibold text-sm">Архитектуры</h3>
				<button onClick={() => setShowArchitectureManager(!showArchitectureManager)} className="text-blue-600 hover:text-blue-800">
					<FolderOpen size={16} />
				</button>
			</div>

			<div className="mb-2">
				<select value={currentArchitectureId} onChange={(e) => setCurrentArchitectureId(e.target.value)} className="w-full p-1 border rounded text-sm">
					{architectures.map((arch) => (
						<option key={arch.id} value={arch.id}>
							{arch.name} ({arch.classes.length} классов)
						</option>
					))}
				</select>
			</div>

			{showArchitectureManager && (
				<div className="space-y-2">
					<div className="flex gap-1">
						<input
							type="text"
							placeholder="Название архитектуры"
							value={newArchitectureName}
							onChange={(e) => setNewArchitectureName(e.target.value)}
							className="flex-1 p-1 border rounded text-xs"
							onKeyPress={(e) => e.key === "Enter" && handleCreateArchitecture()}
						/>
						<button onClick={handleCreateArchitecture} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">
							<Plus size={12} />
						</button>
					</div>

					<div className="max-h-32 overflow-y-auto space-y-1">
						{architectures.map((arch) => (
							<div key={arch.id} className="flex items-center justify-between p-1 bg-white rounded border text-xs">
								<span className="truncate flex-1">{arch.name}</span>
								<div className="flex gap-1">
									<button onClick={() => duplicateArchitecture(arch.id)} className="text-green-600 hover:text-green-800" title="Дублировать">
										<Copy size={10} />
									</button>
									{architectures.length > 1 && (
										<button onClick={() => deleteArchitecture(arch.id)} className="text-red-600 hover:text-red-800" title="Удалить">
											<Trash2 size={10} />
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ArchitectureManager;
