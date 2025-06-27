import React from "react";
import { Menu, X } from "lucide-react";

const SidebarToggle = ({ isSidebarVisible, setIsSidebarVisible }) => {
	return (
		<button
			onClick={() => setIsSidebarVisible(!isSidebarVisible)}
			className={`absolute top-4 z-50 bg-white border border-gray-300 rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-all duration-300 ${isSidebarVisible ? "left-80" : "left-4"}`}
			title={isSidebarVisible ? "Скрыть панель" : "Показать панель"}
		>
			{isSidebarVisible ? <X size={20} /> : <Menu size={20} />}
		</button>
	);
};

export default SidebarToggle;
