import { FormEvent, Fragment, memo, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L, { divIcon } from "leaflet";
import {
	MapContainer,
	Marker,
	TileLayer,
	Tooltip,
	Popup,
	useMapEvents,
	useMapEvent,
	MapConsumer,
} from "react-leaflet";
import { FaStar } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { useLazyQuery, useMutation } from "@apollo/client";
import { format } from "timeago.js";

import styles from "./leaflet-map.module.scss";

// HOOKS
import { useGetLocation } from "../../hooks/use-get-location";
import { useForm } from "../../hooks/user-form.hook";

// GRAPHQL
import { LIST_PINS } from "../../graphql/queries";
import { CREATE_PIN } from "../../graphql/mutations";

// CONTEXTS
import { useAuth } from "../../contexts/auth.context";
import { useToast } from "../../contexts/toast.context";

// INTERFACES
import { PinInterface } from "../../interfaces/pin.interface";

// COMPONENTS
import { Register } from "../register/register";
import { Login } from "../login/login";
import { Loader } from "../loader/loader";

interface ListPinsApiResponse {
	listPins: PinInterface[];
}

interface CreatePin {
	title: string;
	description: string;
	rating: number;
	lat: number;
	long: number;
}

const LeafletMap: React.FC = memo(() => {
	const { coords, error } = useGetLocation();
	const { user, isAuthenticated, handleLogin, handleLogout } = useAuth();
	const { notify } = useToast();

	const [listPinsFunc, { loading: listPinsLoading }] =
		useLazyQuery(LIST_PINS);
	const [createPinFunc] = useMutation(CREATE_PIN);

	const [pins, setPins] = useState<PinInterface[]>([]);
	const [currentPlaceId, setCurrentPlaceId] = useState<PinInterface>();
	const [newPlace, setNewPlace] = useState<number[]>();
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [loading, setIsLoading] = useState(false);
	const [form, handleForm, resetForm] = useForm({
		title: "",
		description: "",
		rating: 1,
	});

	const MapEvent = () => {
		const map = useMapEvent("click", (e) => {
			if (isAuthenticated) {
				const newCords = [e.latlng.lat, e.latlng.lng];
				setNewPlace(newCords);
			}
		});

		return null;
	};

	useEffect(() => {
		(async () => {
			delete L.Icon.Default.prototype._getIconUrl;
		})();

		(() => {
			setIsLoading(true);

			listPinsFunc({
				onCompleted: (data: ListPinsApiResponse) => {
					setPins(data.listPins);

					setIsLoading(false);
				},
				onError: (error) => {
					console.error(error);
					notify(`Ops... ${error.message}`, "error");

					setIsLoading(false);
				},
			});
		})();
	}, [listPinsFunc, notify]);

	const iconMarkup = (userId?: string) =>
		renderToStaticMarkup(
			<MdLocationPin
				size={40}
				color={
					isAuthenticated && userId === user.id ? "tomato" : "#654ce4"
				}
			/>
		);
	const customMarkerIcon = (userId?: string) =>
		divIcon({
			iconSize: 0,
			html: iconMarkup(userId),
		});

	const handleCurrentPlaceId = (pinId: string) => {
		setCurrentPlaceId(pinId);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setIsLoading(true);

		if (!isAuthenticated) {
			notify(`Você não está logado`, "error");
			return;
		}

		const data: CreatePin = {
			...form,
			rating: Number(form.rating),
			lat: newPlace[0],
			long: newPlace[1],
		};

		createPinFunc({
			variables: data,
			onCompleted: (data) => {
				setPins((old) => old.concat(data.createPin));
				notify("Novo pin criado!", "success");
				resetForm();

				setIsLoading(false);
			},
			onError: (error) => {
				console.error(error);
				notify(`Ops... ${error.message}`, "error");

				setIsLoading(false);
			},
		});
	};

	if (!coords) {
		return <Loader />;
	}

	if (error) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<h2>Erro ao carregar suas coordenadas</h2>
			</div>
		);
	}

	return (
		<div className={styles["map-wrapper"]}>
			{listPinsLoading || loading ? <Loader /> : null}

			<MapContainer
				center={{ lat: coords![0], lng: coords![1] }}
				zoom={13}
				style={{ height: "100%", width: "100%", position: "absolute" }}
			>
				<TileLayer
					url={String(process.env.NEXT_PUBLIC_MAP_TILER_URL)}
					attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
				/>

				<MapEvent />

				{newPlace && (
					<Popup position={newPlace}>
						<form onSubmit={handleSubmit}>
							<div className={styles.card}>
								<label className={styles.label}>Lugar</label>
								<input
									name="title"
									onChange={handleForm}
									value={form.title}
									className={styles["input-form"]}
									type="text"
									placeholder="Digite o nome do lugar"
								/>

								<label className={styles.label}>
									Comentário
								</label>
								<textarea
									name="description"
									onChange={handleForm}
									value={form.description}
									className={styles["input-form"]}
									type="text"
									placeholder="Breve comentário"
								/>

								<label className={styles.label}>Nota</label>
								<select
									name="rating"
									onChange={handleForm}
									value={form.rating}
								>
									<option value={1}>1</option>
									<option value={2}>2</option>
									<option value={3}>3</option>
									<option value={4}>4</option>
									<option value={5}>5</option>
								</select>

								<button
									className={styles["submit-button"]}
									type="submit"
								>
									Criar Pin
								</button>
							</div>
						</form>
					</Popup>
				)}

				{pins.map((pin) => {
					return (
						<Marker
							key={pin.id}
							position={[pin.lat, pin.long]}
							eventHandlers={{
								click: () => handleCurrentPlaceId(pin.id),
							}}
							icon={customMarkerIcon(pin.user.id)}
						>
							<Popup>
								<div className={styles.card}>
									<label className={styles.label}>
										Lugar
									</label>
									<h4 className={styles.place}>
										{pin.title}
									</h4>

									<label className={styles.label}>
										Comentário
									</label>
									<p className={styles.description}>
										{pin.description}
									</p>

									<label className={styles.label}>Nota</label>
									<div className={styles.stars}>
										{Array(pin.rating)
											.fill(0)
											.map((_, index) => (
												<FaStar
													key={pin.id + index}
													className={styles.star}
												/>
											))}
									</div>

									<label className={styles.label}>
										Informações
									</label>
									<span className={styles.username}>
										Criado por <b>{pin.user.userName}</b>
									</span>
									<span className={styles.date}>
										{format(pin.createdAt)}
									</span>
								</div>
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>

			{isAuthenticated ? (
				<button
					className={`${styles.button} ${styles.logout}`}
					onClick={handleLogout}
				>
					Sair
				</button>
			) : (
				<Fragment>
					<button
						className={`${styles.button} ${styles.login}`}
						onClick={() => {
							if (showRegisterModal) {
								setShowRegisterModal(false);
							}

							if (showLoginModal) {
								setShowLoginModal(false);
							} else {
								setShowLoginModal(true);
							}
						}}
					>
						Entrar
					</button>
					<button
						className={`${styles.button} ${styles.register}`}
						onClick={() => {
							if (showLoginModal) {
								setShowLoginModal(false);
							}

							if (showRegisterModal) {
								setShowRegisterModal(false);
							} else {
								setShowRegisterModal(true);
							}
						}}
					>
						Criar Conta
					</button>
				</Fragment>
			)}

			{showRegisterModal && (
				<Register setShowRegisterModal={setShowRegisterModal} />
			)}
			{showLoginModal && <Login setShowLoginModal={setShowLoginModal} />}
		</div>
	);
});

LeafletMap.displayName = "LeafletMap";

export default LeafletMap;
