import React from "react";
import { Download, FileText } from "lucide-react";
import { exportUtils } from "../utils/exportUtils";

const ExportControls = ({ currentArchitecture }) => {
	return (
		<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
			<h3 className="font-semibold mb-2 text-sm">Экспорт</h3>
			<div className="flex gap-2">
				<button
					onClick={() => exportUtils.exportCode(currentArchitecture)}
					className="flex-1 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2 text-xs"
				>
					<FileText size={12} />
					Код (.cs)
				</button>
				<button
					onClick={() => exportUtils.exportArchitectureJSON(currentArchitecture)}
					className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 text-xs"
				>
					<Download size={12} />
					JSON
				</button>
			</div>
		</div>
	);
};

export default ExportControls;
