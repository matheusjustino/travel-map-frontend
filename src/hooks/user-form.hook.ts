import { useReducer } from "react";

enum ACTION_TYPES {
	HANDLE_FORM = "handle_form",
	RESET_FORM = "reset_form",
}

function formReducer(state, action) {
	if (action.type === ACTION_TYPES.HANDLE_FORM) {
		return {
			...state,
			[action.name]: action.value,
		};
	}

	if (action.type === ACTION_TYPES.RESET_FORM) {
		return {
			...action.initialState,
		};
	}
}

const useForm = (initialState = {}) => {
	const [form, dispatch] = useReducer(formReducer, initialState);

	const handleForm = (event) => {
		const { name, value } = event.target;

		return dispatch({ type: ACTION_TYPES.HANDLE_FORM, name, value });
	};

	const resetForm = () => {
		return dispatch({ type: ACTION_TYPES.RESET_FORM, initialState });
	};

	return [form, handleForm, resetForm];
};

export { useForm, formReducer, ACTION_TYPES };
