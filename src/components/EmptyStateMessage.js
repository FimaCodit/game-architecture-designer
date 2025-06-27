import React from "react";
import { Code } from "lucide-react";

const EmptyStateMessage = () => {
	return (
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
			<div className="text-center text-gray-500">
				<Code size={48} className="mx-auto mb-4 opacity-50" />
				<p className="text-lg mb-2">Начните создавать архитектуру игры</p>
				<p className="text-sm">Добавьте классы из боковой панели</p>
			</div>
		</div>
	);
};

export default EmptyStateMessage;
