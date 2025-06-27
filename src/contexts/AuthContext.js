import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		// Проверяем результат редиректа при загрузке страницы
		getRedirectResult(auth)
			.then((result) => {
				if (result?.user) {
					setUser(result.user);
				}
			})
			.catch((error) => {
				console.error("Redirect result error:", error);
				setError(error.message);
			})
			.finally(() => {
				setLoading(false);
			});

		return unsubscribe;
	}, []);

	const signInWithGoogle = async () => {
		try {
			setError(null);
			setLoading(true);

			// Пробуем popup, если не работает - используем redirect
			try {
				const result = await signInWithPopup(auth, googleProvider);
				setUser(result.user);
				return result.user;
			} catch (popupError) {
				// Если popup заблокирован, используем redirect
				if (popupError.code === "auth/popup-blocked") {
					await signInWithRedirect(auth, googleProvider);
					return null; // Пользователь будет установлен после редиректа
				}
				throw popupError;
			}
		} catch (error) {
			console.error("Sign in error:", error);
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setError(null);
			await signOut(auth);
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
			setError(error.message);
			throw error;
		}
	};

	const value = {
		user,
		loading,
		error,
		signInWithGoogle,
		logout,
		clearError: () => setError(null),
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
