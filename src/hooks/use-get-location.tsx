import { useEffect, useState } from "react";

type GeoLocation = [number, number];

const useGetLocation = () => {
	const [coords, setCoords] = useState<GeoLocation | null>(null);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		function onSuccess(position: GeolocationPosition) {
			setCoords([position.coords.latitude, position.coords.longitude]);
		}
		function onError(error: GeolocationPositionError) {
			console.error(error.message);

			const errorMsg = {
				[error.PERMISSION_DENIED]: "Permita que a gente te localize.",
				[error.POSITION_UNAVAILABLE]: "Localização indisponível",
				[error.TIMEOUT]: "A requisição demorou muito.",
			};

			setError(errorMsg[error.code]);
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError, {
			enableHighAccuracy: true,
		});
	}, [setCoords]);

	return { coords, error };
};

export { useGetLocation };
