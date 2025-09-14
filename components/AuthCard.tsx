import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AuthCardProps {
	hasBiometric: boolean;
	isAuthenticating: boolean;
	error: string | null;
	onAuthenticate: () => void;
}

const AuthCard: React.FC<AuthCardProps> = ({
	hasBiometric,
	isAuthenticating,
	error,
	onAuthenticate,
}) => {
	return (
		<View
			className="bg-white rounded-2xl p-6 items-center w-full max-w-sm"
			style={style.cardShadow}
		>
			<Text className="text-2xl font-Outfit-Bold text-[#212121] mb-2">
				Welcome Back!
			</Text>

			<Text className="text-base font-Outfit-Regular text-[#757575] mb-7 text-center">
				{hasBiometric
					? "Use Face ID/Touch ID to access your medications"
					: "Enter your PIN to access your medications"}
			</Text>

			<TouchableOpacity
				onPress={onAuthenticate}
				disabled={isAuthenticating}
				className={`bg-[#4CAF50] rounded-lg p-3 w-full items-center justify-center flex-row ${
					isAuthenticating ? "opacity-50" : ""
				}`}
			>
				<Ionicons
					name={hasBiometric ? "finger-print-outline" : "keypad-outline"}
					size={24}
					color="white"
					style={{ marginRight: 10 }}
				/>
				<Text className="text-base font-Outfit-SemiBold text-white">
					{isAuthenticating
						? "Verifying..."
						: hasBiometric
							? "Use Face ID/Touch ID"
							: "Enter PIN"}
				</Text>
			</TouchableOpacity>

			{error && (
				<View className="flex-row items-center mt-4 bg-red-100 p-2 rounded-lg">
					<Ionicons
						name="alert-circle-outline"
						size={20}
						color="#f44336"
						style={{ marginRight: 8 }}
					/>
					<Text className="text-red-700 font-Outfit-Regular">{error}</Text>
				</View>
			)}
		</View>
	);
};

const style = StyleSheet.create({
	cardShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});

export default AuthCard;
