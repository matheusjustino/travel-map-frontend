import Document, { Html, Head, Main, NextScript } from "next/document";
// import { createGetInitialProps } from "@mantine/next";

// const getInitialProps = createGetInitialProps();

export default class MyDocument extends Document {
	// static getInitialProps = getInitialProps;

	render() {
		return (
			<Html>
				<Head title="Travel Map">
					<meta
						name="description"
						content="Generated by create next app"
					/>
					<link rel="icon" href="/favicon.ico" />

					<link
						rel="preconnect"
						href="https://fonts.googleapis.com"
					/>
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin={"true"}
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
