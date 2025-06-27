export const classStyleUtils = {
	classTypeColors: {
		Gameplay: "bg-blue-100 border-blue-400",
		System: "bg-green-100 border-green-400",
		UI: "bg-purple-100 border-purple-400",
		Data: "bg-yellow-100 border-yellow-400",
		Network: "bg-red-100 border-red-400",
		default: "bg-gray-100 border-gray-400",
	},

	getDynamicClassColor: function (type) {
		if (this.classTypeColors[type]) return this.classTypeColors[type];

		let hash = 0;
		for (let i = 0; i < type.length; i++) {
			hash = type.charCodeAt(i) + ((hash << 5) - hash);
		}

		const colors = [
			"bg-pink-100 border-pink-400",
			"bg-indigo-100 border-indigo-400",
			"bg-teal-100 border-teal-400",
			"bg-orange-100 border-orange-400",
			"bg-cyan-100 border-cyan-400",
			"bg-lime-100 border-lime-400",
		];

		return colors[Math.abs(hash) % colors.length];
	},
};
