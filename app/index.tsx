//නමෝ බුද්ධාය
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

import { useRouter } from "expo-router";
import "../global.css";

export default function SplashScreen() {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.5)).current;
	const router = useRouter();

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				tension: 10,
				friction: 2,
				useNativeDriver: true,
			}),
		]).start();

		const timer = setTimeout(() => {
			router.replace("/auth");
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<View className="flex-1 bg-[#3F51B5] items-center justify-center">
			<Animated.View
				style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}
			>
				<Text className="text-white font-Outfit-Bold text-3xl">MedRemind</Text>
			</Animated.View>
		</View>
	);
}

// const App = () => {
// 	return (
// 		<View className="flex-1">
// 			<StatusBar barStyle="light-content" />
// 			<AuthScreen />
// 		</View>
// 	);
// };

// export default App;
