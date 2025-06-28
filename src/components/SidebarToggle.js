import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SidebarToggle = ({ isVisible, onToggle }) => (
	<button className="absolute top-4 left-4 z-50 bg-white border border-gray-300 rounded-full shadow p-2" onClick={onToggle} title={isVisible ? "Скрыть боковую панель" : "Показать боковую панель"}>
		{isVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
	</button>
);

export default SidebarToggle;
