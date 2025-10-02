import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Platform,
	Switch,
	SafeAreaView,
	Alert,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useMedicationStore } from "@/store/useMedicationStore";
import { scheduleMedicationReminder } from "@/lib/notification";
import { Medication } from "@/types/Medication";

type MedicationFormData = Omit<Medication, "startDate"> & {
	startDate: Date;
};

const { width } = Dimensions.get("window");

const FREQUENCIES = [
	{
		id: "1",
		label: "Once daily",
		icon: "sunny-outline" as const,
		times: ["09:00"],
	},
	{
		id: "2",
		label: "Twice daily",
		icon: "sync-outline" as const,
		times: ["09:00", "21:00"],
	},
	{
		id: "3",
		label: "Three times daily",
		icon: "time-outline" as const,
		times: ["09:00", "15:00", "21:00"],
	},
	{
		id: "4",
		label: "Four times daily",
		icon: "repeat-outline" as const,
		times: ["09:00", "13:00", "17:00", "21:00"],
	},
	{ id: "5", label: "As needed", icon: "calendar-outline" as const, times: [] },
];

const DURATIONS = [
	{ id: "1", label: "7 days", value: 7 },
	{ id: "2", label: "14 days", value: 14 },
	{ id: "3", label: "30 days", value: 30 },
	{ id: "4", label: "90 days", value: 90 },
	{ id: "5", label: "Ongoing", value: -1 },
];

