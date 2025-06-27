import React from "react";
import { Download, FileText } from "lucide-react";
import { exportUtils } from "../utils/exportUtils";

const ExportControls = ({ currentArchitecture }) => {
	return (
		<div className="space-y-2 mb-4">
			<button onClick={() => exportUtils.exportCode(currentArchitecture)} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-2">
				<Download size={16} />
				Экспорт кода
			</button>
			<button
				onClick={() => exportUtils.exportArchitectureJSON(currentArchitecture)}
				className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
			>
				<FileText size={16} />
				Экспорт JSON
			</button>
		</div>
	);
};

export default ExportControls;
