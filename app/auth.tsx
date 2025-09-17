import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	Image,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
	React.useEffect(() => {
		WebBrowser.warmUpAsync();
		return () => {
			WebBrowser.coolDownAsync();
		};
	}, []);
};

const AuthScreen = () => {
	useWarmUpBrowser();
	const router = useRouter();
	const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
	const [loading, setLoading] = useState(false);

	const onGooglePress = React.useCallback(async () => {
		try {
			setLoading(true);
			const { createdSessionId, setActive } = await startOAuthFlow();
			if (createdSessionId && setActive) {
				await setActive({ session: createdSessionId });
				router.replace("/home");
			} else {
				// signIn or signUp objects use this
			}
		} catch (err) {
			console.error("OAuth error", err);
		} finally {
			setLoading(false);
		}
	}, [router, startOAuthFlow]);

	return (
		<View className="flex-1 bg-[#1976D2] justify-center items-center p-5">
			<StatusBar barStyle="light-content" />
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
			<TouchableOpacity
				disabled={loading}
				onPress={onGooglePress}
				className={`bg-white rounded-lg p-3 w-full max-w-sm items-center justify-center flex-row ${loading ? "opacity-70" : ""}`}
			>
				{loading ? (
					<>
						<ActivityIndicator
							size="small"
							color="#4285F4"
							style={{ marginRight: 12 }}
						/>
						<Text className="text-base font-Outfit-SemiBold text-gray-700">
							Verifying...
						</Text>
					</>
				) : (
					<>
						<Ionicons
							name="logo-google"
							size={22}
							color="#4285F4"
							style={{ marginRight: 12 }}
						/>
						<Text className="text-base font-Outfit-SemiBold text-gray-700">
							Sign in with Google
						</Text>
					</>
				)}
			</TouchableOpacity>
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