const UpdateMedicationPage = () => {
	const router = useRouter();
	const { userId } = useAuth();
	const { id: medicationId } = useLocalSearchParams<{ id: string }>();
	const { loading, updateMedication, medications } = useMedicationStore();

	const [form, setForm] = useState<MedicationFormData | null>(null);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [timePickerIndex, setTimePickerIndex] = useState(0);

	useEffect(() => {
		if (medicationId) {
			const medicationToUpdate = medications.find((m) => m.id === medicationId);
			if (medicationToUpdate) {
				setForm({
					...medicationToUpdate,
					startDate: new Date(medicationToUpdate.startDate), // Convert string to Date
				});
			}
		}
	}, [medicationId, medications]);

	const handleUpdate = async () => {
		if (!userId || !medicationId || !form) {
			Alert.alert("Error", "Required information is missing.");
			return;
		}

		// Validation
		const newErrors: { [key: string]: string } = {};
		if (!form.name.trim()) newErrors.name = "Medication name is required";
		if (!form.dosage.trim()) newErrors.dosage = "Dosage is required";
		if (!form.frequency) newErrors.frequency = "Frequency is required";
		if (!form.duration) newErrors.duration = "Duration is required";
		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			Alert.alert("Error", "Please fill in all required fields correctly");
			return;
		}

		try {
			// Prepare data for Firestore
			const { id, name, ...dataToUpdate } = form;
			const medicationDataForFirebase = {
				...dataToUpdate,
				startDate: form.startDate.toISOString(),
			};

			const updatedMed = await updateMedication(
				userId,
				medicationId,
				medicationDataForFirebase
			);

			if (updatedMed) {
				await scheduleMedicationReminder(updatedMed);
			}

			Alert.alert(
				"Success",
				"Medication updated successfully",
				[{ text: "OK", onPress: () => router.back() }],
				{ cancelable: false }
			);
		} catch (error) {
			console.error("Update error:", error);
			Alert.alert("Error", "Failed to update medication. Please try again.");
		}
	};

	if (!form) {
		return (
			<View>
				<ActivityIndicator size="large" color="#FFFFFF" />
				<Text>Loading medication details...</Text>
			</View>
		);
	}

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
				{/* Header Information */}
				<View className="flex-row items-center px-5 pb-5 z-[1] pt-2">
					<TouchableOpacity
						className="w-10 h-10 rounded-[20px] bg-white justify-center items-center"
						style={style.buttonShadow}
						onPress={() => router.back()}
					>
						<Ionicons name="chevron-back" size={28} color={"#1976D2"} />
					</TouchableOpacity>
					<Text className="text-[28px] font-Outfit-Bold text-white ml-4">
						Update Medication
					</Text>
				</View>

				<ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
					{/* Medication Name (Read-only) */}
					<View style={style.inputContainer}>
						<TextInput
							style={[style.mainInput]}
							value={form.name}
							editable={false}
						/>
					</View>

					{/* Dosage */}
					<View style={style.inputContainer}>
						<TextInput
							style={[style.mainInput, errors.dosage ? style.inputError : null]}
							placeholder="Dosage (e.g., 500mg)"
							value={form.dosage}
							onChangeText={(text) => setForm({ ...form, dosage: text })}
						/>
					</View>

					{/* Schedule */}
					<View className="mb-[25px]">
						<Text className="text-lg font-Outfit-Bold text-[#1a1a1a] mb-4">
							How often?
						</Text>
						<View style={style.optionsGrid}>
							{FREQUENCIES.map((freq) => (
								<TouchableOpacity
									key={freq.id}
									style={[
										style.optionCard,
										form.frequency === freq.label && style.selectedOptionCard,
									]}
									onPress={() =>
										setForm({
											...form,
											frequency: freq.label,
											times: freq.times,
										})
									}
								>
									<View
										style={[
											style.optionIcon,
											form.frequency === freq.label && style.selectedOptionIcon,
										]}
									>
										<Ionicons
											name={freq.icon}
											size={24}
											color={form.frequency === freq.label ? "white" : "#666"}
										/>
									</View>
									<Text
										style={[
											style.optionLabel,
											form.frequency === freq.label &&
												style.selectedOptionLabel,
										]}
									>
										{freq.label}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<Text className="text-lg font-Outfit-Bold text-[#1a1a1a] mb-4">
							For how long?
						</Text>
						<View style={style.optionsGrid}>
							{DURATIONS.map((dur) => (
								<TouchableOpacity
									key={dur.id}
									style={[
										style.optionCard,
										form.duration === dur.label && style.selectedOptionCard,
									]}
									onPress={() => setForm({ ...form, duration: dur.label })}
								>
									<Text
										style={[
											style.durationNumber,
											form.duration === dur.label &&
												style.selectedDurationNumber,
										]}
									>
										{dur.value > 0 ? dur.value : "∞"}
									</Text>
									<Text
										style={[
											style.optionLabel,
											form.duration === dur.label && style.selectedOptionLabel,
										]}
									>
										{dur.label}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						{/* Start Date */}
						<TouchableOpacity
							style={style.dateButton}
							onPress={() => setShowDatePicker(true)}
						>
							<Ionicons
								name="calendar"
								size={20}
								color="#1976D2"
								style={{ marginRight: 10 }}
							/>
							<Text>Starts: {form.startDate.toLocaleDateString()}</Text>
						</TouchableOpacity>
						{showDatePicker && (
							<DateTimePicker
								mode="date"
								value={form.startDate}
								onChange={(event, date) => {
									setShowDatePicker(false);
									if (date) {
										setForm({ ...form, startDate: date });
									}
								}}
							/>
						)}

						{/* Medication Times */}
						{form.frequency && form.frequency !== "As needed" && (
							<View style={{ marginTop: 15 }}>
								{form.times.map((time, index) => (
									<TouchableOpacity
										key={index}
										style={style.timeButton}
										onPress={() => {
											setTimePickerIndex(index);
											setShowTimePicker(true);
										}}
									>
										<Ionicons
											name="time-outline"
											size={20}
											color="#1976D2"
											style={{ marginRight: 10 }}
										/>
										<Text>{time}</Text>
									</TouchableOpacity>
								))}
							</View>
						)}

						{showTimePicker && (
							<DateTimePicker
								mode="time"
								value={(() => {
									const [h, m] = (form.times[timePickerIndex] || "00:00")
										.split(":")
										.map(Number);
									const d = new Date();
									d.setHours(h, m);
									return d;
								})()}
								onChange={(event, date) => {
									setShowTimePicker(false);
									if (date) {
										const newTime = date.toLocaleTimeString("default", {
											hour: "2-digit",
											minute: "2-digit",
										});
										setForm((prev) => {
											if (!prev) return null;
											return {
												...prev,
												times: prev.times.map((time, index) =>
													index === timePickerIndex ? newTime : time
												),
											};
										});
									}
								}}
							/>
						)}
					</View>

					{/* Reminder */}
					<View className="mb-[25px]">
						<View style={style.card}>
							<View className="flex-row items-center">
								<View className="w-10 h-10 rounded-2xl bg-[#f5f5f5] items-center justify-center mr-3">
									<Ionicons size={20} name="notifications" color={"#1a8e2d"} />
								</View>

								<View className="flex-1">
									<Text className="font-Outfit-SemiBold text-lg text-[#333]">
										Reminders
									</Text>
									<Text className="font-Outfit-Regular text-base text-[#666] mt-[2px]">
										Get notified when its time to take your medications
									</Text>
								</View>

								<Switch
									trackColor={{ false: "#ddd", true: "#1976D2" }}
									thumbColor={"white"}
									value={form.reminderEnabled}
									onValueChange={(value) =>
										setForm({ ...form, reminderEnabled: value })
									}
								/>
							</View>
						</View>
					</View>

					{/* Notes */}
					<View className="mb-[25px]">
						<View style={style.textAreaContainer}>
							<TextInput
								className="h-[100px] p-3 text-[#333] font-Outfit-Regular text-base"
								placeholder="Add notes or special instructions..."
								placeholderTextColor="#999"
								value={form.notes}
								onChangeText={(text) => setForm({ ...form, notes: text })}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
							/>
						</View>
					</View>
				</ScrollView>

				<View className=" p-5 bg-white border-t border-t-[#e0e0e0]">
					<TouchableOpacity
						className={`rounded-lg mb-3 bg-[#1976D2] py-4 flex-row items-center justify-center ${loading ? "opacity-70" : ""}`}
						onPress={handleUpdate}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator
								size="small"
								color="white"
								style={{ marginRight: 12 }}
							/>
						) : (
							<Text className="text-white font-Outfit-Bold text-lg">
								Update Medication
							</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						className="py-4 rounded-lg border border-[#e0e0e0] justify-center items-center bg-white"
						onPress={() => router.back()}
						disabled={loading}
					>
						<Text className="text-[#666] font-Outfit-Bold text-lg">Cancel</Text>
					</TouchableOpacity>
				</View>
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
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	inputContainer: {
		backgroundColor: "white",
		borderRadius: 16,
		marginBottom: 12,
		borderWidth: 1,
		padding: 15,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	mainInput: {
		fontSize: 20,
		color: "#333",
	},
	inputError: {
		borderColor: "#FF5252",
	},
	errorText: {
		color: "#ff5252",
		fontSize: 12,
		fontFamily: "Outfit-Regular",
		marginTop: 5,
	},
	dateButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		marginTop: 15,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
		marginBottom: 10,
	},
	optionsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginHorizontal: -5,
		marginTop: 5,
	},
	optionCard: {
		width: (width - 60) / 2,
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		margin: 5,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	selectedOptionCard: {
		borderColor: "#1976D2",
		backgroundColor: "#2196F3",
	},
	textAreaContainer: {
		backgroundColor: "white",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	optionIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	selectedOptionIcon: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	optionLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		textAlign: "center",
	},
	selectedOptionLabel: {
		color: "white",
	},
	durationNumber: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1a8e2d",
		marginBottom: 5,
	},
	selectedDurationNumber: {
		color: "white",
	},
	timesContainer: {
		marginTop: 20,
	},
	timeButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	timeIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	timeButtonText: {
		flex: 1,
		fontSize: 16,
		fontFamily: "Outfit-Regular",
		color: "#333",
	},
});

export default UpdateMedicationPage;
