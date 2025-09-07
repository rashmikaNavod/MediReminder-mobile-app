//නමෝ බුද්ධාය
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		"Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
		"Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
		"Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <Slot />;
}
