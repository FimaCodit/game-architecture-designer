import React from "react";
import { Cloud, CloudOff, RefreshCw, AlertCircle, Check, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const SyncStatus = ({ syncStatus, error, onForceSync, onClearError }) => {
	const { user } = useAuth();

	if (!user) {
		return (
			<div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
				<WifiOff size={16} className="text-yellow-600" />
				<span className="text-sm text-yellow-700">Локальный режим</span>
				<span className="text-xs text-yellow-600">Войдите для синхронизации</span>
			</div>
		);
	}

	const getStatusIcon = () => {
		switch (syncStatus) {
			case "syncing":
				return <RefreshCw size={16} className="text-blue-600 animate-spin" />;
			case "synced":
				return <Cloud size={16} className="text-green-600" />;
			case "error":
				return <CloudOff size={16} className="text-red-600" />;
			default:
				return <Cloud size={16} className="text-gray-600" />;
		}
	};

	const getStatusText = () => {
		switch (syncStatus) {
			case "syncing":
				return "Синхронизация...";
			case "synced":
				return "Синхронизировано";
			case "error":
				return "Ошибка синхронизации";
			default:
				return "Не синхронизировано";
		}
	};

	const getStatusColor = () => {
		switch (syncStatus) {
			case "syncing":
				return "bg-blue-50 border-blue-200 text-blue-700";
			case "synced":
				return "bg-green-50 border-green-200 text-green-700";
			case "error":
				return "bg-red-50 border-red-200 text-red-700";
			default:
				return "bg-gray-50 border-gray-200 text-gray-700";
		}
	};

	return (
		<div className={`flex items-center justify-between px-3 py-2 border rounded-lg ${getStatusColor()}`}>
			<div className="flex items-center gap-2">
				{getStatusIcon()}
				<span className="text-sm font-medium">{getStatusText()}</span>
			</div>

			<div className="flex items-center gap-2">
				{error && (
					<div className="flex items-center gap-1">
						<AlertCircle size={14} className="text-red-500" />
						<span className="text-xs text-red-600 max-w-32 truncate" title={error}>
							{error}
						</span>
					</div>
				)}

				{syncStatus === "error" && (
					<div className="flex gap-1">
						<button onClick={onForceSync} className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Повторить синхронизацию">
							<RefreshCw size={12} />
						</button>
						{error && (
							<button onClick={onClearError} className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Закрыть ошибку">
								<Check size={12} />
							</button>
						)}
					</div>
				)}

				{syncStatus === "synced" && (
					<div className="flex items-center">
						<Check size={12} className="text-green-600" />
					</div>
				)}
			</div>
		</div>
	);
};

export default SyncStatus;
