import { FormEvent } from "react";
import { MdLocationPin } from "react-icons/md";

import styles from "./login.module.scss";

// HOOKS
import { useForm } from "../../hooks/user-form.hook";

// CONTEXTS
import { useAuth } from "../../contexts/auth.context";
import { useToast } from "../../contexts/toast.context";

interface LoginProps {
	setShowLoginModal: (e?: any) => void;
}

const Login: React.FC<LoginProps> = ({ setShowLoginModal }) => {
	const { handleLogin } = useAuth();
	const { notify } = useToast();
	const [form, handleForm] = useForm({
		email: "",
		password: "",
	});

	const handleSetShowLoginModal = () => {
		setShowLoginModal(false);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!form.email.length || !form.password.length) {
			notify("Preencha todos os campos", "warning");
			return;
		}

		handleLogin(form, handleSetShowLoginModal);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles["login-container"]}>
				<div className={styles.logo}>
					<MdLocationPin size={26} />
					<h2>Pin</h2>
				</div>

				<form className={styles.form} onSubmit={handleSubmit}>
					<input
						name="email"
						onChange={handleForm}
						value={form.email}
						className={styles["input-form"]}
						type="email"
						placeholder="Email"
					/>
					<input
						name="password"
						onChange={handleForm}
						value={form.password}
						className={styles["input-form"]}
						type="password"
						placeholder="Senha"
					/>
					<button className={styles.button} type="submit">
						Entrar
					</button>
				</form>
			</div>
		</div>
	);
};

export { Login };
