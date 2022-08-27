import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(
	() => import("../components/leaflet-map/leaflet-map"),
	{
		ssr: false,
	}
);

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Travel Map - Home</title>
			</Head>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					widows: "100vw",
				}}
			>
				<LeafletMap />
			</div>
		</div>
	);
};

export default Home;
