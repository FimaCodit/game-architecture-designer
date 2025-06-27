import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

class FirestoreService {
	constructor() {
		this.architecturesCollection = "architectures";
		this.usersCollection = "users";
	}

	// Получить все архитектуры пользователя
	async getUserArchitectures(userId) {
		try {
			// Убираем orderBy чтобы избежать необходимости в индексе
			const q = query(collection(db, this.architecturesCollection), where("userId", "==", userId));

			const querySnapshot = await getDocs(q);
			const architectures = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				architectures.push({
					id: doc.id,
					...data,
					// Преобразуем Timestamp в строку для сортировки
					lastModified: data.lastModified?.toDate?.() || new Date(),
				});
			});

			// Сортируем на клиенте
			architectures.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

			return architectures;
		} catch (error) {
			console.error("Error getting user architectures:", error);
			throw error;
		}
	}

	// Подписка на изменения архитектур пользователя (реальное время)
	subscribeToUserArchitectures(userId, callback) {
		try {
			// Убираем orderBy чтобы избежать необходимости в индексе
			const q = query(collection(db, this.architecturesCollection), where("userId", "==", userId));

			const unsubscribe = onSnapshot(
				q,
				(querySnapshot) => {
					const architectures = [];
					querySnapshot.forEach((doc) => {
						const data = doc.data();
						architectures.push({
							id: doc.id,
							...data,
							// Преобразуем Timestamp в строку для сортировки
							lastModified: data.lastModified?.toDate?.() || new Date(),
						});
					});

					// Сортируем на клиенте по дате изменения (новые сверху)
					architectures.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

					callback(architectures);
				},
				(error) => {
					console.error("Error in architecture subscription:", error);
					// Вызываем callback с пустым массивом в случае ошибки
					callback([]);
				},
			);

			return unsubscribe;
		} catch (error) {
			console.error("Error subscribing to architectures:", error);
			throw error;
		}
	}

	// Создать новую архитектуру
	async createArchitecture(userId, architectureData) {
		try {
			const newArchitecture = {
				...architectureData,
				userId,
				createdAt: serverTimestamp(),
				lastModified: serverTimestamp(),
			};

			const docRef = await addDoc(collection(db, this.architecturesCollection), newArchitecture);

			// Возвращаем созданную архитектуру с ID
			return {
				id: docRef.id,
				...newArchitecture,
				createdAt: new Date().toISOString(),
				lastModified: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error creating architecture:", error);
			throw error;
		}
	}

	// Обновить архитектуру
	async updateArchitecture(architectureId, updates) {
		try {
			const architectureRef = doc(db, this.architecturesCollection, architectureId);

			const updateData = {
				...updates,
				lastModified: serverTimestamp(),
			};

			await updateDoc(architectureRef, updateData);

			return {
				id: architectureId,
				...updates,
				lastModified: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error updating architecture:", error);
			throw error;
		}
	}

	// Удалить архитектуру
	async deleteArchitecture(architectureId) {
		try {
			const architectureRef = doc(db, this.architecturesCollection, architectureId);
			await deleteDoc(architectureRef);
			return true;
		} catch (error) {
			console.error("Error deleting architecture:", error);
			throw error;
		}
	}

	// Получить конкретную архитектуру
	async getArchitecture(architectureId) {
		try {
			const architectureRef = doc(db, this.architecturesCollection, architectureId);
			const docSnap = await getDoc(architectureRef);

			if (docSnap.exists()) {
				return {
					id: docSnap.id,
					...docSnap.data(),
				};
			} else {
				throw new Error("Architecture not found");
			}
		} catch (error) {
			console.error("Error getting architecture:", error);
			throw error;
		}
	}

	// Создать или обновить профиль пользователя (ИСПРАВЛЕНО)
	async createOrUpdateUserProfile(userId, userData) {
		try {
			const userRef = doc(db, this.usersCollection, userId);
			const userDoc = await getDoc(userRef);

			const profileData = {
				...userData,
				lastLogin: serverTimestamp(),
				updatedAt: serverTimestamp(),
			};

			if (!userDoc.exists()) {
				// Создаем новый профиль с помощью setDoc
				profileData.createdAt = serverTimestamp();
				await setDoc(userRef, profileData);
			} else {
				// Обновляем существующий профиль
				await updateDoc(userRef, profileData);
			}

			return profileData;
		} catch (error) {
			console.error("Error creating/updating user profile:", error);
			// Не бросаем ошибку, чтобы не блокировать приложение
			return null;
		}
	}

	// Получить профиль пользователя
	async getUserProfile(userId) {
		try {
			const userRef = doc(db, this.usersCollection, userId);
			const docSnap = await getDoc(userRef);

			if (docSnap.exists()) {
				return {
					id: docSnap.id,
					...docSnap.data(),
				};
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error getting user profile:", error);
			return null;
		}
	}

	// Пакетное обновление архитектуры (для оптимизации)
	async batchUpdateArchitecture(architectureId, updates) {
		// Добавляем дебаунсинг для избежания частых обновлений
		if (this.updateTimeout) {
			clearTimeout(this.updateTimeout);
		}

		this.updateTimeout = setTimeout(async () => {
			try {
				await this.updateArchitecture(architectureId, updates);
			} catch (error) {
				console.error("Batch update error:", error);
			}
		}, 1000); // Обновляем не чаще чем раз в секунду
	}
}

export const firestoreService = new FirestoreService();
