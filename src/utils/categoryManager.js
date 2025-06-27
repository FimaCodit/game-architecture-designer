export const categoryManager = {
	addCategory: (classCategories, newCategoryName, updateCurrentArchitecture) => {
		if (!newCategoryName.trim()) return false;

		const formattedName = newCategoryName.charAt(0).toUpperCase() + newCategoryName.slice(1).toLowerCase();

		if (classCategories.includes(formattedName)) return false;

		const updatedCategories = [...classCategories, formattedName];
		updateCurrentArchitecture({ categories: updatedCategories });
		return true;
	},

	removeCategory: (category, classCategories, classes, updateCurrentArchitecture) => {
		if (classCategories.length <= 1) return false;

		const updatedCategories = classCategories.filter((c) => c !== category);
		const updatedClasses = classes.map((c) => (c.type === category ? { ...c, type: updatedCategories[0] } : c));

		updateCurrentArchitecture({
			categories: updatedCategories,
			classes: updatedClasses,
		});
		return true;
	},
};
