import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import AuthCard from "../components/AuthCard";

const AuthScreen = () => {
	const [hasBiometric, setHasBiometric] = useState(false);
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleAuthentication = () => {
		console.log("hey");
	};

	return (
		<View className="flex-1 bg-[#3f51b5]">
			<StatusBar barStyle="light-content" />
			<View className="flex-1 justify-center items-center p-5">
				<Image
					source={require("../assets/images/app-icon/icon.png")}
					className="w-[120px] h-[120px]"
				/>
				<Text
					className="text-2xl font-Outfit-Bold text-white mb-3 mt-2"
					style={style.titleWithShadow}
				>
					MedRemind
				</Text>
				<Text className="text-xl text-white text-center mb-10 font-Outfit-Regular">
					Your Personal Medication Reminder
				</Text>

				<AuthCard
					hasBiometric={hasBiometric}
					isAuthenticating={isAuthenticating}
					error={error}
					onAuthenticate={handleAuthentication}
				/>
			</View>
		</View>
	);
};

const style = StyleSheet.create({
	titleWithShadow: {
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
});

export default AuthScreen;
