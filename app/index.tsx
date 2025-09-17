//නමෝ බුද්ධාය
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import "../global.css";

export default function SplashScreen() {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.5)).current;
	const router = useRouter();
	const { isLoaded, isSignedIn } = useAuth();
	const [isSplashAnimationComplete, setSplashAnimationComplete] =
		useState(false);

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

		const timer = setTimeout(() => setSplashAnimationComplete(true), 2000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isLoaded && isSplashAnimationComplete) {
			if (isSignedIn) {
				router.replace("/home");
			} else {
				router.replace("/auth");
			}
		}
	}, [isLoaded, isSplashAnimationComplete, isSignedIn, router]);

	return (
		<View className="flex-1 bg-[#1976D2] items-center  justify-center">
			<Animated.View
				style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}
			>
				<Text className="text-white font-Outfit-Bold text-3xl">MedRemind</Text>
			</Animated.View>
		</View>
	);
}
