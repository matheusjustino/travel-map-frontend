import { FormEvent } from "react";
import { MdLocationPin } from "react-icons/md";

import styles from "./register.module.scss";

// HOOKS
import { useForm } from "../../hooks/user-form.hook";

// CONTEXTS
import { useAuth } from "../../contexts/auth.context";
import { useToast } from "../../contexts/toast.context";

interface RegisterProps {
	setShowRegisterModal: (e?: any) => void;
}

const Register: React.FC<RegisterProps> = ({ setShowRegisterModal }) => {
	const { handleRegister } = useAuth();
	const { notify } = useToast();
	const [form, handleForm] = useForm({
		userName: "",
		email: "",
		password: "",
	});

	const handleSetShowRegisterModal = () => {
		setShowRegisterModal(false);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			!form.userName.length ||
			!form.email.length ||
			!form.password.length
		) {
			notify("Preencha todos os campos", "warning");
			return;
		}

		handleRegister(form, handleSetShowRegisterModal);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles["register-container"]}>
				<div className={styles.logo}>
					<MdLocationPin size={26} />
					<h2>Pin</h2>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<input
						name="userName"
						onChange={handleForm}
						value={form.userName}
						className={styles["input-form"]}
						type="text"
						placeholder="Nome de usuário"
					/>
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
						Criar conta
					</button>
				</form>
			</div>
		</div>
	);
};

export { Register };
