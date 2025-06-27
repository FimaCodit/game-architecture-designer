import { useState, useEffect, useCallback, useRef } from "react";

export const useCamera = (camera, updateCurrentArchitecture) => {
	const [localCamera, setLocalCamera] = useState(camera);
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });
	const canvasRef = useRef(null);

	// Синхронизируем локальную камеру с архитектурой при переключении
	useEffect(() => {
		setLocalCamera(camera);
	}, [camera.zoom, camera.offsetX, camera.offsetY]);

	const handleWheel = useCallback(
		(e) => {
			e.preventDefault();

			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			const newZoom = Math.max(0.1, Math.min(3, localCamera.zoom * delta));

			const zoomPointX = (mouseX - localCamera.offsetX) / localCamera.zoom;
			const zoomPointY = (mouseY - localCamera.offsetY) / localCamera.zoom;

			const newOffsetX = mouseX - zoomPointX * newZoom;
			const newOffsetY = mouseY - zoomPointY * newZoom;

			const newCamera = {
				zoom: newZoom,
				offsetX: newOffsetX,
				offsetY: newOffsetY,
			};

			setLocalCamera(newCamera);
			updateCurrentArchitecture({ camera: newCamera });
		},
		[localCamera, updateCurrentArchitecture],
	);

	const handleCanvasMouseDown = (e) => {
		if (!e.target.closest(".class-block") && e.button === 0) {
			e.preventDefault();
			setIsPanning(true);
			setPanStart({ x: e.clientX, y: e.clientY });
		}
	};

	const zoomIn = () => {
		const newCamera = { ...localCamera, zoom: Math.min(3, localCamera.zoom * 1.2) };
		setLocalCamera(newCamera);
		updateCurrentArchitecture({ camera: newCamera });
	};

	const zoomOut = () => {
		const newCamera = { ...localCamera, zoom: Math.max(0.1, localCamera.zoom * 0.8) };
		setLocalCamera(newCamera);
		updateCurrentArchitecture({ camera: newCamera });
	};

	const resetCamera = () => {
		const newCamera = { zoom: 1, offsetX: 0, offsetY: 0 };
		setLocalCamera(newCamera);
		updateCurrentArchitecture({ camera: newCamera });
	};

	useEffect(() => {
		const handleGlobalMouseMove = (e) => {
			if (isPanning) {
				const deltaX = e.clientX - panStart.x;
				const deltaY = e.clientY - panStart.y;

				const newCamera = {
					...localCamera,
					offsetX: localCamera.offsetX + deltaX,
					offsetY: localCamera.offsetY + deltaY,
				};

				setLocalCamera(newCamera);
				setPanStart({ x: e.clientX, y: e.clientY });
			}
		};

		const handleGlobalMouseUp = () => {
			if (isPanning) {
				updateCurrentArchitecture({ camera: localCamera });
			}
			setIsPanning(false);
		};

		if (isPanning) {
			document.addEventListener("mousemove", handleGlobalMouseMove);
			document.addEventListener("mouseup", handleGlobalMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleGlobalMouseMove);
				document.removeEventListener("mouseup", handleGlobalMouseUp);
			};
		}
	}, [isPanning, localCamera, panStart, updateCurrentArchitecture]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			canvas.addEventListener("wheel", handleWheel, { passive: false });
			return () => canvas.removeEventListener("wheel", handleWheel);
		}
	}, [handleWheel]);

	return {
		localCamera,
		setLocalCamera,
		isPanning,
		canvasRef,
		handleCanvasMouseDown,
		zoomIn,
		zoomOut,
		resetCamera,
	};
};
