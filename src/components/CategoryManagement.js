import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { categoryManager } from "../utils/categoryManager";

const CategoryManagement = ({ classCategories, classes, updateCurrentArchitecture }) => {
	const [newCategoryName, setNewCategoryName] = useState("");

	const handleAddCategory = () => {
		if (categoryManager.addCategory(classCategories, newCategoryName, updateCurrentArchitecture)) {
			setNewCategoryName("");
		}
	};

	const handleRemoveCategory = (category) => {
		categoryManager.removeCategory(category, classCategories, classes, updateCurrentArchitecture);
	};

	return (
		<div className="mb-6">
			<h3 className="font-semibold mb-2">Категории классов</h3>
			<div className="space-y-2 mb-3">
				{classCategories.map((category) => (
					<div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
						<span className="text-sm">{category}</span>
						{classCategories.length > 1 && (
							<button onClick={() => handleRemoveCategory(category)} className="text-red-500 hover:text-red-700 text-xs">
								<Trash2 size={12} />
							</button>
						)}
					</div>
				))}
			</div>

			<div className="flex gap-2">
				<input
					type="text"
					placeholder="Новая категория"
					value={newCategoryName}
					onChange={(e) => setNewCategoryName(e.target.value)}
					className="flex-1 p-2 border rounded text-sm"
					onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
				/>
				<button onClick={handleAddCategory} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
					<Plus size={14} />
				</button>
			</div>
		</div>
	);
};

export default CategoryManagement;
