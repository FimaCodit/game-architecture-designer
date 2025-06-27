import React from "react";
import { GitBranch, MousePointer } from "lucide-react";

const ConnectionControls = ({ isConnecting, onToggleConnectionMode, connectionsCount }) => {
	return (
		<div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
			<h3 className="font-semibold mb-2 text-sm">Связи между классами</h3>

			<div className="mb-2 text-xs text-gray-600">Создано связей: {connectionsCount}</div>

			<button
				onClick={onToggleConnectionMode}
				className={`w-full p-2 rounded transition-colors flex items-center justify-center gap-2 ${
					isConnecting ? "bg-purple-500 text-white hover:bg-purple-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
				}`}
			>
				{isConnecting ? (
					<>
						<GitBranch size={16} />
						Режим связей (активен)
					</>
				) : (
					<>
						<MousePointer size={16} />
						Создать связь
					</>
				)}
			</button>

			{isConnecting && (
				<div className="mt-2 text-xs text-purple-700 bg-purple-100 p-2 rounded">
					<div className="font-medium mb-1">Режим создания связей активен:</div>
					<div>1. Кликните на первый класс</div>
					<div>2. Кликните на второй класс</div>
					<div>3. Связь будет создана автоматически</div>
					<div className="mt-1 font-medium text-red-600">⚠️ Перетаскивание отключено</div>
					<div className="mt-1 text-xs text-gray-600">Кликните "Режим связей" для выхода</div>
				</div>
			)}
		</div>
	);
};

export default ConnectionControls;
