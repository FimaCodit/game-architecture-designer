export const exportUtils = {
	exportCode: (currentArchitecture) => {
		const { classes, name, createdAt, lastModified } = currentArchitecture;

		let code = `// Generated Game Architecture: ${name}\n`;
		code += `// Created: ${new Date(createdAt).toLocaleDateString()}\n`;
		code += `// Last Modified: ${new Date(lastModified).toLocaleDateString()}\n\n`;

		classes.forEach((cls) => {
			code += `class ${cls.name} {\n`;

			if (cls.properties.length > 0) {
				code += "  // Properties\n";
				cls.properties.forEach((prop) => {
					code += `  ${prop.access} ${prop.type} ${prop.name};\n`;
				});
				code += "\n";
			}

			if (cls.methods.length > 0) {
				code += "  // Methods\n";
				cls.methods.forEach((method) => {
					code += `  ${method.access} ${method.returnType} ${method.name}(${method.params}) {\n    // TODO: Implement\n  }\n\n`;
				});
			}

			code += "}\n\n";
		});

		const blob = new Blob([code], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${name.replace(/[^a-zA-Z0-9]/g, "_")}_architecture.cs`;
		a.click();
		URL.revokeObjectURL(url);
	},

	exportArchitectureJSON: (currentArchitecture) => {
		const dataStr = JSON.stringify(currentArchitecture, null, 2);
		const blob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${currentArchitecture.name.replace(/[^a-zA-Z0-9]/g, "_")}_architecture.json`;
		a.click();
		URL.revokeObjectURL(url);
	},
};
