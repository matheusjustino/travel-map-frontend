import "react-toastify/dist/ReactToastify.css";
import { createContext, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface ToastContextData {
	notify: (
		message: string,
		type: "success" | "warning" | "info" | "error"
	) => void;
}

interface ToastProviderProps {
	children?: React.ReactNode;
}

export const ToastContext = createContext<ToastContextData>(
	{} as ToastContextData
);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
	const notify = (
		message: string,
		type: "success" | "warning" | "info" | "error"
	) => {
		toast(message, {
			position: "top-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			type,
		});
	};

	const toastProviderData: ToastContextData = {
		notify,
	};

	return (
		<ToastContext.Provider value={toastProviderData}>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
};

export const useToast = () => useContext(ToastContext);
