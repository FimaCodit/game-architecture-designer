import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { firestoreService } from "../services/firestoreService";

const createDefaultArchitecture = () => ({
	name: "Новая архитектура",
	classes: [],
	connections: [],
	categories: ["Gameplay", "UI"],
	camera: { zoom: 1, offsetX: 0, offsetY: 0 },
	createdAt: new Date().toISOString(),
	lastModified: new Date().toISOString(),
});

export const useArchitectures = () => {
	const { user } = useAuth();
	const [architectures, setArchitectures] = useState([]);
	const [currentArchitectureId, setCurrentArchitectureId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [syncStatus, setSyncStatus] = useState("synced");
	const [forceRender, setForceRender] = useState(0); // Добавляем счетчик принудительного обновления

	// Локальная архитектура для неавторизованных пользователей
	const [localArchitecture, setLocalArchitecture] = useState(createDefaultArchitecture());

	const unsubscribeRef = useRef(null);
	const updateTimeoutRef = useRef(null);

	const generateId = () => Math.random().toString(36).substr(2, 9);

	// Получаем текущую архитектуру
	const currentArchitecture = user ? (currentArchitectureId ? architectures.find((arch) => arch.id === currentArchitectureId) : null) || createDefaultArchitecture() : localArchitecture;

	// Добавим логирование для отладки
	useEffect(() => {
		console.log("useArchitectures: Current state:");
		console.log("- user:", user ? user.uid : "no user");
		console.log("- architectures count:", architectures.length);
		console.log("- currentArchitectureId:", currentArchitectureId);
		console.log("- currentArchitecture:", currentArchitecture);
		console.log("- classes count:", currentArchitecture.classes?.length || 0);
	}, [user, architectures, currentArchitectureId, currentArchitecture]);

	// Инициализация при авторизации/выходе
	useEffect(() => {
		if (user) {
			loadUserArchitectures();
		} else {
			// Отключаем подписку при выходе
			if (unsubscribeRef.current) {
				unsubscribeRef.current();
				unsubscribeRef.current = null;
			}
			// Сбрасываем данные
			setArchitectures([]);
			setCurrentArchitectureId(null);
			// Создаем локальную архитектуру
			const defaultArch = createDefaultArchitecture();
			setLocalArchitecture(defaultArch);
		}
	}, [user]);

	// Загрузка архитектур пользователя
	const loadUserArchitectures = useCallback(async () => {
		if (!user) return;

		try {
			setLoading(true);
			setError(null);

			// Создаем профиль пользователя если его нет (без блокировки основного процесса)
			try {
				await firestoreService.createOrUpdateUserProfile(user.uid, {
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
				});
			} catch (profileError) {
				console.warn("Profile creation failed, but continuing:", profileError);
			}

			// ИЗМЕНЕНО: Загружаем архитектуры один раз, без realtime подписки
			const userArchitectures = await firestoreService.getUserArchitectures(user.uid);
			console.log("useArchitectures: Loaded architectures from Firebase:", userArchitectures.length);

			setArchitectures(userArchitectures);

			// Если у пользователя нет архитектур, создаем дефолтную
			if (userArchitectures.length === 0) {
				console.log("useArchitectures: No architectures found, creating default...");
				try {
					await createNewArchitecture("Моя первая архитектура");
					return;
				} catch (error) {
					console.error("useArchitectures: Error creating default architecture:", error);
				}
			}

			// Устанавливаем текущую архитектуру если она не выбрана
			if (!currentArchitectureId && userArchitectures.length > 0) {
				console.log("useArchitectures: Setting current architecture to:", userArchitectures[0].id);
				setCurrentArchitectureId(userArchitectures[0].id);
			}

			// Если выбранная архитектура была удалена, выбираем первую доступную
			if (currentArchitectureId && !userArchitectures.find((arch) => arch.id === currentArchitectureId)) {
				console.log("useArchitectures: Current architecture not found, switching to:", userArchitectures[0]?.id);
				setCurrentArchitectureId(userArchitectures[0]?.id || null);
			}
		} catch (err) {
			console.error("Error loading architectures:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [user, currentArchitectureId]);

	// Обновление архитектуры (с дебаунсингом для оптимизации)
	const updateCurrentArchitecture = useCallback(
		async (updates) => {
			console.log("useArchitectures: updateCurrentArchitecture called");
			console.log("updates:", updates);

			// Проверяем если это обновление цветов
			if (updates.customCategoryColors) {
				setForceRender((prev) => prev + 1); // Принудительно обновляем счетчик
			}

			if (user && currentArchitectureId) {
				console.log("useArchitectures: Authenticated user mode");

				// Сразу обновляем локальное состояние
				setArchitectures((prev) => {
					const updated = prev.map((arch) => (arch.id === currentArchitectureId ? { ...arch, ...updates, lastModified: new Date().toISOString() } : arch));
					console.log("useArchitectures: Local state updated");
					return updated;
				});

				// Устанавливаем статус синхронизации
				setSyncStatus("syncing");

				// Очищаем предыдущий таймаут
				if (updateTimeoutRef.current) {
					clearTimeout(updateTimeoutRef.current);
				}

				// Отправляем обновление в Firebase с задержкой
				updateTimeoutRef.current = setTimeout(async () => {
					try {
						console.log("useArchitectures: Sending update to Firebase...");
						await firestoreService.updateArchitecture(currentArchitectureId, updates);
						console.log("useArchitectures: Firebase update successful");
						setSyncStatus("synced");
						updateTimeoutRef.current = null;
					} catch (err) {
						console.error("useArchitectures: Error updating architecture:", err);
						setSyncStatus("error");
						setError(err.message);
						updateTimeoutRef.current = null;
					}
				}, 300); // Еще быстрее - 300мс
			} else {
				console.log("useArchitectures: Local user mode");
				// Для неавторизованных пользователей обновляем локально
				setLocalArchitecture((prev) => ({
					...prev,
					...updates,
					lastModified: new Date().toISOString(),
				}));
			}
		},
		[user, currentArchitectureId],
	);

	// Создание новой архитектуры
	const createNewArchitecture = useCallback(
		async (name = "Новая архитектура") => {
			console.log("useArchitectures: createNewArchitecture called with name:", name);

			if (user) {
				try {
					setLoading(true);
					console.log("useArchitectures: Creating architecture in Firebase...");

					const newArchitecture = {
						name: name,
						classes: [],
						connections: [],
						categories: ["Gameplay", "System", "UI", "Data", "Network"],
						camera: { zoom: 1, offsetX: 0, offsetY: 0 },
					};

					const createdArch = await firestoreService.createArchitecture(user.uid, newArchitecture);
					console.log("useArchitectures: Architecture created with ID:", createdArch.id);

					// ИЗМЕНЕНО: Обновляем локальное состояние сразу
					setArchitectures((prev) => [...prev, createdArch]);
					setCurrentArchitectureId(createdArch.id);
				} catch (err) {
					console.error("useArchitectures: Error creating architecture:", err);
					setError(err.message);
				} finally {
					setLoading(false);
				}
			} else {
				console.log("useArchitectures: Creating local architecture...");
				// Для неавторизованных пользователей создаем локально
				const newArch = {
					...createDefaultArchitecture(),
					id: generateId(),
					name,
					categories: ["Gameplay", "System", "UI", "Data", "Network"],
				};
				setLocalArchitecture(newArch);
			}
		},
		[user],
	);

	// Удаление архитектуры
	const deleteArchitecture = useCallback(
		async (archId) => {
			if (!user) return false;

			if (architectures.length <= 1) return false;

			try {
				setLoading(true);
				await firestoreService.deleteArchitecture(archId);

				// ИЗМЕНЕНО: Обновляем локальное состояние сразу
				const updatedArchitectures = architectures.filter((arch) => arch.id !== archId);
				setArchitectures(updatedArchitectures);

				// Выбираем другую архитектуру если удаляем текущую
				if (currentArchitectureId === archId) {
					setCurrentArchitectureId(updatedArchitectures[0]?.id || null);
				}

				return true;
			} catch (err) {
				console.error("Error deleting architecture:", err);
				setError(err.message);
				return false;
			} finally {
				setLoading(false);
			}
		},
		[user, architectures, currentArchitectureId],
	);

	// Переименование архитектуры
	const renameArchitecture = useCallback(
		async (archId, newName) => {
			if (user && archId) {
				try {
					// ИЗМЕНЕНО: Сначала обновляем локально
					setArchitectures((prev) => prev.map((arch) => (arch.id === archId ? { ...arch, name: newName.trim() || "Без названия", lastModified: new Date().toISOString() } : arch)));

					// Затем отправляем в Firebase
					await firestoreService.updateArchitecture(archId, {
						name: newName.trim() || "Без названия",
					});
				} catch (err) {
					console.error("Error renaming architecture:", err);
					setError(err.message);
					// Откатываем изменения при ошибке
					loadUserArchitectures();
				}
			} else {
				// Для локальной архитектуры
				setLocalArchitecture((prev) => ({
					...prev,
					name: newName.trim() || "Без названия",
					lastModified: new Date().toISOString(),
				}));
			}
		},
		[user, loadUserArchitectures],
	);

	// Очистка ошибок
	const clearError = useCallback(() => {
		setError(null);
		setSyncStatus("synced");
	}, []);

	// Принудительная синхронизация
	const forceSync = useCallback(async () => {
		if (user && currentArchitectureId) {
			try {
				setSyncStatus("syncing");
				const currentArch = architectures.find((arch) => arch.id === currentArchitectureId);
				if (currentArch) {
					await firestoreService.updateArchitecture(currentArchitectureId, currentArch);
					setSyncStatus("synced");
				}
			} catch (err) {
				console.error("Error force syncing:", err);
				setSyncStatus("error");
				setError(err.message);
			}
		}
	}, [user, currentArchitectureId, architectures]);

	// Применение шаблона архитектуры
	const applyTemplate = useCallback(
		async (templateData) => {
			console.log("useArchitectures: applyTemplate called", templateData);

			try {
				await updateCurrentArchitecture({
					classes: templateData.classes,
					connections: templateData.connections,
					categories: templateData.categories,
				});
				console.log("useArchitectures: Template applied successfully");
			} catch (error) {
				console.error("useArchitectures: Error applying template:", error);
				throw error;
			}
		},
		[updateCurrentArchitecture],
	);

	// Очистка при размонтировании
	useEffect(() => {
		return () => {
			if (unsubscribeRef.current) {
				unsubscribeRef.current();
			}
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, []);

	return {
		architectures: user ? architectures : [localArchitecture],
		currentArchitecture,
		currentArchitectureId: user ? currentArchitectureId : localArchitecture.id,
		setCurrentArchitectureId,
		updateCurrentArchitecture,
		createNewArchitecture,
		deleteArchitecture,
		renameArchitecture,
		applyTemplate, // Добавляем новую функцию
		generateId,
		loading,
		error,
		syncStatus,
		clearError,
		forceSync,

		isAuthenticated: !!user,
		forceRender,
	};
};
