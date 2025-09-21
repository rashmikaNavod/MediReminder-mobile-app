import React from "react";
import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ActivityIndicator,
	Platform,
} from "react-native";

import { useRouter } from "expo-router";
import { useMedicationStore } from "@/store/useMedicationStore";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { cancelMedicationReminders } from "@/lib/notification";

const DeleteMedicationPage = () => {
	const router = useRouter();
	const { userId } = useAuth();
	const { medications, deleteMedication, loading, fetchMedication } =
		useMedicationStore();

	React.useEffect(() => {
		if (userId) {
			fetchMedication(userId);
		}
	}, [userId]);

	const handleDelete = (medicationId: string, medicationName: string) => {
		Alert.alert(
			"Confirm Deletion",
			`Are you sure you want to delete "${medicationName}"? This action cannot be undone.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						if (!userId) return;

						await cancelMedicationReminders(medicationId);

						await deleteMedication(userId, medicationId);
					},
				},
			]
		);
	};

	return (
		<View className="flex-1 bg-[#f8f9fa]">
			<View
				className="bg-[#1976D2] absolute top-0 left-0 right-0"
				style={{ height: Platform.OS === "ios" ? 140 : 120 }}
			></View>

			<SafeAreaView
				className="flex-1"
				style={{ height: Platform.OS === "ios" ? 50 : 30 }}
			>
				{/* Header */}
				<View className="flex-row items-center px-5 pb-5 z-[1] pt-2">
					<TouchableOpacity
						className="w-10 h-10 rounded-[20px] bg-white justify-center items-center"
						style={style.buttonShadow}
						onPress={() => router.back()}
					>
						<Ionicons name="chevron-back" size={28} color={"#1976D2"} />
					</TouchableOpacity>
					<Text className="text-[28px] font-Outfit-Bold text-white ml-4">
						Delete Medication
					</Text>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ flexGrow: 1 }}
					className="p-5"
				>
					{loading && medications.length === 0 ? (
						<View className="flex-1 justify-center items-center">
							<ActivityIndicator size="large" color="#1976D2" />
						</View>
					) : medications.length > 0 ? (
						medications.map((med) => (
							<View
								key={med.id}
								style={[
									style.card,
									{ backgroundColor: med.color || "#fff" },
									style.cardShadow,
								]}
							>
								<View className="flex-1">
									<Text className="text-xl font-Outfit-Bold text-white">
										{med.name}
									</Text>
									<Text className="text-base font-Outfit-Regular text-white mt-1">
										{med.dosage}
									</Text>
								</View>
								<TouchableOpacity
									onPress={() => handleDelete(med.id, med.name)}
									className="p-3 bg-[rgba(255,255,255,0.3)] rounded-full"
									disabled={loading}
								>
									<Ionicons name="trash-outline" size={24} color="white" />
								</TouchableOpacity>
							</View>
						))
					) : (
						<View className="flex-1 items-center justify-center">
							<Text className="text-lg font-Outfit-SemiBold text-gray-500">
								No medications found.
							</Text>
						</View>
					)}
				</ScrollView>
			</SafeAreaView>
		</View>
	);
};

const style = StyleSheet.create({
	buttonShadow: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	card: {
		padding: 20,
		borderRadius: 16,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
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

export default DeleteMedicationPage;
