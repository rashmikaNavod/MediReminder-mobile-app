//නමෝ බුද්ධාය
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { getToken, saveToken } from "@/lib/tokenCache";
import "../global.css";

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

	return (
		<ClerkProvider
			publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
			tokenCache={{ getToken, saveToken }}
		>
			<Slot />
		</ClerkProvider>
	);
}
