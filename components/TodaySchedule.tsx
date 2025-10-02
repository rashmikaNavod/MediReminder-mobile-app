import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Medication } from "@/types/Medication";
import { useAuth } from "@clerk/clerk-expo";
import { useMedicationStore } from "@/store/useMedicationStore";

const getTodaysDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const TodaySchedule = ({ medications }: { medications: Medication[] }) => {
	const todayString = getTodaysDateString();
	const { userId } = useAuth();
	const { takeDose } = useMedicationStore();

	const handleTakePress = async (medication: Medication, time: string) => {
		if (!userId) {
			console.error("User not authenticated");
			return;
		}
		await takeDose(userId, medication, time, todayString);
	};

	return (
		<View className="px-5 mb-6">
			{/* ... Header  */}
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

			{medications.length === 0 ? (
				<View className="items-center p-7 bg-white rounded-2xl mt-2">
					<Ionicons name="medical-outline" size={48} color="#ccc" />
					<Text className="text-base font-Outfit-Regular text-[#666] mt-3 mb-5">
						No Medications Scheduled today
					</Text>
					<Link href={"/add"}>
						<TouchableOpacity className="bg-[#1976D2] px-5 py-3 rounded-xl">
							<Text className="font-Outfit-SemiBold text-white">
								Add Medication
							</Text>
						</TouchableOpacity>
					</Link>
				</View>
			) : (
				medications.map((medi) => {
					const takenTimesToday = medi.takenHistory?.[todayString] || [];

					return (
						<View
							key={medi.id}
							className="bg-white rounded-2xl p-4 mb-3"
							style={styles.cardShadow}
						>
							{/* Medication Details */}
							<View className="flex-row items-center">
								<View
									style={[
										styles.doseBadge,
										{ backgroundColor: `${medi.color}15` },
									]}
								>
									<Ionicons name="medical" size={24} color={medi.color} />
								</View>
								<View className="flex-1">
									<Text className="text-base font-Outfit-SemiBold text-[#333] mb-1">
										{medi.name}
									</Text>
									<Text className="text-[14px] text-[#666]">{medi.dosage}</Text>
								</View>
							</View>

							{/* Divider */}
							<View className="border-b border-gray-200 my-3" />

							{/* Dose Times List for Today */}
							<View>
								{medi.times.map((time, index) => {
									const isTaken = takenTimesToday.includes(time);

									return (
										<View
											key={index}
											className="flex-row items-center justify-between py-2"
										>
											<View className="flex-row items-center">
												<Ionicons
													name="time-outline"
													size={18}
													color={isTaken ? "#4CAF50" : "#999"}
												/>
												<Text
													className={`ml-2 text-base font-Outfit-SemiBold ${
														isTaken
															? "text-gray-400 line-through"
															: "text-gray-700"
													}`}
												>
													{time}
												</Text>
											</View>

											{isTaken ? (
												<View className="flex-row items-center bg-[#E8F5E9] px-3 py-2 rounded-full">
													<Ionicons
														name="checkmark-circle"
														size={18}
														color="#4CAF50"
													/>
													<Text className="font-Outfit-SemiBold text-[14px] ml-1 text-[#4CAF50]">
														Taken
													</Text>
												</View>
											) : (
												<TouchableOpacity
													className="py-2 px-5 rounded-full"
													style={{ backgroundColor: medi.color }}
													onPress={() => handleTakePress(medi, time)}
												>
													<Text className="text-white font-Outfit-SemiBold text-[14px]">
														Take
													</Text>
												</TouchableOpacity>
											)}
										</View>
									);
								})}
							</View>
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
	doseBadge: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
});

export default TodaySchedule;
