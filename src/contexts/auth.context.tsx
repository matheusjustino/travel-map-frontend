import { useLazyQuery, useMutation } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import jwtDecode from "jwt-decode";

// GRAPHQL
import { DO_LOGIN, REGISTER } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";

// CONTEXTS
import { useToast } from "./toast.context";

// INTERFACES
import { UserInterface } from "../interfaces/user.interface";
import { Loader } from "../components/loader/loader";

interface AuthContextData {
	user: UserInterface;
	isAuthenticated: boolean;
	handleRegister: (
		data: RegisterInterface,
		callback?: (e?: any) => any
	) => void;
	handleLogin: (data: LoginInterface, callback?: (e?: any) => any) => void;
	handleLogout: () => void;
}

interface AuthProviderProps {
	children?: React.ReactNode;
}

interface LoginInterface {
	email: string;
	password: string;
}

interface RegisterInterface {
	userName: string;
	email: string;
	password: string;
}

export const AuthContext = createContext<AuthContextData>(
	{} as AuthContextData
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { notify } = useToast();
	const [loading, setIsLoading] = useState(false);
	const [user, setUser] = useState<UserInterface>();
	const [registerFunc] = useMutation(REGISTER);
	const [doLoginFunc] = useMutation(DO_LOGIN);
	const [getMeFunc] = useLazyQuery(GET_ME);

	useEffect(() => {
		const { "@auth.token": token } = parseCookies(undefined);

		if (token) {
			getMeFunc({
				onCompleted: (data) => {
					setUser(data.getMe);
				},
				onError: (error) => {
					handleLogout();
				},
			});
		}
	}, [getMeFunc]);

	const handleRegister = (
		data: RegisterInterface,
		callback?: (e?: any) => any
	) => {
		setIsLoading(true);

		registerFunc({
			variables: data,
			onCompleted: (data) => {
				notify("Registrado com sucesso!", "success");
				callback && callback();

				setIsLoading(false);
			},
			onError: (error) => {
				console.error(error);
				notify(`Ops... ${error.message}`, "error");

				setIsLoading(false);
			},
		});
	};

	const handleLogin = (data: LoginInterface, callback?: (e?: any) => any) => {
		setIsLoading(true);

		doLoginFunc({
			variables: data,
			onCompleted: (data) => {
				const decodedToken = jwtDecode<UserInterface>(data.doLogin);

				setCookie(undefined, "@auth.token", data.doLogin, {
					maxAge: 60 * 60 * 12, // 12h
					path: "/",
				});

				setUser(decodedToken);
				notify("Logado com sucesso!", "success");
				callback && callback();

				setIsLoading(false);
			},
			onError: (error) => {
				console.error(error);
				notify(`Ops... ${error.message}`, "error");

				setIsLoading(false);
			},
		});
	};

	const handleLogout = () => {
		destroyCookie(undefined, "@auth.token");
		setUser(undefined);
	};

	const authProviderData: AuthContextData = {
		user,
		isAuthenticated: !!user,
		handleRegister,
		handleLogin,
		handleLogout,
	};

	return (
		<AuthContext.Provider value={authProviderData}>
			{loading && <Loader />}

			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
