import React, { useState } from "react";
import { LogIn, User, LogOut, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AuthComponent = () => {
	const { user, loading, error, signInWithGoogle, logout, clearError } = useAuth();
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	const handleSignIn = async () => {
		try {
			setIsLoggingIn(true);
			clearError();
			await signInWithGoogle();
		} catch (error) {
			console.error("Sign in failed:", error);
		} finally {
			setIsLoggingIn(false);
		}
	};

	const handleSignOut = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Sign out failed:", error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center p-4">
				<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
				<span className="ml-2 text-sm text-gray-600">Загрузка...</span>
			</div>
		);
	}

	if (user) {
		return (
			<div className="border-b border-gray-200 p-4 mb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						{user.photoURL ? (
							<img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
						) : (
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<User size={16} className="text-white" />
							</div>
						)}
						<div>
							<div className="font-medium text-sm text-gray-900">{user.displayName || "Пользователь"}</div>
							<div className="text-xs text-gray-500">{user.email}</div>
						</div>
					</div>
					<button onClick={handleSignOut} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Выйти">
						<LogOut size={16} />
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="border-b border-gray-200 p-4 mb-4">
			<div className="text-center">
				<div className="mb-4">
					<User size={48} className="mx-auto text-gray-400 mb-2" />
					<h3 className="font-medium text-gray-900 mb-1">Войдите в аккаунт</h3>
					<p className="text-sm text-gray-500">Для сохранения ваших архитектур в облаке</p>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex items-center gap-2 text-red-700">
							<AlertCircle size={16} />
							<span className="text-sm">Ошибка входа</span>
						</div>
						<p className="text-xs text-red-600 mt-1">{error}</p>
						<button onClick={clearError} className="text-xs text-red-600 hover:text-red-800 mt-1 underline">
							Закрыть
						</button>
					</div>
				)}

				<button
					onClick={handleSignIn}
					disabled={isLoggingIn}
					className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isLoggingIn ? (
						<>
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
							<span>Вход...</span>
						</>
					) : (
						<>
							<LogIn size={16} />
							<span>Войти через Google</span>
						</>
					)}
				</button>

				<p className="text-xs text-gray-500 mt-3">Ваши данные будут сохранены в облаке и синхронизированы между устройствами</p>
			</div>
		</div>
	);
};

export default AuthComponent;
