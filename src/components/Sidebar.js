import React, { useState } from "react";
import AuthComponent from "./AuthComponent";
import ArchitectureManager from "./ArchitectureManager";
import CategoryManagement from "./CategoryManagement";
import ClassCreator from "./ClassCreator";
import ClassDetails from "./ClassDetails";
import ExportControls from "./ExportControls";
import ConnectionControls from "./ConnectionControls";
import { useAuth } from "../contexts/AuthContext";
import { Settings, ChevronDown } from "lucide-react";

const Sidebar = ({
	isVisible,
	architectures,
	currentArchitectureId,
	setCurrentArchitectureId,
	createNewArchitecture,
	deleteArchitecture,
	renameArchitecture,
	classCategories,
	classes,
	updateCurrentArchitecture,
	newClassForm,
	setNewClassForm,
	addCustomClass,
	isConnecting,
	toggleConnectionMode,
	connectionsCount,
	selectedConnectionType,
	onConnectionTypeChange,
	currentArchitecture,
	selectedClass,
	updateClassProperty,
	addProperty,
	addMethod,
	deleteClass,
	loading,
	error,
	syncStatus,
	clearError,
	forceSync,
	isAuthenticated,
	copyClass,
	pasteClass,
	hasCopiedClass,
	copiedClass,
	hasMultipleSelection,
	selectedClasses,
}) => {
	const { user } = useAuth();
	const [showConstructorDetails, setShowConstructorDetails] = useState(false); // Изменяем на false

	return (
		<div className={`bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ${isVisible ? "w-80 p-4" : "w-0 p-0"} relative`}>
			{/* Кружочек синхронизации */}
			{user && isVisible && (
				<div className="absolute top-3 right-3 z-10">
					<div
						className={`w-3 h-3 rounded-full ${syncStatus === "synced" ? "bg-green-500" : syncStatus === "syncing" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`}
						title={syncStatus === "synced" ? "Синхронизировано" : syncStatus === "syncing" ? "Синхронизация..." : "Ошибка синхронизации"}
					/>
				</div>
			)}

			<div className={`${isVisible ? "block" : "hidden"}`}>
				{/* Компонент авторизации */}
				<AuthComponent />

				{/* Индикатор загрузки */}
				{loading && (
					<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
						<div className="flex items-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							<span className="text-sm text-blue-700">Загрузка данных...</span>
						</div>
					</div>
				)}

				{/* Уведомление об ошибке */}
				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-sm text-red-700">Ошибка:</span>
								<span className="text-xs text-red-600">{error}</span>
							</div>
							<button onClick={clearError} className="text-red-600 hover:text-red-800 text-xs underline">
								Закрыть
							</button>
						</div>
					</div>
				)}

				{/* Предупреждение для локального режима */}
				{!user && (
					<div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
						<div className="text-sm text-amber-800 mb-1">⚠️ Локальный режим</div>
						<div className="text-xs text-amber-700">Ваша работа не сохраняется. Войдите в аккаунт для синхронизации между устройствами.</div>
					</div>
				)}

				<ArchitectureManager
					architectures={architectures}
					currentArchitectureId={currentArchitectureId}
					setCurrentArchitectureId={setCurrentArchitectureId}
					createNewArchitecture={createNewArchitecture}
					deleteArchitecture={deleteArchitecture}
					renameArchitecture={renameArchitecture}
					isAuthenticated={isAuthenticated}
				/>

				{/* Заголовок конструктора с кнопкой раскрытия - в том же стиле что и архитектуры */}
				<div className="mb-6">
					<div className="flex items-center gap-2 mb-4">
						<Settings size={20} className="text-gray-600" />
						<button
							onClick={() => setShowConstructorDetails(!showConstructorDetails)}
							className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors flex-1"
							title={showConstructorDetails ? "Скрыть конструктор" : "Показать конструктор"}
						>
							<h2 className="text-base font-bold text-gray-800 hover:text-blue-600 transition-colors">Конструктор архитектуры</h2>
							<ChevronDown size={16} className={`transform transition-transform text-gray-500 ${showConstructorDetails ? "rotate-180" : ""}`} />
						</button>
					</div>

					{/* Скрываемый контент конструктора (только категории и экспорт) */}
					{showConstructorDetails && (
						<div className="space-y-6">
							<CategoryManagement classCategories={classCategories} classes={classes} updateCurrentArchitecture={updateCurrentArchitecture} currentArchitecture={currentArchitecture} />

							<ExportControls currentArchitecture={currentArchitecture} />
						</div>
					)}
				</div>

				{/* Создание класса - всегда видно */}
				<ClassCreator newClassForm={newClassForm} setNewClassForm={setNewClassForm} classCategories={classCategories} onAddClass={addCustomClass} />

				{/* Связи между классами - всегда видно */}
				<ConnectionControls
					isConnecting={isConnecting}
					onToggleConnectionMode={toggleConnectionMode}
					connectionsCount={connectionsCount}
					selectedConnectionType={selectedConnectionType}
					onConnectionTypeChange={onConnectionTypeChange}
				/>

				{/* Редактирование класса - возвращаем обратно */}
				<ClassDetails
					selectedClass={selectedClass}
					classCategories={classCategories}
					onUpdateProperty={updateClassProperty}
					onAddProperty={addProperty}
					onAddMethod={addMethod}
					onDeleteClass={deleteClass}
					copyClass={copyClass}
					pasteClass={pasteClass}
					hasCopiedClass={hasCopiedClass}
					copiedClass={copiedClass}
					hasMultipleSelection={hasMultipleSelection}
					selectedClasses={selectedClasses}
				/>
			</div>
		</div>
	);
};

export default Sidebar;
