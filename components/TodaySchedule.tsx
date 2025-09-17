import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TodaySchedule = () => {
	return (
		<View className="px-5 mb-6">
			<View className="flex-row justify-between items-center mb-3">
				<Text className="font-Outfit-Bold text-2xl text-[#212121]">
					Today's Schedule
				</Text>
				<Link href={"/"}>
					<TouchableOpacity>
						<Text className="font-Outfit-SemiBold text-[#2E7D32] text-base">
							See All
						</Text>
					</TouchableOpacity>
				</Link>
			</View>
			{true ? (
				<View className="items-center p-7 bg-white rounded-2xl mt-2">
					<Ionicons name="medical-outline" size={48} color="#ccc" />
					<Text className="text-base font-Outfit-Regular text-[#666] mt-3 mb-5">
						No Medications Scheduled today
					</Text>
					<Link href={"/"}>
						<TouchableOpacity className="bg-[#1976D2] px-5 py-3 rounded-xl">
							<Text className="font-Outfit-SemiBold text-white">
								Add Medication
							</Text>
						</TouchableOpacity>
					</Link>
				</View>
			) : (
				[].map((medi) => {
					return (
						<View
							className="flex-row items-center bg-white rounded-2xl p-4 mb-3"
							style={styles.cardShadow}
						>
							<View className="w-[50px] h-[50px] rounded-3xl justify-center items-center mr-4">
								<Ionicons name="medical" size={24} />
							</View>
							<View className="flex-1 justify-between">
								<View>
									<Text className="text-base font-Outfit-SemiBold text-[#333] mb-1">
										name
									</Text>
									<Text className="text-[14px] text-[#666] mb-1">dosage</Text>
								</View>
								<View className="flex-row items-center">
									<Ionicons name="time-outline" size={16} color="#ccc" />
									<Text className="ml-1 text-[#666] text-[14px]">time</Text>
								</View>
							</View>
							{false ? (
								<View className="flex-row items-center bg-[#E8F5E9] px-3 py-2 rounded-xl ml-3">
									<Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
									<Text className="font-Outfit-SemiBold text-[14px] ml-1 text-[#4caf50]">
										Taken
									</Text>
								</View>
							) : (
								<TouchableOpacity
									className="py-2 px-4 rounded-2xl ml-3"
									onPress={() => console.log("hey")}
								>
									<Text className="text-white font-Outfit-SemiBold text-[14px]">
										Take
									</Text>
								</TouchableOpacity>
							)}
						</View>
					);
				})
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	cardShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 3,
	},
});

export default TodaySchedule;
