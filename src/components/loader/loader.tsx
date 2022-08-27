import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import styles from "./loader.module.scss";

const Loader: React.FC = () => {
	return (
		<div className={styles.container}>
			<BeatLoader color="#ff0000" loading={true} size={32} />
		</div>
	);
};

export { Loader };
